const { validationResult } = require("express-validator");

const Project = require("../models/project");
const User = require("../models/user");

exports.createProject = async (req, res, next) => {
  const { title, description, deadline, creator } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const projectTitleExists = await Project.findOne({ title: title }).exec();
    if (projectTitleExists) {
      return res.status(403).json({ message: "Project Title Already Exists" });
    }

    const newProject = new Project({
      title: title,
      description: description,
      deadline: deadline,
      creator: creator,
      team: [creator],
    });

    await User.findByIdAndUpdate(
      creator,
      { $push: { projects: [newProject] } },
      { new: true }
    ).exec();
    await newProject.save();
    res.json({ message: "New Project Created Successfully", data: newProject });
    console.log("New Project Created: ", newProject);
  } catch (error) {
    console.log(error);
  }
};

exports.getProjects = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 6;
  try {
    // Find projects (pagination) => populate the team property with users profilePictureUrl, email, tasks => sort by deadline ascending
    const totalProjects = await Project.find().countDocuments().exec();
    const projects = await Project.find({})
      .sort({ deadline: "asc" })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("team", "profilePictureUrl email tasks")
      .exec();
    res.json({
      message: "Projects Fetched Successfully",
      data: { projects: projects, totalProjects: totalProjects },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  const { title, description, deadline } = req.body;

  try {
    const projectFound = await Project.findById(projectId).exec();
    if (!projectFound) {
      return res
        .status(404)
        .json({ message: "No project with that id exists" });
    }

    const currentUser = await User.findById(req.userId);
    if (currentUser._id.toString() !== projectFound.creator.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized! This is not your project!" });
    }

    projectFound.title = title;
    projectFound.description = description;
    projectFound.deadline = deadline;
    await projectFound.save();

    res.json({ message: "Project Updated Successfully", data: projectFound });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const projectFound = await Project.findById(projectId).exec();
    if (!projectFound) {
      return res
        .status(404)
        .json({ message: "No project with that id exists" });
    }

    const currentUser = await User.findById(req.userId);
    if (currentUser._id.toString() !== projectFound.creator.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized! This is not your project!" });
    }

    await Project.findByIdAndRemove(projectId);
    await currentUser.projects.pull({ _id: projectId });
    await currentUser.save();

    res.json({ message: "Project Deleted Successfully" });
    console.log("Project deleted!");
  } catch (error) {
    console.log(error);
  }
};
