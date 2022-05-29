import "./style.scss";

import about from "../data/about.json";
import featuredWork from "../data/featured.json";
import medias from "../data/medias.json";

const app = document.querySelector<HTMLDivElement>("#app")!;

console.log(about);
console.log(featuredWork);
console.log(medias);

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
