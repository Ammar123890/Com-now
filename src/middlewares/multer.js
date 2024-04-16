const multer = require("multer");
const randomstring = require("randomstring");

const audioUploadConfig = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log("Processing file:", file);
    if (!file.originalname.match(/\.(mp3|wav|m4a)$/i)) {
      return cb(new Error('Only audio files are allowed!'), false);
    }
    if (!file.originalname) {
      file.originalname = randomstring.generate({
        length: 16,
        charset: "alphanumeric",
      });
    }
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    console.log("Saving file to uploads/audio");
    cb(null, "uploads/audio");
  },
});

const audioUpload = multer({ storage: audioUploadConfig }).single('audio');
module.exports = audioUpload;
