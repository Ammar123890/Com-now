const _ = require("lodash");

const errorStrings = require("../../config/errorStrings");
const PredefinedMessage = require("./index");
const PredefinedMessageOrder = require("../PredefinedMessageOrder");

const methods = {};

methods.createMessage = async (body, user) => {
  const lang = body.lang || "en";
  try {
    if (!user.defaultTeam) {
      throw new Error(errorStrings.TEAM_NOT_EXIST[lang]);
    }
    const payload = {
      text: body.text,
      team: user.defaultTeam,
    };

    const query = {
      text: { $regex: new RegExp(`^${body.text}$`), $options: "i" },
      team: user.defaultTeam,
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
  const lang = body.lang || "en";
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
  const lang = body.lang || "en";
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

  const predefinedMessage = await PredefinedMessage.findByIdAndUpdate(
    body.predefinedMessage,
    {
      text: body.text,
    },
    { new: true }
  ).lean();

  return predefinedMessage;
};

methods.getAllMessages = async (user, sort) => {
  try {
    console.log(user.defaultTeam);
    const query = {
      team: user.defaultTeam,
      isActive: true,
      isDeleted: false,
    };

    let orders = await PredefinedMessageOrder.findOne({ user: user._id });
    if (!orders) {
      orders = {
        orders: [],
      };
    }

    const rankMap = orders.orders.reduce((acc, item) => {
      acc[item.message] = item.rank;
      return acc;
    }, {});

    let predefinedMessages = await PredefinedMessage.find(query)
      .sort({ createdAt: -1 }) // Sorting by creation time initially to ensure consistent load order
      .lean();

    predefinedMessages = predefinedMessages.map((item) => {
      item.rank = rankMap[item._id] || Infinity; // Assign Infinity if rank is not set, for custom sort fallback
      return item;
    });

    // Determine the sort order based on the 'sort' parameter
    switch (sort) {
      case 'asc':
        predefinedMessages = _.orderBy(predefinedMessages, ['text'], ['asc']); // Sorting by message text in ascending order
        break;
      case 'desc':
        predefinedMessages = _.orderBy(predefinedMessages, ['text'], ['desc']); // Sorting by message text in descending order
        break;
      case 'custom':
      default:
        predefinedMessages = _.orderBy(predefinedMessages, ['rank'], ['asc']); // Default custom sorting by rank
        break;
    }

    return predefinedMessages;
  } catch (e) {
    throw e;
  }
};



methods.deleteByTeamId = async (body) => {
  const messages = PredefinedMessage.deleteMany({
    team: body.team,
  });

  return messages;
};

module.exports = methods;
