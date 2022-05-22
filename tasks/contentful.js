require("dotenv").config();

const fetch = require("node-fetch");

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

async function getContent() {
  const result = await fetch(
    `https://cdn.contentful.com/spaces/${SPACE}/entries?access_token=${TOKEN}&select=fields.body&content_type=aboutPage`
  )
    .then((response) => response.json())
    .catch((e) => console.log(e));

  console.log(result.items[0].fields.body);
}

getContent();
