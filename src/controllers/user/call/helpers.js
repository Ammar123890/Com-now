const errorStrings = require("../../../config/errorStrings");
const helpers = {};

helpers.callAUserValidation = (body) => {
  const lang = body.lang || "en";

  if (!body.user) {
    return errorStrings.USER_ID_REQUIRED[lang];
  }
};

helpers.callStatusChangeValidation = (body) => {
  const lang = body.lang || "en";

  if (!body.user) {
    return errorStrings.USER_ID_REQUIRED[lang];
  }
};

module.exports = helpers;
