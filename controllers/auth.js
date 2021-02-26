const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const SECRET = process.env.JWT_SECRET;

// ! Not needed right now
// exports.getAuth = (req, res, next) => {
//   res.json({ message: "Authentication Backend Connected" });
// };

exports.signUp = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  if (!req.file) {
    return res.status(422).json({ message: "No Image provided" });
  }

  // Email => Hash Password => Save Image => Create User => Save User => Redirect/Notify
  try {
    const userExists = await User.findOne({ email: email }).exec();
    if (userExists) {
      return res.status(403).json({ message: "Email Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const profilePictureUrl = req.file.path.replace("\\", "/");

    const newUser = new User({
      email: email,
      password: hashedPassword,
      profilePictureUrl: profilePictureUrl,
    });

    await newUser.save();
    res.json({ message: "New User Created Successfully", data: newUser });
    console.log("New User Created: ", newUser);
  } catch (error) {
    console.log(error);
  }
};
// duck123
exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Email => Check Password (bcrypt compare) => Assign JSON web token
  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    const doMatch = await bcrypt.compare(password, user.password);
    if (!doMatch) {
      return res.status(401).json({ message: "Incorrect Credentials." });
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      SECRET,
      { expiresIn: "3h" }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with that id cannot be found." });
    }
    res.status(200).json({ message: "User found", user: user });
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req, res, next) => {
  const { username, role, profilePicture } = req.body;
  const userId = req.params.userId;
  let profilePictureUrl = profilePicture;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  if (req.file) {
    // New profile picture sent through
    profilePictureUrl = req.file.path.replace("\\", "/");
  } else {
    // Already existing profile picture
    profilePictureUrl = profilePictureUrl.split("http://localhost:8080/")[1];
  }

  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with that id cannot be found." });
    }
    if (profilePictureUrl !== user.profilePictureUrl) {
      clearImage(user.profilePictureUrl);
    }
    user.username = username;
    user.role = role;
    user.profilePictureUrl = profilePictureUrl;

    await user.save();
    res.json({ message: "User updated", user: user });
  } catch (error) {
    console.log(error);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
