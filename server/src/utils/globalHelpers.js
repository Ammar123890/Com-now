const mongoose = require("mongoose");

const constants = require("../config/constants");
const randomstring = require("randomstring");

const globalHelpers = {};

globalHelpers.handleMongooseError = function (response) {
  let returnResponse = {};

  if (response.name === "ValidationError") {
    const errorsArray = [];

    for (const item in response.errors) {
      if (response.errors.hasOwnProperty(item)) {
        errorsArray.push(response.errors[`${item}`].message);
      }
    }

    returnResponse.message = errorsArray[0];
  } else if (typeof response === "object" && "message" in response) {
    returnResponse = { message: response.message };
  } else if (Array.isArray(response)) {
    returnResponse.message = response[0];
  } else if (typeof response === "string") {
    returnResponse.message = response;
  }

  return returnResponse;
};

globalHelpers.isTrue = function (payload) {
  if (
    payload === "true" ||
    payload === "false" ||
    payload === true ||
    payload === false
  ) {
    return JSON.parse(payload) === true;
  }

  return false;
};

globalHelpers.isFalse = function (payload) {
  if (
    payload === "true" ||
    payload === "false" ||
    payload === true ||
    payload === false
  ) {
    return JSON.parse(payload) === false;
  }

  return false;
};

globalHelpers.validateEmail = function (email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

globalHelpers.validatePassword = function (password = "") {
  return password.length >= 6;
};

globalHelpers.removedUndefinedValues = function (obj) {
  const payload = {};

  for (const key in obj) {
    if (!globalHelpers.isNullOrUndefined(obj[`${key}`])) {
      payload[`${key}`] = obj[`${key}`];
    }
  }

  return payload;
};

globalHelpers.isValidObjectId = function (id) {
  return mongoose.Types.ObjectId.isValid(id);
};

globalHelpers.isNullOrUndefined = function (value) {
  if (typeof value === "undefined" || value === null || value === "") {
    return true;
  }
};

globalHelpers.isNullOrUndefinedOnly = function (value) {
  if (value === undefined || value === null) return true;
};

globalHelpers.generateMongoID = function () {
  return mongoose.Types.ObjectId();
};

globalHelpers.toObjectId = function (id) {
  return new mongoose.Types.ObjectId(id);
};

globalHelpers.isFalseValue = function (value) {
  if (typeof value === "undefined" || value === null || value === "") {
    return true;
  }
};

globalHelpers.calculateSkipDoc = function (page) {
  return (Number(page) - 1) * constants.LIMIT;
};

globalHelpers.calculateTotalPage = function (totalDocs, limit) {
  if (limit === 0 || totalDocs === 0) {
    return 1;
  }

  return Math.ceil(totalDocs / limit);
};

globalHelpers.getLimit = function (limit) {
  if (Number(limit) === 0) {
    return 0;
  }

  return constants.LIMIT;
};

globalHelpers.generateRandomString = function (
  length = 10,
  charset = "alphanumeric"
) {
  return randomstring.generate({
    length,
    charset,
  });
};

globalHelpers.extractExtensionFromName = function (filename) {
  const re = /(?:\.([^.]+))?$/;

  return re.exec(filename)[1];
};

module.exports = globalHelpers;
