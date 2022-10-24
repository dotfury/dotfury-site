import WebGL from "three/examples/jsm/capabilities/WebGL";

import Preloader from "./classes/preloader";
import Title from "./classes/title";
import Introduction from "./classes/introduction";
import GlScene from "./classes/glScene";

import "./styles/index.scss";

const initPage = () => {
  // title
  new Title();

  // introduction
  new Introduction();

  if (WebGL.isWebGLAvailable() && !window.matchMedia('(any-pointer: coarse)').matches) {
    document.body.classList.add("webgl-available");
    new GlScene();
  } else {
    document.body.classList.add("webgl-unavailable");
  }
};

// preload
const preloader = new Preloader(initPage);
preloader.start();

// copyright
const footer = document.querySelector("footer");
const copyright = footer?.querySelector(".copyright");
const year = new Date().getFullYear();
const copyrightTextNode = document.createTextNode(String(year));

copyright?.appendChild(copyrightTextNode);
