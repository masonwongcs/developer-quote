const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { getExcuse, slackHook } = require("../utils/index");

app.use(bodyParser.urlencoded({ extended: true }));
module.exports = async (req, res) => {
  const excuse = await getExcuse();
  const { channel_name, user_name, response_url } = req.body;
  await slackHook({
    url: response_url,
    text: `${user_name} - "${excuse}"`,
  });
  res.send(excuse);
};
