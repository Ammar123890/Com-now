const controller = {};
const keys = require("../../../config/keys")
controller.uploadVoiceMessage = async function (req, res, next) {
  try {
    const file = req.file
    res.json({
      data: {
        path: file.path,
        audioUrl: keys.BASE_URL.replace("api", "") + file.path
      },
      success: true,
      message: "Successfull",
    });
  } catch (e) {
    console.log("ERRR", e);
    next({ message: e, status: 400 });
  }
};

module.exports = controller;
