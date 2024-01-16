const errorStrings = require("../../../config/errorStrings");
const helpers = {};

helpers.createMessageValidation = (body) => {
  const lang = body.lang || "en";

  if (!body.text) {
    return errorStrings.MESSAGE_TEXT_REQUIRED[lang];
  }
};

helpers.deleteMessageValidation = (body) => {
  const lang = body.lang || "en";
  if (!body.predefinedMessage) {
    return errorStrings.PREDEFINED_MESSAGE_ID_REQUIRED[lang];
  }
};

helpers.editMessageValidation = (body) => {
  const lang = body.lang || "en";
  if (!body.predefinedMessage) {
    return errorStrings.PREDEFINED_MESSAGE_ID_REQUIRED[lang];
  }
  if (!body.text) {
    return errorStrings.MESSAGE_TEXT_REQUIRED[lang];
  }
};

helpers.setMessageOrderValidation = (body) => {
  const orders = body.orders || [];
  const lang = body.lang || "en";

  if (orders.length <= 0) {
    return errorStrings.ORDERS_ARRAY_EMPTY[lang];
  }

  for (let i = 0; i < orders.length; i++) {
    const item = orders[i];

    if (!item.message) {
      return errorStrings.PREDEFINED_MESSAGE_ID_REQUIRED[lang];
    }

    if (typeof item.rank !== "number") {
      return errorStrings.RANK_SHOULD_NUMBER[lang];
    }
  }
};

module.exports = helpers;
