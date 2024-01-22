const userController = require("../../controllers/user/user");
const { isUser, isTeamMember } = require("../../middlewares/isUser");

module.exports = function (router) {
  /**
   * @api {POST} /user/register Register user
   * @apiName Register User
   * @apiGroup User
   *
   * @apiParam (body) {String} email user's email
   * @apiParam (body) {String} password user's password
   * @apiParam (body) {String} fullName user's fullname
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/register", userController.register);
  /**
   * @api {POST} /user/login Login user
   * @apiName Login User
   * @apiGroup User
   *
   * @apiParam (body) {String} [email] user's email, required when user type is doctor
   * @apiParam (body) {String} [password] user's password, required when user type is doctor
   * @apiParam (body) {String} [enrollmentCode] user's enrollment code, required when user type is team member
   * @apiParam (body) {String="doctor", "team-member"} userType user type
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/login", userController.login);
  /**
   * @api {PUT} /my-profile/edit Edit my profile
   * @apiName Edit my profile
   * @apiGroup User
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   **/
  router.put("/my-profile/edit", isUser, userController.editProfile);
  /**
   * @api {POST} /user/subscription Change subscription status
   * @apiName Change subscription status
   * @apiGroup User
   *
   * @apiParam (body) {Boolean} isSubscribed true or false
   * @apiParam (body) {String} code Code of the subscription, required when isSubscribed is true
   * @apiParam (body) {String} expiry subscription expiry time
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/subscription", isUser, userController.changeSubscription);
 /**
  * @api {GET} /my-profile/get
  * @apiName Get my profile
  * @apiGroup User
  * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token 
  */
  router.get("/my-profile/get/:lang", isUser, userController.getMyProfile);
  router.get("/member/my-profile/get/:lang", isTeamMember, userController.getMyProfile);
  /**
   * @api {DELETE} /user Delete user account
   * @apiName Delete user account
   * @apiGroup User
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   * 
   * @apiParam (Query String) {String} [lang=en] Can be en or de
   * 
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.delete("/", isUser, userController.deleteUser);
  /**
   * @api {GET} /user/subscription Get all subscriptions
   * @apiName Get all subscriptions
   * @apiGroup User
   *
   * @apiParam (Query String) {String} [lang=en] Can be en or de
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.get("/subscription", isUser, userController.getAllSubscription);

  router.put("/verify-email", userController.verifyEmail);

  router.put("/verify-email-link", userController.verifyEmailLink);
  /**
   * @api {PUT} /user/change-password Change password
   * @apiName Change password
   * @apiGroup User
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} currentPassword user's current password
   * @apiParam (body) {String} newPassword user's new password
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.put("/change-password", isUser, userController.changePassword);
  /**
   * @api {PUT} /user/profile Edit profile
   * @apiName Edit profile
   * @apiGroup User
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {String} [fullName] user's fullName
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.put("/profile", isUser, userController.editProfile);
  /**
   * @api {POST} /user/password-recovery  Send password recovery email
   * @apiName Send Password Recovery Email
   * @apiGroup User
   *
   * @apiParam (body) {String} email user's email
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/password-recovery", userController.passwordRecoveryEmail);
  /**
   * @api {POST} /user/verify-code Password recovery code verification
   * @apiName Password Recovery Code Verification
   * @apiGroup User
   *
   * @apiParam (body) {String} code verification code
   * @apiParam (body) {String} email user's email
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/verify-code", userController.verifyPasswordRecoveryCode);
  /**
   * @api {POST} /user/reset-password Reset password after OTP verification
   * @apiName Reset password after OTP verification
   * @apiGroup User
   *
   * @apiParam (body) {String} email user's email
   * @apiParam (body) {String} newPassword user's new password
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/reset-password", userController.resetPassword);
  /**
   * @api {POST} /user/logout Logout user
   * @apiName Logout user
   * @apiGroup User
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/logout", isUser, userController.logout);
  /**
   * @api {POST} /user/fcm-token Save FCM Token
   * @apiName Save FCM Token
   * @apiGroup User
   *
   * @apiParam (body) {String} fcmToken FCM's token
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.post("/fcm-token", isUser, userController.saveFCMToken);
  /**
   * @api {PATCH} /user/order Change order of users
   * @apiName Change order of users
   * @apiGroup User
   *
   * @apiHeader {String} Authorization token should be sent. In the followng pattern Bearer {Token} replace by real token
   *
   * @apiParam (body) {Object[]} orders Array of templates users
   * @apiParam (body) {String} orders[user] Id of the user
   * @apiParam (body) {Number} orders[rank] Rank of the user
   *
   * @apiError message contains the error message. will be an array if the error is more than one, for example validation failed
   * @apiError success contains "false"
   */
  router.patch("/order", isUser, userController.setUserOrder);
};
