const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { getExcuse, slackHook } = require("../utils/index");
const Jimp = require("jimp");
const upload = require("../utils/upload");
const { bg1, bg2, bg3, bg4, bg5, bg6 } = require("../utils/imageBase64");

const imageArr = [bg1, bg2, bg3, bg4, bg5, bg6];

const readImage = (imageUrl, message, upload, type) => {
  return new Promise((resolve) => {
    Jimp.read(Buffer.from(imageUrl, "base64"))
      .then(async (resolvedImage) => {
        // const font = await Jimp.loadFont(
        //   path.resolve(__dirname, "../fonts/TimesNewRoman/font.fnt")
        // );
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        const width = resolvedImage.getWidth();
        const MAX_WIDTH = width * 0.5;
        const fonts = Jimp.FONT_SANS_64_WHITE
        const fontHeight = Jimp.measureTextHeight(font, message, MAX_WIDTH);

        const height = resolvedImage.getHeight();

        const x = 40;
        const y = height / 2 - fontHeight / 2;

        resolvedImage.print(font, x, y, message, MAX_WIDTH);
        const base64 = await resolvedImage.getBase64Async("image/jpeg");
        if (upload) {
          const uploadUrl = upload(base64);
          resolve(uploadUrl);
        } else {
          if (type === "buffer") {
            const buffer = await resolvedImage.getBufferAsync("image/jpeg");
            resolve(buffer);
          } else {
            resolve(base64);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

app.use(bodyParser.urlencoded({ extended: true }));
const image = async (req, res) => {
  const excuse = await getExcuse();
  const random = Math.ceil(Math.random() * 5);
  const randomImage = imageArr[random];
  // const { channel_name, user_name, response_url } = req.body;
  const image = await readImage(randomImage, excuse, upload);
  await slackHook({
    text: image,
  });

  res.send(image);
};

const imageResponse = async (req, res) => {
  const excuse = await getExcuse();
  const random = Math.ceil(Math.random() * 5);
  const randomImage = imageArr[random];
  const data = await readImage(randomImage, excuse, false, "buffer");
  const img = Buffer.from(data, "base64");

  res.writeHead(200, {
    "Content-Type": "image/jpeg",
    "Content-Length": img.length,
  });
  res.end(img);
};

module.exports = {
  image,
  imageResponse,
};
