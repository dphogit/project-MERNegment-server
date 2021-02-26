const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  const users = await User.find({}).exec();
  res.json({ message: "Fetched Users Successful", users: users });
};
