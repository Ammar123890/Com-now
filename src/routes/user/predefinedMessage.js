const predefinedMessageController = require("../../controllers/user/predefinedMessage");
const { isDoctor } = require("../../middlewares/isDoctor");
const { isUser } = require("../../middlewares/isUser");

module.exports = function (router) {
  /**
   * @api {POST} /user/predefinedmessage Create new predefined message
   * @apiName Create new predefined message
   * @apiGroup Predefined Message
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} text Message Text
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post(
    "/predefinedmessage",
    isDoctor,
    predefinedMessageController.createMessage
  );

  /**
   * @api {DELETE} /user/predefinedmessage Delete predefined message
   * @apiName Delete predefined message
   * @apiGroup Predefined Message
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} predefinedMessage Message mongodb id
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.delete(
    "/predefinedmessage",
    isDoctor,
    predefinedMessageController.deleteMessage
  );

  /**
   * @api {PATCH} /user/predefinedmessage Edit predefined message
   * @apiName Edit predefined message
   * @apiGroup Predefined Message
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} predefinedMessage Message mongodb id
   * @apiParam (body) {String} text Message text
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.patch(
    "/predefinedmessage",
    isDoctor,
    predefinedMessageController.editMessage
  );

  /**
   * @api {PATCH} /user/predefinedmessage/order Change order of predefined message
   * @apiName Change order of predefined message
   * @apiGroup Predefined Message
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {Object[]} orders Array of templates order
   * @apiParam (body) {String} orders[message] Id of the message template
   * @apiParam (body) {Number} orders[rank] Rank of the message
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.patch(
    "/predefinedmessage/order",
    isUser,
    predefinedMessageController.setMessagesOrder
  );

  /**
   * @api {GET} /user/predefinedmessage Get predefined message
   * @apiName Get predefined message
   * @apiGroup Predefined Message
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.get(
    "/predefinedmessage",
    isUser,
    predefinedMessageController.getMessage
  );
};
