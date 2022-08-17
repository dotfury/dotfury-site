import * as THREE from "three";

import Media from "./media";

type SizeType = {
  width: number;
  height: number;
};

export default class GlScene {
  sizes: SizeType;
  viewport: SizeType;
  canvas: HTMLCanvasElement;
  renderer;
  camera;
  scene;
  clock;
  medias: any[];

  constructor() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas = document.querySelector("canvas.webgl")!;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas, alpha: true });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.width, 0.01, 100);
    this.camera.position.z = 1;
    this.scene = new THREE.Scene();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height,
      width,
    };

    this.clock = new THREE.Clock();

    this.medias = [];

    this.setupResize();
    this.createMedias();
    this.render();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height,
      width,
    };

    if (this.medias.length > 0) {
      this.medias.forEach((media) =>
        media.onResize({
          sizes: this.sizes,
          viewport: this.viewport,
        })
      );
    }
  }

  createMedias() {
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const mediaElements = document.querySelectorAll(".featured-work");
    this.medias = Array.from(mediaElements).map((element) => {
      const media = new Media({
        element,
        geometry: planeGeometry,
        scene: this.scene,
        sizes: this.sizes,
        viewport: this.viewport,
      });

      return media;
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    if (this.medias.length > 0) {
      this.medias.forEach((media) => media.update(window.scrollY));
    }

    window.requestAnimationFrame(this.render.bind(this));
  }
}
