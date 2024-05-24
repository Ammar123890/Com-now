const randomstring = require("randomstring");
const _ = require("lodash");

const errorStrings = require("../../config/errorStrings");
const User = require("../User");
const UserOrder = require("../UserOrder");
const AuthorizationToken = require("../../models/AuthorizationToken");
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
      createdBy: user._id,
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
        await User.findByIdAndUpdate(existingUser._id, { $set: { team: [groupId],leavedGroup: false } });
        return existingUser;
      }
      throw new Error(errorStrings.TEAM_MEMBER_ALREADY_EXIST_WITH_NAME[lang]);
    } else {
      // If the user doesn't exist in any team, create and add them
      let newUser = new User(payload);
      await newUser.save();

      // If adding to a specific group, add them to that group
      if (type === 'group') {
        await User.findByIdAndUpdate(newUser._id, { $set: { team: [groupId], leavedGroup: false } });
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
    const update = (body.type === "group") ? { "enrollmentCode.code": newCode, "leavedGroup": false } : { "enrollmentCode.code": newCode, "leavedTeam": false };
    await User.findByIdAndUpdate(teamMemberId, { $set: update });

    //return the user with new code
    return await User.findById(teamMemberId);
  }
  catch (e) {
    throw e;
  }

}

methods.reAddMemberNew = async (body) => {
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

    // Update the user with new enrollmentCode and leavedTeam = false if the body contains type = team and leavedGroup = false if the body contains type = group
    const update = {
      enrollmentCode: { code: newCode, expiry: null},
      leavedGroup: false,
      leavedTeam: false
    };
    await User.findByIdAndUpdate(teamMemberId, { $set: update });

    //return the user with new code
    return await User.findById(teamMemberId);
  }
  catch (e) {
    throw e;
  }
};

methods.getMembers = async (req) => {
  try {
    const lang = req.params.lang || "en";
    const sortOption = req.query.sort || "asc"; // Default to "asc" if sort option is not provided
    const ALLOWED_SORT_OPTIONS = ["asc", "des", "custom"];

    if (!ALLOWED_SORT_OPTIONS.includes(sortOption)) {
      return errorStrings.UNSUPPORTED_SORT_OPTION[lang];
    }

    const teamId = req.params.group;
    let query = {};
    if(teamId == req.user.defaultTeam){
       query = {
        defaultTeam: teamId,
        userType: "team-member",
      };
    }
    else{
      query = {
        team: teamId,
        userType: "team-member",
      };
    }

    // const query = {
    //   team: teamId,
    //   userType: "team-member",
    // };

    if (req.params.status === "blocked") {
      query.blocked = true;
    } else if (req.params.status === "unblocked") {
      query.blocked = false;
    }

    let teamMembers = await User.find(query).lean();

    if (sortOption === "asc" || sortOption === "des") {
      const sortDirection = sortOption === "asc" ? 1 : -1;
      teamMembers = teamMembers.sort((a, b) => (a.createdAt - b.createdAt) * sortDirection);
    } else if (sortOption === "custom") {
      // Get user order for the team

      let userOrder;
      if(teamId == req.user.defaultTeam)
        userOrder = await UserOrder.findOne({ team: teamId });
      else
        userOrder = await UserOrder.findOne({ team: teamId });
      if (!userOrder) {
        return []; // Return empty array if no user order is found
      }
      const userIdsInOrder = userOrder.order.map(o => o.user);

      // Sort team members according to the order in UserOrder
      teamMembers.sort((a, b) => userIdsInOrder.indexOf(a._id) - userIdsInOrder.indexOf(b._id));

      // Include the rank dataz
      teamMembers = teamMembers.map(member => {
        const orderEntry = userOrder.order.find(o => o.user.equals(member._id));
        if (orderEntry) {
          member.rank = orderEntry.rank;
        }
        return member;
      });
    }

    return teamMembers;
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
    // check if the new user name is already exist apart from the current user
    const existingTeamMember = await User.findOne({
      fullName: body.fullName,
      userType: "team-member",
      defaultTeam: user.defaultTeam,
      _id: { $ne: teamMemberId },
    });

    if (existingTeamMember) {
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

methods.logoutMember = async (req) => {
  try {
    const lang = req.params.lang || "en";
    // delete the token
    const token = req.headers.authorization.split(" ")[1];
    const tokenMem = await AuthorizationToken.findOne({ token })
      .lean()
      .select("_id");

    if (!tokenMem) {
      throw new Error(errorStrings.AUTHORIZATION_DENIED[lang]);
    }
    await AuthorizationToken.findByIdAndRemove(tokenMem._id)
      .lean()
      .select("_id");
    // update the fcmToken to null, leaved group to true and leaved team to true and enrollment code to null
    await User.findByIdAndUpdate(req.user._id, { $set: { fcmToken: null, leavedGroup: true, leavedTeam: true, enrollmentCode: null } });
    return true;
  }
  catch (e) {
    throw e;
  }
}

methods.generateCode = () => { return randomstring.generate(20); };

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
  } catch (e) { console.log("HERE"); throw e; }
};

module.exports = methods;
