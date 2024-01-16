const { DateTime } = require("luxon");

const logger = {};

logger.getTime = () => {
  return DateTime.local().toFormat("dd-LLL-yyyy hh:mm:ss a");
};

logger.printLabel = (label) => {
  console.log(label, logger.getTime());
  console.log("");
};

logger.print = (label = "", message = "") => {
  console.log(label, message);
  console.log("");
};

module.exports = logger;
