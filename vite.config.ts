import { defineConfig } from "vite";
import pugPlugin from "vite-plugin-pug";

import about from "./data/about.json";
import featuredWork from "./data/featured.json";
import medias from "./data/medias.json";
import experiments from "./data/experiment.json";

const options = {};
const locals = { medias, featuredWork, about, experiments };

export default defineConfig({
  plugins: [pugPlugin(options, locals)],
});
