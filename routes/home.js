const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home");
const isAuth = require("../middleware/is-auth");

// /home setup in server.js

// GET => /home
router.get("/users", isAuth, homeController.getUsers);

module.exports = router;
