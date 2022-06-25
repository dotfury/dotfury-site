require("dotenv").config();

const fs = require("fs");
const fetch = require("node-fetch");
const showdown = require("showdown");

const sanitizer = require("./contentful-sanitizer");

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE}/entries?access_token=${TOKEN}&content_type=`;
const DATA_DIRECTORY = "./data";

if (!fs.existsSync(DATA_DIRECTORY)) {
  fs.mkdirSync(DATA_DIRECTORY);
}

console.log("URL: ", BASE_URL);

const ABOUT_PAGE_FILE = `${DATA_DIRECTORY}/about.json`;
const FEATURED_WORK_FILE = `${DATA_DIRECTORY}/featured.json`;
const EXPERIMENTS_FILE = `${DATA_DIRECTORY}/experiment.json`;
const SAMPLES_FILE = `${DATA_DIRECTORY}/samples.json`;
const MEDIAS_FILE = `${DATA_DIRECTORY}/medias.json`;

const converter = new showdown.Converter();

let MEDIAS = [];

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
  const medias = await parseMedias(data.includes.Asset);
  const cleanedData = sanitizer.sanitizeArray(data.items);
  const content = cleanedData.map(
    ({ title, link, description, screenshot }) => {
      const imageId = screenshot.sys.id;
      const image = medias.find((m) => m.includes(imageId));

      return {
        title,
        link,
        image,
        description: converter.makeHtml(description),
      };
    }
  );

  writeToFile(FEATURED_WORK_FILE, content);
}

async function parseExperiments(data) {
  const medias = await parseMedias(data.includes.Asset);
  const cleanedData = sanitizer.sanitizeArray(data.items);
  const content = cleanedData.map(({ title, link, image }) => {
    const imageId = image.sys.id;
    const imageContent = medias.find((m) => m.includes(imageId));

    return {
      title,
      link,
      image: imageContent,
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

async function getContent() {
  const aboutPage = await getContentType("aboutPage");
  const featuredWork = await getContentType("featuredWork");
  const experiments = await getContentType("creativeProject");
  const samples = await getContentType("codeSample");

  parseAboutSection(aboutPage);
  parseFeaturedWork(featuredWork);
  parseExperiments(experiments);
  parseSamples(samples);

  writeToFile(MEDIAS_FILE, MEDIAS);
}

getContent();
