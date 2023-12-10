const controller = require("../../controllers/user/call");
const { isUser } = require("../../middlewares/isUser");

module.exports = function (router) {
  /**
   * @api {POST} /user/call Call a user
   * @apiName Call a user
   * @apiGroup Call
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} user recipient user id
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/call", isUser, controller.callAUser);

  /**
   * @api {PATCH} /user/call/status Call status change
   * @apiName Call status change
   * @apiGroup Call
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} user Id of the user who called you
   * @apiParam (body) {String="accepted", "rejected"} status status of the call
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.patch("/call/status", isUser, controller.callStatusChange);
};
