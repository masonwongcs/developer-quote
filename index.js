const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const command = require("./api/command");
const image = require("./api/image");

app.use("/test", image);
app.use("/command", command);

app.listen(PORT, function () {
  console.log("Listen to port ", PORT);
});
