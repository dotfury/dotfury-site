import * as THREE from "three";
import GSAP from 'gsap';

import vertex from "../glsl/vertex.glsl?raw";
import fragment from "../glsl/fragment.glsl?raw";

const TEXTURE_LOADER = new THREE.TextureLoader();

type SizeType = {
  width: number;
  height: number;
}

type MediaType = {
  element: any;
  geometry: THREE.PlaneGeometry;
  scene: THREE.Scene;
  sizes: SizeType;
  viewport: SizeType;
};

export default class Media {
  element;
  image;
  geometry;
  scene;
  sizes;
  viewport;
  mesh: THREE.Mesh | null;
  bounds: DOMRect | null;
  isHovering: boolean;

  constructor ({ element, geometry, scene, sizes, viewport }: MediaType) {
    this.element = element;
    this.image = this.element.querySelector('img');
 
    this.geometry = geometry
    this.scene = scene
    this.sizes = sizes
    this.viewport = viewport

    this.mesh = null;
    this.bounds = null;

    this.isHovering = false;
 
    this.createMesh();
    this.createBounds();
    this.createEvents();
 
    this.onResize({ sizes, viewport });
  }

  createMesh() {
    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTexture: {value: TEXTURE_LOADER.load(this.image.src)},
        uScreenSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uProgress: { value: 0.0 },
        uAlpha: { value: 0.0 }
      },
      transparent: true
    });

    this.mesh = new THREE.Mesh(this.geometry, planeMaterial);
    this.scene.add(this.mesh);
  }

  createBounds() {
    const rect = this.element.getBoundingClientRect();

    this.bounds = {
      ...rect,
      left: rect.left,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    };

    this.updateScale();
    this.updateX();
    this.updateY();
  }

  createEvents() {
    this.element.addEventListener('mouseenter', () => {
      // TODO: on first hover before scroll alpha is always 0
      this.isHovering = true;
    });

    this.element.addEventListener('mouseleave', () => {
      this.isHovering = false;

      if(this.mesh) {
        const material = (this.mesh.material as THREE.ShaderMaterial);
        GSAP.to(material.uniforms.uProgress, {
          value: 0,
          ease: 'power1.inOut'
        });
        material.uniforms.uAlpha.value = 0.0;
      }
    });
  }

  updateScale() {
    if (this.mesh && this.bounds) {
      this.mesh.scale.x = this.viewport.width * this.bounds.width / this.sizes.width;
      this.mesh.scale.y = this.viewport.height * this.bounds.height / this.sizes.height;
    }
  }

  updateX(x = 0) {
    if (this.mesh && this.bounds) {
      this.mesh.position.x = -(this.viewport.width / 2) + (this.mesh.scale.x / 2);
      this.mesh.position.x += + ((this.bounds.left + x) / this.sizes.width) * this.viewport.width;
    }
  }

  updateY(y = 0) {
    if (this.mesh && this.bounds) {
      this.mesh.position.y = (this.viewport.height / 2) - (this.mesh.scale.y / 2);
      this.mesh.position.y -= ((this.bounds.top - y) / this.sizes.height) * this.viewport.height;
    }
  }

  updateWave() {
    if(this.mesh) {
      const material = (this.mesh.material as THREE.ShaderMaterial);
      material.uniforms.uAlpha.value = 1.0;
      GSAP.to(material.uniforms.uProgress, {
        value: material.uniforms.uProgress.value + 0.3,
        ease: 'power1.inOut'
      });
    }
  }

  update(y: number) {
    this.updateScale();
    this.updateX();
    this.updateY(y);

    if (this.isHovering) {
      this.updateWave();
    }
  }

  onResize(sizesObj: any) {
    if (sizesObj) {
      const { sizes, viewport } = sizesObj;

      this.sizes = sizes;
      this.viewport = viewport;
    }

    this.createBounds();
  }
}