const mediaController = require("../../controllers/user/media");
const { isUser } = require("../../middlewares/isUser");
const {audioUpload} = require("../../middlewares/multer")


module.exports = function (router) {
  /**
   * @api {POST} /user/audio Upload voice message
   * @apiName Upload voice message
   * @apiGroup User
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   * 
   * @apiParam (formData) {File} audio audio file
   * 
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post(
    "/audio",
    isUser,
    audioUpload.single("audio"),
    mediaController.uploadVoiceMessage
  );
};
