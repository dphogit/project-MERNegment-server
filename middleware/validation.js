// Middleware using express-validation
const { body } = require("express-validator");

exports.validateSignUp = [
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Must be at least 6 characters")
    .custom((password) => {
      if (/\s+/.test(password)) {
        throw new Error("Password Must Not Contain Space(s)");
      }
      if (!/\d+/.test(password)) {
        throw new Error("Password Must Contain At Least One Number");
      }
      if (!/[A-Za-z]/.test(password)) {
        throw new Error("Password Must Contain At Least One Letter ");
      }
      return true;
    }),
];

// TODO Validate Edit Profile (username - 50 characters, role - 20 characters)
exports.validateEditProfile = [
  body("username")
    .trim()
    .isLength({ max: 50 })
    .withMessage("Username must be no more than 50 characters"),
  body("role")
    .trim()
    .isLength({ max: 20 })
    .withMessage("Role must be no more than 20 characters"),
];
