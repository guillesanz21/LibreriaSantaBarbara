const express = require("express");
let router = express.Router();

// Controllers
const catalogueController = require("../controllers/catalogue");

// Middlewares
const authorizationMiddleware = require("../middlewares/authorization");

// ------------------------------------------------------ //

router.get("/", catalogueController.test);

router.get(
  "/import",
  authorizationMiddleware.requireLogin,
  authorizationMiddleware.requireAdmin,
  catalogueController.import
);

module.exports = router;
