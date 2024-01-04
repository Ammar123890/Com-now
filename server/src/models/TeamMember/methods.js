const randomstring = require("randomstring");
const _ = require("lodash");

const errorStrings = require("../../config/errorStrings");
const User = require("../User");
const UserOrder = require("../UserOrder");

const methods = {};

methods.addMember = async (body, user) => {
  try {
    const lang = body.lang || "en";
    if (!body.firstName || !body.lastName) {
      throw new Error(errorStrings.TEAM_MEMBER_NAME_REQUIRED[lang]);
    }

    // if (!body.group) {
    //   throw new Error(errorStrings.TEAM_REQUIRED_BEFORE_MEMBER[lang]);
    // }

    var payload = {
      fullName: `${body.firstName} ${body.lastName}`,
      initials: body.initials,
      defaultTeam: body.team,
      enrollmentCode: {
        code: methods.generateCode(),
        expiry: null,
      },
      userType: "team-member",
    };

    if (body.type === "group") {
      payload.team = body.group;
    }

    const teamMemberQuery = {
      team: payload.team || payload.defaultTeam,
      fullName: payload.fullName,
      userType: payload.userType,
    };
    

    let newUser = await User.findOne(teamMemberQuery).lean();
    if (newUser) {
      throw new Error(errorStrings.TEAM_MEMBER_ALREADY_EXIST_WITH_NAME[lang]);
    }

    newUser = new User(payload);
    await newUser.save();

    return newUser;
  } catch (e) {
    throw e;
  }
};

methods.getMembers = async (body, user) => {
  try {
    const lang = body.lang || "en";
    const ALLOWED_STATUS = ["blocked", "unblocked", "all"];

    if (body.status && !ALLOWED_STATUS.includes(body.status)) {
      return errorStrings.UNSUPPORTED_STATUS[lang];
    }

    console.log(body);
    if (!body.group) {
      throw new Error(errorStrings.TEAM_REQUIRED_BEFORE_MEMBER[lang]);
    }

    let orders = await UserOrder.findOne({ user: user._id });
    if (!orders) {
      orders = {
        orders: [],
      };
    }

    const rankMap = orders.orders.reduce((acc, item) => {
      acc[item.user] = item.rank;
      return acc;
    }, {});

    const query = {
      team: body.group,
    };

    if (body.status === "blocked") {
      query.blocked = true;
    }

    if (body.status === "unblocked") {
      query.blocked = false;
    }

    let teamMembers = await User.find(query).lean();

    teamMembers = teamMembers.map((item) => {
      if (item._id in rankMap) {
        item.rank = rankMap[item._id];
      }

      return item;
    });
    teamMembers = _.orderBy(teamMembers, ["rank"]);
    const { newData } = teamMembers.reduce(
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

// methods.getAllMembers = async (body, user) => {
//   try {
//     const lang = body.lang || "en";
//     const ALLOWED_STATUS = ["blocked", "unblocked", "all"];

//     if (body.status && !ALLOWED_STATUS.includes(body.status)) {
//       return errorStrings.UNSUPPORTED_STATUS[lang];
//     }

//     let orders = await UserOrder.findOne({ user: user._id });
//     if (!orders) {
//       orders = {
//         orders: [],
//       };
//     }

//     const rankMap = orders.orders.reduce((acc, item) => {
//       acc[item.user] = item.rank;
//       return acc;
//     }, {});

//     const query = {
//       team: user.team,
//     };

//     if (body.status === "blocked") {
//       query.blocked = true;
//     }

//     if (body.status === "unblocked") {
//       query.blocked = false;
//     }

//     let teamMembers = await User.find(query).lean();

//     teamMembers = teamMembers.map((item) => {
//       if (item._id in rankMap) {
//         item.rank = rankMap[item._id];
//       }

//       return item;
//     });
//     teamMembers = _.orderBy(teamMembers, ["rank"]);
//     const { newData } = teamMembers.reduce(
//       (acc, item) => {
//         if (typeof item.rank === "number") {
//           acc.maxRank = item.rank;
//         } else {
//           item.rank = acc.maxRank === -Infinity ? 1 : acc.maxRank + 1;
//           acc.maxRank = acc.maxRank === -Infinity ? 1 : acc.maxRank + 1;
//         }

//         acc.newData.push(item);

//         return acc;
//       },
//       { maxRank: -Infinity, newData: [] }
//     );

//     return newData;
//   } catch (e) {
//     throw e;
//   }
// }

methods.changeStatus = async (body) => {
  try {
    const lang = body.lang || "en";
    const ALLOWED_STATUS = ["blocked", "unblocked"];

    if (!body.teamMember) {
      return errorStrings.TEAM_MEMBER_ID_REQUIRED[lang];
    }

    if (!body.status) {
      return errorStrings.STATUS_REQUIRED[lang];
    }

    if (!body.group) {
      return errorStrings.TEAM_REQUIRED_BEFORE_MEMBER[lang];
    }

    if (!ALLOWED_STATUS.includes(body.status)) {
      return errorStrings.UNSUPPORTED_STATUS[lang];
    }

    const teamMember = await User.findOne({
      _id: body.teamMember,
      team: body.group,
      userType: "team-member",
    });

    if (!teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_NOT_EXIST[lang]);
    }

    if (body.status === "blocked" && teamMember.blocked) {
      throw new Error(errorStrings.TEAM_MEMBER_ALREADY_BLOCKED[lang]);
    }

    if (body.status === "unblocked" && !teamMember.blocked) {
      throw new Error(errorStrings.TEAM_MEMBER_IS_NOT_BLOCKED[lang]);
    }

    if (body.status === "blocked") {
      teamMember.blocked = true;
    }
    if (body.status === "unblocked") {
      teamMember.blocked = false;
    }

    await teamMember.save();
    // await UserOrder.update(
    //   { "orders.user": body.teamMember },
    //   { "orders.$.rank": body.newRank }
    // );

    return teamMember;
  } catch (e) {
    throw e;
  }
};

methods.delete = async (body, user) => {
  try {
    const lang = body.lang || "en";
    if (!body.teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_ID_REQUIRED[lang]);
    }

    const teamMember = await User.findOneAndDelete({
      _id: body.teamMember,
      team: body.group,
      userType: "team-member",
    });

    if (!teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_NOT_EXIST[lang]);
    }

    return null;
  } catch (e) {
    throw e;
  }
};

