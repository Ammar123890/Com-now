const audioUpload = require('../../middlewares/multer');
const mediaController = require("../../controllers/user/media");
const { isUser } = require("../../middlewares/isUser");


module.exports = function (router) {
  router.post(
    "/audio",
    isUser,
    audioUpload, 
    mediaController.uploadVoiceMessage
  );


  router.get('/audio/printHello', (req, res) =>
  
  {
    console.log("Hello World");
  });
  ;
};
