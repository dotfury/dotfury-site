import * as THREE from "three";

import Media from './media';

export default class GlScene {
  sizes;
  viewport;
  mouse;
  canvas;
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
    this.viewport = {width: window.innerWidth, height: window.innerHeight};
    this.mouse = {
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    };
    this.canvas = document.querySelector("canvas.webgl");
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas!, alpha: true });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera = new THREE.PerspectiveCamera(45, this.sizes.width / this.sizes.width, 0.01, 100);
    this.camera.position.z = 1;
    this.scene = new THREE.Scene();

    this.clock = new THREE.Clock();

    this.medias = [];

    this.setupResize();
    this.setupMouseEvents();
    // this.addObjects();
    this.createMedias();
    this.render();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  setupMouseEvents() {
    window.addEventListener("scroll", () => {
      this.mouse.scrollX = window.scrollX;
      this.mouse.scrollY = window.scrollY;
    });

    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      this.mouse.x = clientX / this.sizes.width - 0.5;
      this.mouse.y = clientY / this.sizes.height - 0.5;
    });
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
      width
    };

    if (this.medias.length > 0) {
      this.medias.forEach(media => media.onResize({
        sizes: this.sizes,
        viewport: this.viewport
      }));
    }
  }

  addObjects() {
    // const planeMaterial = new THREE.ShaderMaterial({
    //   vertexShader: vertex,
    //   fragmentShader: fragment,
    // });

    // const mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    // this.mesh = mesh;
    // this.scene.add(this.mesh);
  }

  createMedias() {
    const planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const mediaElements = document.querySelectorAll('.featured-work-image');
    this.medias = Array.from(mediaElements).map(element => {
      const media = new Media({
        element,
        geometry: planeGeometry,
        scene: this.scene,
        sizes: this.sizes,
        viewport: this.viewport
      });

      return media;
    });
    console.log(this.medias);
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();

    // this.mesh.material.uniforms.uTime.value = elapsedTime;

    this.renderer.render(this.scene, this.camera);

    // if (this.medias.length > 0) {
    //   this.medias.forEach(media => media.update())
    // }

    window.requestAnimationFrame(this.render.bind(this));
  }
}
