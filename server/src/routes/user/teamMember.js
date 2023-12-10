const teamController = require("../../controllers/user/teamMember");
const { isUser } = require("../../middlewares/isUser");
const { isDoctor } = require("../../middlewares/isDoctor");
const { isTeamMember } = require("../../middlewares/isTeamMember");

module.exports = function (router) {
  /**
   * @api {POST} /user/team-member Add team member
   * @apiName Add team member
   * @apiGroup Team Member
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} fullName Team member's name
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/group-member", isDoctor, teamController.addMember);

  /**
   * @api {GET} /user/team-member Get all team members
   * @apiName Get all team members
   * @apiGroup Team Member
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (Query String) {String="blocked", "unblocked", "all"} [status="all"] Filter by status
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.get("/group-member", isUser, teamController.getMembers);

  /**
   * @api {PATCH} /user/team-member/status Change team member status
   * @apiName Change team member status
   * @apiGroup Team Member
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} teamMember id of the member
   * @apiParam (body) {String="blocked", "unblocked"} status Status to change
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.patch(
    "/team-member/status",
    isDoctor,
    teamController.changeMemberStatus
  );

  /**
   * @api {DELETE} /user/team-member/leave Leave team member
   * @apiName Leave team member
   * @apiGroup Team Member
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.delete("/team-member/leave", isTeamMember, teamController.leaveTeam);

  /**
   * @api {DELETE} /user/team-member Delete team member
   * @apiName Delete team member
   * @apiGroup Team Member
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (Query String) {String} teamMember id of the member
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.delete("/team-member", isDoctor, teamController.deleteMember);
};
