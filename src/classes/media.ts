import * as THREE from "three";

import vertex from "../glsl/vertex.glsl?raw";
import fragment from "../glsl/fragment.glsl?raw";

const TEXTURE_LOADER = new THREE.TextureLoader();

const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
});

type MediaType = {
  element: any;
  geometry: THREE.PlaneGeometry;
  scene: THREE.Scene;
  sizes: {}
  viewport: {}
};

export default class Media {
  element;
  image;
  geometry;
  scene;
  sizes;
  viewport;

  constructor ({ element, geometry, scene, sizes, viewport }: MediaType) {
    this.element = element;
    this.image = this.element;
 
    this.geometry = geometry
    this.scene = scene
    this.sizes = sizes
    this.viewport = viewport
 
    // this.createMesh()
    // this.createBounds()
 
    // this.onResize()
  }
}