const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "slack-image",
  api_key: "782992362552263",
  api_secret: "z2oTe49DkFECaBband4Ne5QOECQ",
});

module.exports = (path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(path, function (error, result) {
      const { url, secure_url } = result;
      // console.log(error, result);
      if (error) {
        console.log(error);
      }
      resolve(secure_url);
    });
  });
};
