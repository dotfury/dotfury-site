import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json?url";
import GSAP from 'gsap';

import Media from "./media";

type SizeType = {
  width: number;
  height: number;
};

type CursorType = {
  x: number;
  y: number;
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
  text: THREE.Mesh;
  cursor: CursorType;
  cameraTarget: THREE.Vector3;

  constructor() {
    this.text = new THREE.Mesh();
    this.clock = new THREE.Clock();
    this.medias = [];
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
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.scene = new THREE.Scene();
    this.cameraTarget = new THREE.Vector3(0, 0, 0);

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height,
      width,
    };

    this.cursor = {
      x: 0,
      y: 0
    };

    const fontLoader = new FontLoader();

    fontLoader.load(typefaceFont, (font) => {
      const textGeometry = new TextGeometry("dotfury", {
        font,
        size: 0.6,
        height: 0.4,
        curveSegments: 2,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: new THREE.Color('#f21e8c') });
      this.text = new THREE.Mesh(textGeometry, textMaterial);
      this.text.position.z = -3;
      this.scene.add(this.text);
    });

    this.setupResize();
    this.setupMouseEvents();
    this.createMedias();
    this.render();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  setupMouseEvents() {
    window.addEventListener("mousemove", ({ clientX, clientY }) => {
      this.cursor.x = clientX / this.sizes.width - 0.5;
      this.cursor.y = -(clientY / this.sizes.height - 0.5);
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
    if (this.medias.length > 0) {
      this.medias.forEach((media) => media.update(window.scrollY));
    }
    
    if (this.text) {
      this.text.position.y = window.scrollY / 150;

      GSAP.to(this.text.rotation, {
        duration: 0.2,
        ease: "power1.in",
        x: -this.cursor.y * 0.5,
        y: this.cursor.x * 0.5,
      });
    }

    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}
