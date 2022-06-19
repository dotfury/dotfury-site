import Preloader from "./classes/preloader";

import "./styles/index.scss";

const preloader = new Preloader(".preloader");
preloader.start();

// copyright
const footer = document.querySelector("footer");
const copyright = footer?.querySelector(".copyright");
const year = new Date().getFullYear();
const copyrightTextNode = document.createTextNode(String(year));

copyright?.appendChild(copyrightTextNode);
