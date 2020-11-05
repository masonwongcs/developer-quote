const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { getExcuse, slackHook } = require("../utils/index");
const Jimp = require("jimp");
const upload = require("../utils/upload");

const imageArr = [
  "../images/bg-1.jpg",
  "../images/bg-2.jpg",
  "../images/bg-3.jpg",
  "../images/bg-4.jpg",
  "../images/bg-5.jpg",
  "../images/bg-6.jpg",
];

const readeImage = (imageUrl, message) => {
  return new Promise((resolve) => {
    Jimp.read(path.join(__dirname, imageUrl))
      .then(async (resolvedImage) => {
        const font = await Jimp.loadFont(
          path.join(__dirname, "../fonts/TimesNewRoman/font.fnt")
        );
        const width = resolvedImage.getWidth();
        const MAX_WIDTH = width * 0.5;
        const fontHeight = Jimp.measureTextHeight(font, message, MAX_WIDTH);

        const height = resolvedImage.getHeight();

        const x = 40;
        const y = height / 2 - fontHeight / 2;

        resolvedImage.print(font, x, y, message, MAX_WIDTH);
        const base64 = await resolvedImage.getBase64Async("image/jpeg");
        const uploadUrl = upload(base64);
        resolve(uploadUrl);
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

app.use(bodyParser.urlencoded({ extended: true }));
module.exports = async (req, res) => {
  const excuse = await getExcuse();
  const random = Math.ceil(Math.random() * 5);
  const randomImage = imageArr[random];
  // const { channel_name, user_name, response_url } = req.body;
  const image = await readeImage(randomImage, excuse);
  await slackHook({
    text: image,
  });

  res.send(image);
};
