const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const command = require("./api/command");
const { image, imageResponse } = require("./api/image");

app.use("/image", image);
app.use("/imageResponse", imageResponse);
app.use("/command", command);

app.listen(PORT, function () {
  console.log("Listen to port ", PORT);
});
