const multer = require("multer");
const randomstring = require("randomstring");

const audioUploadConfig = multer.diskStorage({
  filename: function (req, file, cb) {
    if (!file.originalname) {
      file.originalname = randomstring.generate({
        length: 16,
        charset: "alphanumeric",
      });
    }
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "uploads/audio");
  },
});

const audioUpload = multer({ storage: audioUploadConfig });
module.exports = { audioUpload };
