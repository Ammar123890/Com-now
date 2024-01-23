const errorStrings = require("../../../config/errorStrings");
const globalHelpers = require("../../../utils/globalHelpers");
const helpers = {};

helpers.loginValidation = (body) => {
  const lang = body.lang || "en";
  const SUPPORTED_TYPES = ["doctor", "team-member"];

  console.log("body =>", body);

  if (!body.userType) {
    throw new Error(errorStrings.USER_TYPE_REQUIRED[lang]);
  }

  if (!SUPPORTED_TYPES.includes(body.userType)) {
    throw new Error(errorStrings.UNSUPPORTED_USER_TYPE[lang]);
  }
};

helpers.changePasswordValidation = (body) => {
  const lang = body.lang || "en";
  if (!body.currentPassword) {
    return errorStrings.CURRENT_PASSWORD_REQUIRED[lang];
  }

  if (!body.newPassword) {
    return errorStrings.NEW_PASSWORD_REQUIRED[lang];
  }
};

helpers.sendMessageValidation = (body) => {
  const lang = body.lang || "en";
  if (!body.user) {
    return errorStrings.USER_ID_REQUIRED[lang];
  }
  if (!body.text) {
    return errorStrings.MESSAGE_TEXT_REQUIRED[lang];
  }
  if (!body.type) {
    return errorStrings.TYPE_REQUIRED[lang];
  }
  if (
    body.type &&
    body.type.toLowerCase() !== "text" &&
    body.type.toLowerCase() !== "audio"
  ) {
    return errorStrings.UNSUPPORTED_TYPE[lang];
  }
};

helpers.setUserOrderValidation = (body) => {
  const orders = body.orders || [];
  const lang = body.lang || "en";
  const team = body.team || null;

  if (orders.length <= 0) {
    return errorStrings.ORDERS_ARRAY_EMPTY[lang];
  }

  if (!team) {
    return errorStrings.TEAM_ID_REQUIRED[lang];
  }

  for (let i = 0; i < orders.length; i++) {
    const item = orders[i];

    if (!item.user) {
      return errorStrings.USER_ID_REQUIRED[lang];
    }

    if (typeof item.rank !== "number") {
      return errorStrings.RANK_SHOULD_NUMBER[lang];
    }
  }
};

module.exports = helpers;
