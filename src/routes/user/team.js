const teamController = require("../../controllers/user/team");
const { isDoctor } = require("../../middlewares/isDoctor");
const { isUser } = require("../../middlewares/isUser");

module.exports = function (router) {
  /**
   * @api {POST} /user/group Create new group
   * @apiName Create new team
   * @apiGroup Team
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} name Group's name
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/group", isDoctor, teamController.createNewTeam);
  /**
   * @api {POST} /user/group/get-all-groups Get all groups
   * @apiName Get all groups
   * @apiGroup Team
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   */
  router.get("/group/get-all-groups", isDoctor, teamController.getAllTeams);
  /**
   * @api {POST} /user/group/get-by-id
   * @apiName Get group by id
   * @apiGroup Team
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   * @apiParam (body) {String} id Group's id
   */
  router.get("/group/get-by-id/:id", isDoctor, teamController.getTeamById);
  /**
   * @api {POST} /user/team/online-users Get all online users
   * @apiName Get all online users
   * @apiGroup Team
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.get("/group/online-users/:id", isUser, teamController.getOnlineUsers);
  /**
   * @api {PATCH} /user/team Edit team
   * @apiName Edit team
   * @apiGroup Team
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} [name] Team's name
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.patch("/group/edit", isDoctor, teamController.editTeam);

};
