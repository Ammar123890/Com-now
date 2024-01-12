const jwt = require("jsonwebtoken");

const constants = require("../config/constants");
const AuthorizationToken = require("../models/AuthorizationToken");
const keys = require("../config/keys");
const errorStrings = require("../config/errorStrings");

const isDoctorTokenValid = async (authorization, req) => {
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
      .populate({
        path: "user",
        populate: {
          path: "subscription.subscription",
        },
      });

    if (!authToken) {
      throw new Error(errorStrings.AUTHORIZATION_DENIED[lang]);
    }

    if (!authToken.user) {
      throw new Error(errorStrings.AUTHORIZATION_DENIED[lang]);
    }

    if (authToken.user.userType !== "doctor") {
      throw new Error(errorStrings.DOCTOR_PERMISSION_NEEDED[lang]);
    }

    const isAllowedWithoutSubscription = req
      ? constants.ALLOWED_ROUTE_WITHOUT_SUBSCRIPTION.some((item) => {
          return item.url === req.originalUrl && item.method === req.method;
        })
      : false;

    if (
      !authToken.user.subscription.isSubscribed &&
      !isAllowedWithoutSubscription
    ) {
      throw new Error(errorStrings.SUBSCRIPTION_NEEDED[lang]);
    }

    return authToken;
  } catch (e) {
    throw e;
  }
};

const isDoctor = async (req, _res, next) => {
  try {
    console.log("isDoctor");  
    const authToken = await isDoctorTokenValid(req.headers.authorization, req);

    const user = authToken.user;

    req.user = user;

    next();
  } catch (e) {
    const error = { message: e.message };

    next({ message: error, status: 401 });
  }
};

module.exports = { isDoctor, isDoctorTokenValid };
