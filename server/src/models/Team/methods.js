const errorStrings = require("../../config/errorStrings");
const TeamMember = require("../TeamMember");
const Team = require("./index");
const User = require("../User");

const methods = {};

methods.createTeam = async (body, user) => {
  const lang = body.lang || "en";
 // console.log("here");
  try {
    const teamName = body.name;

    // Check if a team with the same name already exists for this user
    const existingTeam = await Team.findOne({ user: user._id, name: teamName });
    if (existingTeam) {
      throw new Error(errorStrings.TEAM_SAME_NAME[lang]);
    }

    // Create a new team
    const team = new Team({ user: user._id, name: teamName });
    await team.save();

    // Add the new team to the user's teams array
    await User.findByIdAndUpdate(
      user._id,
      { $push: { team: team._id } },
      { new: true, safe: true, upsert: true }
    ).lean();

    return team;
  } catch (e) {
    throw e;
  }
};


methods.editTeam = async (body, user) => {
  try {
    const lang = body.lang || "en";
    const payload = {
      name: body.name,
    };

    const team = await Team.findOneAndUpdate({ _id: user.team }, payload, {
      new: true,
    }).lean();

    if (!team) {
      throw new Error(errorStrings.TEAM_NOT_EXIST[lang]);
    }

    return team;
  } catch (e) {
    throw e;
  }
};

methods.getOnlineUsers = async (body) => {
  try {
    const lang = body.lang || "en";
    if (!body.team) {
      throw new Error(errorStrings.TEAM_ID_REQUIRED[lang]);
    }

    const query = {
      team: body.team,
      isOnline: true,
    };

    const onlineUsers = await User.countDocuments(query);

    return onlineUsers;
  } catch (e) {
    throw e;
  }
};

methods.getTeamDetails = async (body, user) => {
  try {
    const query = {
      user: user._id,
    };

    if (body && body.team) {
      query._id = body.team;
    }

    const team = await Team.findOne(query).lean();

    if (!team) {
      return null;
    }

    const onlineUsers = await User.countDocuments({
      team: team._id,
      isOnline: true,
    });

    return { ...team, onlineUsers };
  } catch (e) {
    throw e;
  }
};

methods.deleteById = async (body) => {
  try {
    const team = await Team.findOneAndDelete({
      _id: body.team,
    });

    return team;
  } catch (e) {
    throw e;
  }
};

module.exports = methods;
