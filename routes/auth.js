const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const {
  validateSignUp,
  validateEditProfile,
} = require("../middleware/validation");
const isAuth = require("../middleware/is-auth");

// /auth setup in server.js

// GET => /auth
// router.get("/", authController.getAuth);

// GET => /auth/users/:userId
router.get("/users/:userId", isAuth, authController.getUser);

// POST => /auth/signup
router.post("/signup", validateSignUp, authController.signUp);

// POST => /auth/signin
router.post("/signin", authController.signIn);

// PUT => /auth/users/:userId
router.put(
  "/users/:userId",
  isAuth,
  validateEditProfile,
  authController.editProfile
);

module.exports = router;