methods.leaveTeam = async (body, user) => {
  try {
    const lang = body.lang || "en";
    const teamMember = await User.findOneAndDelete({
      _id: user._id,
      userType: "team-member",
    });

    if (!teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_NOT_EXIST[lang]);
    }

    return null;
  } catch (e) {
    throw e;
  }
};

methods.generateCode = () => {
  return randomstring.generate(20);
};

methods.reshuffleOrdersAfterUnblock = async (body, user) => {
  try {
    const teamOrders = await UserOrder.find({
      "orders.user": body.teamMember,
    }).populate("user");

    await Promise.all(
      teamOrders.map(async (item) => {
        try {
          const teamMembers = await methods.getMembers(
            { status: "unblocked" },
            { _id: item.user._id, team: body.group }
          );
          const indexOfMember = teamMembers.findIndex(
            (item) => item._id.toString() === body.teamMember
          );
          const removedMember = teamMembers.splice(indexOfMember, 1);
          const { data, highestRank } = teamMembers.reduce(
            (acc, item) => {
              item.rank = acc.highestRank + 1;
              acc.data.push(item);
              acc.highestRank = acc.highestRank + 1;
              return acc;
            },
            { data: [], highestRank: -1 }
          );
          data.push({ ...removedMember[0], rank: highestRank + 1 });

          const newOrders = data.map((item) => ({
            user: item._id,
            rank: item.rank,
          }));
          await UserOrder.updateOne(
            { user: item.user._id },
            { orders: newOrders }
          );

          return {};
        } catch (e) {
          throw e;
        }
      })
    );
  } catch (e) {
    console.log("HERE");
    throw e;
  }
};

module.exports = methods;
