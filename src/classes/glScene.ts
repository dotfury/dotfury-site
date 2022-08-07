import * as THREE from "three";

// load glsl?
// import vertex from "../glsl/vertex.glsl";
// import fragment from "../glsl/fragment.glsl";

export default class GlScene {
  private sizes;
  private mouse;
  private canvas;
  private renderer;
  private camera;
  private scene;
  private clock;
  private mesh: any;

  constructor() {
    console.log(THREE);
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
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

    this.setupResize();
    this.setupMouseEvents();
    this.addObjects();
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
  }

  addObjects() {
    const geometry = new THREE.PlaneGeometry(0.4, 0.6, 16, 16);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
      },
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
    this.scene.add(this.mesh);
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();

    this.mesh.material.uniforms.uTime.value = elapsedTime;

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}
