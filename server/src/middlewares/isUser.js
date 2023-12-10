const jwt = require("jsonwebtoken");

const constants = require("../config/constants");
const AuthorizationToken = require("../models/AuthorizationToken");
const User = require("../models/User");
const keys = require("../config/keys");
const errorStrings = require("../config/errorStrings");

const isTokenValid = async (authorization, req) => {
  try {
    const lang = (req?.body?.lang ? req?.body?.lang : req?.query?.lang) || "en";
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

    const isAllowedWithoutSubscription = req
      ? constants.ALLOWED_ROUTE_WITHOUT_SUBSCRIPTION.some((item) => {
          return item.url === req?.originalUrl?.split("?")[0] && item.method === req.method;
        })
      : false;

    if (authToken.user.userType === "doctor") {
      if (
        !authToken.user.subscription.isSubscribed &&
        !isAllowedWithoutSubscription
      ) {
        throw new Error(errorStrings.SUBSCRIPTION_NEEDED[lang]);
      }
    }

    if (authToken.user.userType === "team-member") {
      const userDoctor = await User.findOne({
        team: authToken.user.team,
        userType: "doctor",
      });

      if (
        !userDoctor.subscription.isSubscribed &&
        !isAllowedWithoutSubscription
      ) {
        throw new Error(errorStrings.SUBSCRIPTION_NEEDED[lang]);
      }
    }

    return authToken;
  } catch (e) {
    throw e;
  }
};

const isUser = async (req, _res, next) => {
  try {
    const authToken = await isTokenValid(req.headers.authorization, req);

    const user = authToken.user;

    req.user = user;

    next();
  } catch (e) {
    const error = { message: e.message };

    next({ message: error, status: 401 });
  }
};

module.exports = { isUser, isTokenValid };
