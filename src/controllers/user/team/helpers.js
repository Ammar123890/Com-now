const errorStrings = require("../../../config/errorStrings");
const helpers = {};

helpers.createNewTeamValidation = (body) => {
  const lang = body.lang || "en"
  if (!body.name) {
    return errorStrings.TEAM_NAME_REQUIRED[lang];
  }
};

module.exports = helpers;
