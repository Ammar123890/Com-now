const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AuthorizationToken = require("../models/AuthorizationToken");
const keys = require("../config/keys");
const errorStrings = require("../config/errorStrings");

const isTeamMemberTokenValid = async (authorization, req) => {
  try {
    const lang = (req.body.lang ? req.body.lang : req.query.lang) || "en";
    if (!authorization) {
      throw new Error(errorStrings.AUTHORIZATION_DENIED[lang]);
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new Error(errorStrings.AUTHORIZATION_DENIED[lang]);
    }

    jwt.verify(token, keys.JWT_SECRET);

    const authToken = await AuthorizationToken.findOne({
      token,
    })
      .lean()
      .select("user")
      .populate("user");

    if (!authToken) {
      throw new Error(errorStrings.AUTHORIZATION_DENIED[lang]);
    }

    if (!authToken.user) {
      throw new Error(errorStrings.AUTHORIZATION_DENIED[lang]);
    }

    if (authToken.user.userType === "doctor") {
      throw new Error(errorStrings.ONLY_TEAM_MEMBER_CAN_ACCESS[lang]);
    }

    const doctorUser = await User.findOne({
      team: authToken.user.team[0],
      userType: "doctor",
    });

    // if (!doctorUser.subscription.isSubscribed) {
    //   throw new Error(errorStrings.SUBSCRIPTION_NEEDED[lang]);
    // }

    return authToken;
  } catch (e) {
    throw e;
  }
};

const isTeamMember = async (req, _res, next) => {
  try {
    const authToken = await isTeamMemberTokenValid(
      req.headers.authorization,
      req
    );

    const user = authToken.user;

    req.user = user;

    next();
  } catch (e) {
    const error = { message: e.message };

    next({ message: error, status: 401 });
  }
};

module.exports = { isTeamMember, isTeamMemberTokenValid };
