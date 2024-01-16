const randomstring = require("randomstring");
const _ = require("lodash");

const errorStrings = require("../../config/errorStrings");
const User = require("../User");
const UserOrder = require("../UserOrder");
const team = require("../../routes/user/team");

const methods = {};

methods.addMember = async (body, user, type, groupId) => {
  try {
    const lang = body.lang || "en";
    if (!body.firstName || !body.lastName) {
      throw new Error(errorStrings.TEAM_MEMBER_NAME_REQUIRED[lang]);
    }

    // Prepare the common payload
    var payload = {
      fullName: `${body.firstName} ${body.lastName}`,
      initials: body.initials,
      userType: "team-member",
      defaultTeam: user.defaultTeam,
      enrollmentCode: {
        code: methods.generateCode(),
        expiry: null,
      },
      color: body.color,
      ...body.otherFields
    };

    // Check if the user already exists in any team
    const teamMemberQuery = {
      fullName: payload.fullName,
      userType: payload.userType,
      defaultTeam: user.defaultTeam,
    };

    let existingUser = await User.findOne(teamMemberQuery).lean();

    if (existingUser) {
      // Check if the user is already in any team
      if (existingUser.team.length > 0) {
        throw new Error(errorStrings.TEAM_MEMBER_ALREADY_IN_A_TEAM[lang]);
      }

      // If adding to a specific group, add them to that group
      if (type === 'group') {
        await User.findByIdAndUpdate(existingUser._id, { $set: { team: [groupId] } });
        return existingUser;
      }
      throw new Error(errorStrings.TEAM_MEMBER_ALREADY_EXIST_WITH_NAME[lang]);
    } else {
      // If the user doesn't exist in any team, create and add them
      let newUser = new User(payload);
      await newUser.save();

      // If adding to a specific group, add them to that group
      if (type === 'group') {
        await User.findByIdAndUpdate(newUser._id, { $set: { team: [groupId] } });
      }
      return newUser;
    }
  } catch (e) {
    throw e;
  }
};

methods.reAddMember = async (body, user) => {  
  try {
    const lang = body.lang || "en";
    if (!body.teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_ID_REQUIRED[lang]);
    }

    const teamMemberId = body.teamMember;

    // Find the team member
    const teamMember = await User.findById(teamMemberId);
    if (!teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_NOT_EXIST[lang]);
    }



    // Generate a new code and update the user
    const newCode = methods.generateCode();

    // Update the user with new code and leavedTeam = false if the body contains type = team and leavedGroup = false if the body contains type = group
    const update = (body.type === "group") ? { "enrollmentCode.code": newCode, "leavedGroup":false } : { "enrollmentCode.code": newCode, "leavedTeam":false };
    await User.findByIdAndUpdate(teamMemberId, { $set: update });

    //return the user with new code
    return await User.findById(teamMemberId);
  }
  catch (e) {
    throw e;
  }

}

methods.getMembers = async (req) => {
  try {
    const lang = req.query.lang || "en";
    const ALLOWED_STATUS = ["blocked", "unblocked", "all"];

    if (req.query.status && !ALLOWED_STATUS.includes(req.query.status)) {
      return errorStrings.UNSUPPORTED_STATUS[lang];
    }

    // Determine the field to search (team or defaultTeam) based on provided group ID
    const isDefaultTeam = !req.query.group || req.query.group === req.user.defaultTeam.toString();
    const teamField = isDefaultTeam ? 'defaultTeam' : 'team';

    let orders = await UserOrder.findOne({ user: req.user._id });
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
      [teamField]: isDefaultTeam ? req.user.defaultTeam : req.query.group,
      userType: "team-member",
    };

    if (req.query.status === "blocked") {
      query.blocked = true;
    }

    if (req.query.status === "unblocked") {
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

methods.changeStatus = async (body, user) => {
  try {
    const lang = body.lang || "en";
    const ALLOWED_STATUS = ["blocked", "unblocked"];

    if (!body.teamMember) {
      return errorStrings.TEAM_MEMBER_ID_REQUIRED[lang];
    }

    if (!body.status) {
      return errorStrings.STATUS_REQUIRED[lang];
    }


    if (!ALLOWED_STATUS.includes(body.status)) {
      return errorStrings.UNSUPPORTED_STATUS[lang];
    }

    const teamMember = await User.findOne({
      _id: body.teamMember,
      defaultTeam: user.defaultTeam,
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

methods.editMember = async (body, user) => {
  try {
    const lang = body.lang || "en";
    if (!body.teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_ID_REQUIRED[lang]);
    }

    const teamMemberId = body.teamMember;

    // Find the team member
    const teamMember = await User.findById(teamMemberId);
    if (!teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_NOT_EXIST[lang]);
    }
    // check if the new user name is already exist
    const existingTeamMember = await User.findOne({
      fullName: body.fullName,
      userType: "team-member",
      defaultTeam: user.defaultTeam,
    });

    if (existingTeamMember){
      throw new Error(errorStrings.TEAM_MEMBER_ALREADY_EXIST_WITH_NAME[lang]);
    }

    const update = {
      fullName: body.fullName,
      initials: body.initials,
      color: body.color,
    };
  
    // Update the user with new data
    await User.findByIdAndUpdate(teamMemberId, { $set: update });
  }
  catch (e) {
    throw e;
  }
}

methods.delete = async (body, user) => {
  try {
    const lang = body.lang || "en";
    if (!body.teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_ID_REQUIRED[lang]);
    }
    const teamMemberId = body.teamMember;
    // Find the team member and delete
    await User.findByIdAndDelete(teamMemberId);
  } catch (e) {
    throw e; 
  }
};

methods.leaveTeam = async (body, user) => {
  const type = body.type;
  try {
    const lang = body.lang || "en";

    // Define the update object based on the type
    const update = (type === "group") ? { leavedGroup: true } : { leavedTeam: true };

    // Use the update object in findOneAndUpdate
    const teamMember = await User.findOneAndUpdate({
      _id: user._id,
      userType: "team-member",
    }, update);

    if (!teamMember) {
      throw new Error(errorStrings.TEAM_MEMBER_NOT_EXIST[lang]);
    }

    return null;
  } catch (e) {
    throw e;
  }
};

methods.generateCode = () => { return randomstring.generate(20);};

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
  } catch (e) { console.log("HERE"); throw e;}};

module.exports = methods;
