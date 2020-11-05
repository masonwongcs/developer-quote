const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");

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

const slackHook = async ({ url, text }) => {
  await axios.post(
    url
      ? url
      : "https://hooks.slack.com/services/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",
    {
      text: text,
    }
  );
};

app.use("/test", async function (req, res) {
  const excuse = await getExcuse();
  console.log(excuse);
  await slackHook({ text: excuse });
  res.send(excuse);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/command", async function (req, res) {
  const excuse = await getExcuse();
  const { channel_name, user_name, response_url } = req.body;
  await slackHook({
    url: response_url,
    text: `${user_name} - "${excuse}"`,
  });
  res.send(excuse);
});

app.listen(PORT, function () {
  console.log("Listen to port ", PORT);
});
