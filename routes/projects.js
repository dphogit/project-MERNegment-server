const express = require("express");
const router = express.Router();

const projectsController = require("../controllers/projects");
const { validateEditProject } = require("../middleware/validation");
const isAuth = require("../middleware/is-auth");

// /projects set up in server.js

// Create project: POST => /projects
router.post("/", isAuth, validateEditProject, projectsController.createProject);

// Get projects: GET => /projects
router.get("/", isAuth, projectsController.getProjects);

// Edit a project: PUT => /projects/:projectId
router.put("/:projectId", isAuth, projectsController.editProject);

// Join a project: PUT => /projects/join/:projectId/:userId
router.put("/join/:projectId/:userId", isAuth, projectsController.joinProject);

// Leave a project: PUT => /projects/leave/:projectId/:userId
router.put(
  "/leave/:projectId/:userId",
  isAuth,
  projectsController.leaveProject
);

// Delete a project: DELETE => /projects/:projectId
router.delete("/:projectId", isAuth, projectsController.deleteProject);

module.exports = router;
