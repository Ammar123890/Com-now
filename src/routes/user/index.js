const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage(); // This will store files in memory
const upload = multer({ storage: storage });

router.use(upload.none());

require("./user")(router);
require("./team")(router);
require("./teamMember")(router);
require("./predefinedMessage")(router);
require("./media")(router);
require("./message")(router);
require("./call")(router);

module.exports = router;
