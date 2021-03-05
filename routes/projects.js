const express = require("express");
const router = express.Router();

const projectsController = require("../controllers/projects");
const { validateEditProject } = require("../middleware/validation");
const isAuth = require("../middleware/is-auth");

// TODO Implement CRUD routes, controllers and validation for projects

// /projects set up in server.js

// Create project: POST => /projects
router.post("/", isAuth, validateEditProject, projectsController.createProject);

// Get projects: GET => /projects
router.get("/", isAuth, projectsController.getProjects);

// Get a single project => /projects/:projectId
// router.get("/:projectId, isAuth, projectsController.getProject")

// Edit a project: PUT => /projects/:projectId
router.put("/:projectId", isAuth, projectsController.editProject);

// Delete a project: DELETE => /projects/:projectId
router.delete("/:projectId", isAuth, projectsController.deleteProject);

module.exports = router;
