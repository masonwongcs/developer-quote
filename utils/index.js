const axios = require("axios");
const cheerio = require("cheerio");

const webHookDefaultUrl =
  "https://hooks.slack.com/services/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";

const getExcuse = () => {
  return new Promise((resolve) => {
    axios.get("http://developerexcuses.com/").then((response) => {
      const data = response.data;
      const $ = cheerio.load(data);
      const quote = $(".wrapper center a").text();
      resolve(quote);
    });
  });
};

const slackHook = ({ url, text }) => {
  return new Promise((resolve) => {
    axios.post(url ? url : webHookDefaultUrl, {
      text: text,
      response_type: "in_channel",
    });
    resolve();
  });
};

module.exports = {
  getExcuse,
  slackHook,
};
