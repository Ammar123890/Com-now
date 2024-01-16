const messgaeController = require("../../controllers/user/message");
const { isUser } = require("../../middlewares/isUser");

module.exports = function (router) {
  /**
   * @api {POST} /user/message Send Message
   * @apiName Send Message
   * @apiGroup User
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} user reciepient user id
   * @apiParam (body) {String} text message text
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/message", isUser, messgaeController.sendMessage);

  /**
   * @api {GET} /user/message Fetch Message
   * @apiName Fetch Message
   * @apiGroup User
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.get("/message", isUser, messgaeController.getMessages);
};
