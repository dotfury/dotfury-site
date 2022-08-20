import { defineConfig } from "vite";
import pugPlugin from "vite-plugin-pug";

import about from "./data/about.json";
import featuredWork from "./data/featured.json";
import medias from "./data/medias.json";
import experiments from "./data/experiment.json";
import samples from "./data/samples.json";

const options = {};
const locals = { medias, featuredWork, about, experiments, samples };

export default defineConfig({
  plugins: [pugPlugin(options, locals)],
  publicDir: "./data",
});
