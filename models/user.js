const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profilePictureUrl: {
      type: String,
    },
    role: {
      type: String,
    },
    // tasks: {
    //   type: [String],
    // },
    projects: {
      type: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
