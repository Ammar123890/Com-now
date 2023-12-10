const errorStrings = require("../../config/errorStrings");
const PredefinedMessage = require("./index");

const methods = {};

methods.createMessage = async (body, user) => {
  try {
    const lang = body.lang || "en"
    const payload = {
      text: body.text,
      team: user.team,
    };

    const query = {
      text: { $regex: new RegExp(`^${body.text}$`), $options: "i" },
      team: user.team,
    };

    const getPredefinedMessage = await PredefinedMessage.findOne(query).lean();
    if (getPredefinedMessage) {
      throw new Error(errorStrings.PREDEFINED_MESSAGE_EXIST[lang]);
    }

    const predefinedMessage = new PredefinedMessage(payload);
    await predefinedMessage.save();

    return predefinedMessage;
  } catch (e) {
    throw e;
  }
};

methods.deleteMessage = async (body, user) => {
  const lang = body.lang || "en"
  const query = {
    team: user.team,
    isDeleted: false,
    isActive: true,
    _id: body.predefinedMessage,
  };

  const getPredefinedMessage = await PredefinedMessage.findOne(query).lean();
  if (!getPredefinedMessage) {
    throw new Error(errorStrings.PREDEFINED_MESSAGE_NOT_FOUND[lang]);
  }

  await PredefinedMessage.findByIdAndUpdate(body.predefinedMessage, {
    isActive: false,
    isDeleted: true,
  });
};

methods.editMessage = async (body, user) => {
  const lang = body.lang || "en"
  const query = {
    team: user.team,
    isDeleted: false,
    isActive: true,
    _id: body.predefinedMessage,
  };

  const getPredefinedMessage = await PredefinedMessage.findOne(query).lean();
  if (!getPredefinedMessage) {
    throw new Error(errorStrings.PREDEFINED_MESSAGE_NOT_FOUND[lang]);
  }

  const predefinedMessage = await PredefinedMessage.findByIdAndUpdate(body.predefinedMessage, {
    text: body.text,
  }, {new: true}).lean();

  return predefinedMessage
};
module.exports = methods;
