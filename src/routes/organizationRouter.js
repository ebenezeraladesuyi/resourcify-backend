const { Router } = require("express");
const {
  getOrganizationsController,
  getOrganizationController,
  deleteOrganizationController,
  updateOrganizationController,
  registerOrganizationController,
} = require("../controllers/organization");

const organizationRouter = Router();

organizationRouter.post("/", registerOrganizationController);
organizationRouter.get("/", getOrganizationsController);
organizationRouter.get("/:organizationID", getOrganizationController);
organizationRouter.patch("/:id", updateOrganizationController);
organizationRouter.delete("/:id", deleteOrganizationController);
module.exports = organizationRouter;
