import Preloader from "./classes/preloader";
import Introduction from "./classes/introduction";

import "./styles/index.scss";

// preload
const preloader = new Preloader(".preloader");
preloader.start();

// introduction
new Introduction();

// copyright
const footer = document.querySelector("footer");
const copyright = footer?.querySelector(".copyright");
const year = new Date().getFullYear();
const copyrightTextNode = document.createTextNode(String(year));

copyright?.appendChild(copyrightTextNode);
