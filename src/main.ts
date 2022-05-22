import "./style.scss";

const app = document.querySelector<HTMLDivElement>("#app")!;

import.meta.env.VITE_CONTENTFUL_SPACE_ID;
import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
