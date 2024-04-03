const express = require("express");
const router = express.Router();
require("./user")(router);
require("./team")(router);
require("./teamMember")(router);
require("./predefinedMessage")(router);
require("./media")(router);
require("./message")(router);
require("./call")(router);

module.exports = router;
