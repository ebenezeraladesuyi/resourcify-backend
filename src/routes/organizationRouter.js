const { Router } = require("express");
const {
  getOrganizationsController,
  getOrganizationController,
  deleteOrganizationController,
  updateOrganizationController,
  registerOrganizationController,
} = require("../controllers/organization");
const isAuthorized = require("../middlewares/auth/isAuthorized");

const organizationRouter = Router();

organizationRouter.post("/", registerOrganizationController);

organizationRouter.get("/", isAuthorized, getOrganizationsController);

organizationRouter.get("/:organizationID", isAuthorized, getOrganizationController);

organizationRouter.patch("/:id", isAuthorized, updateOrganizationController);

organizationRouter.delete("/:id", isAuthorized, deleteOrganizationController);

module.exports = organizationRouter;
