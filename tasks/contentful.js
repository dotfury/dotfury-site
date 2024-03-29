require("dotenv").config();

const fs = require("fs");
const fetch = require("node-fetch");
const showdown = require("showdown");

const sanitizer = require("./contentful-sanitizer");

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE}/entries?access_token=${TOKEN}&content_type=`;
const ASSET_URL = `https://cdn.contentful.com/spaces/${SPACE}/assets?access_token=${TOKEN}`;
const DATA_DIRECTORY = "./data";

if (!fs.existsSync(DATA_DIRECTORY)) {
  fs.mkdirSync(DATA_DIRECTORY);
}

const ABOUT_PAGE_FILE = `${DATA_DIRECTORY}/about.json`;
const FEATURED_WORK_FILE = `${DATA_DIRECTORY}/featured.json`;
const EXPERIMENTS_FILE = `${DATA_DIRECTORY}/experiment.json`;
const SAMPLES_FILE = `${DATA_DIRECTORY}/samples.json`;
const MEDIAS_FILE = `${DATA_DIRECTORY}/medias.json`;

const converter = new showdown.Converter();

let MEDIAS = [];
let assetStore = [];

function writeToFile(file, content) {
  fs.writeFile(file, JSON.stringify(content, null, "\t"), (error) => {
    if (error) {
      console.log("Error with file: ", file);
      console.log(error);
    }
  });
}

function parseMedias(data) {
  const fileUrls = data.map((d) => sanitizer.sanitizeImage(d));

  MEDIAS = MEDIAS.concat(fileUrls);

  return fileUrls;
}

async function createAssetStore(assets) {
  assetStore = assets.map(({ sys, fields }) => {
    const url = fields.file.url;

    MEDIAS = MEDIAS.concat(url);

    return {
      id: sys.id,
      url: url,
    };
  });
}

function parseAboutSection(data) {
  const content = sanitizer.sanitizeBasicData(data.items[0]);
  const { title, introduction, frontEnd, backEnd, creative } = content;

  writeToFile(ABOUT_PAGE_FILE, {
    title,
    introduction,
    frontEnd: converter.makeHtml(frontEnd),
    backEnd: converter.makeHtml(backEnd),
    creative: converter.makeHtml(creative),
  });
}

async function parseFeaturedWork(data) {
  const cleanedData = sanitizer.sanitizeArray(data.includes.Entry).sort((a, b) => a.order - b.order);
  const content = cleanedData.map(({ title, link, description, screenshot }) => {
    const imageId = screenshot.sys.id;
    const image = assetStore.find((m) => m.id === imageId);

    return {
      title,
      link,
      image: image.url,
      description: converter.makeHtml(description),
    };
  });

  writeToFile(FEATURED_WORK_FILE, content);
}

async function parseExperiments(data) {
  const cleanedData = sanitizer.sanitizeArray(data.items);
  const content = cleanedData.map(({ title, link }) => {
    return {
      title,
      link,
    };
  });

  writeToFile(EXPERIMENTS_FILE, content);
}

async function parseSamples(data) {
  const cleanedData = sanitizer.sanitizeArray(data.items);
  const content = cleanedData.map(({ title, link }) => {
    return {
      title,
      link,
    };
  });

  writeToFile(SAMPLES_FILE, content);
}

function getContentType(type) {
  return fetch(`${BASE_URL}${type}`)
    .then((response) => response.json())
    .catch((e) => {
      throw new Error(e);
    });
}

function getAssets() {
  return fetch(ASSET_URL)
    .then((response) => response.json())
    .catch((e) => {
      throw new Error(e);
    });
}

async function getContent() {
  const assets = await getAssets();
  await createAssetStore(assets.items);

  const aboutPage = await getContentType("aboutPage");
  const featuredWorks = await getContentType("featuredWorks");
  const experiments = await getContentType("creativeProject");
  const samples = await getContentType("codeSample");

  parseAboutSection(aboutPage);
  parseFeaturedWork(featuredWorks);
  parseExperiments(experiments);
  parseSamples(samples);

  writeToFile(MEDIAS_FILE, MEDIAS);
}

getContent();
