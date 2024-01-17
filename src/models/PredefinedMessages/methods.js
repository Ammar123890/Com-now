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

methods.getAllMessages = async (user) => {
  try {
    console.log(user.defaultTeam)
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
      .sort({ createdAt: -1 })
      .lean();

    predefinedMessages = predefinedMessages.map((item) => {
      if (item._id in rankMap) {
        item.rank = rankMap[item._id];
      }

      return item;
    });

    predefinedMessages = _.orderBy(predefinedMessages, ["rank"]);

    const { newData } = predefinedMessages.reduce(
      (acc, item) => {
        if (typeof item.rank === "number") {
          acc.maxRank = item.rank;
        } else {
          item.rank = acc.maxRank === -Infinity ? 1 : acc.maxRank + 1;
          acc.maxRank = acc.maxRank === -Infinity ? 1 : acc.maxRank + 1;
        }

        acc.newData.push(item);

        return acc;
      },
      { maxRank: -Infinity, newData: [] }
    );

    return newData;
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
