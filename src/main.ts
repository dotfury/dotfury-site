import Preloader from "./classes/preloader";
import Title from "./classes/title";
import Introduction from "./classes/introduction";

import "./styles/index.scss";

const initPage = () => {
  // title
  new Title();

  // introduction
  new Introduction();
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
