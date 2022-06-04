import Preloader from "./classes/preloader";

import "./styles/index.scss";

const preloader = new Preloader(".preloader");
const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
