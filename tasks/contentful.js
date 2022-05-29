require("dotenv").config();

const fs = require("fs");
const fetch = require("node-fetch");

const sanitizer = require("./contentful-sanitizer");

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE}/entries?access_token=${TOKEN}&content_type=`;

const ABOUT_PAGE_FILE = "./data/about.json";
const FEATURED_WORK_FILE = "./data/featured.json";
const MEDIAS_FILE = "./data/medias.json";

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

function parseAboutPage(data) {
  const content = sanitizer.sanitizeBasicData(data.items[0]);

  writeToFile(ABOUT_PAGE_FILE, content);
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
        description,
      };
    }
  );

  writeToFile(FEATURED_WORK_FILE, content);
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

  parseAboutPage(aboutPage);
  parseFeaturedWork(featuredWork);

  writeToFile(MEDIAS_FILE, MEDIAS);
}

getContent();
