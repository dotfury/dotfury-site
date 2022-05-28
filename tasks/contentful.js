require("dotenv").config();

const fetch = require("node-fetch");

const sanitizer = require("./contentful-sanitizer");

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const BASE_URL = `https://cdn.contentful.com/spaces/${SPACE}/entries?access_token=${TOKEN}&content_type=`;

function parseAboutPage(data) {
  const { items } = data;

  console.log(sanitizer.sanitizeBasicData(items[0]));
}

async function getContentType(type) {
  return await fetch(`${BASE_URL}${type}`)
    .then((response) => response.json())
    .catch((e) => {
      throw new Error(e);
    });
}

async function getContent() {
  const aboutPage = await getContentType("aboutPage");
  const featuredWork = await getContentType("featuredWork");

  parseAboutPage(aboutPage);
}

getContent();
