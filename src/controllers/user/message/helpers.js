const errorStrings = require("../../../config/errorStrings");
const helpers = {};

helpers.sendMessageValidation = (body) => {
  const lang = body.lang || "en"
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

helpers.sendGroupMessageValidation = (body) => {
  const lang = body.lang || "en"
  if (!body.teamId) {
    return errorStrings.TEAM_ID_REQUIRED[lang];
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

}

module.exports = helpers;
