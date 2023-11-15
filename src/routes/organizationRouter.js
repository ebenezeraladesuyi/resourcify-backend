const { Router } = require("express");
const {
  getOrganizationsController,
  getOrganizationController,
  deleteOrganizationController,
  updateOrganizationController,
  registerOrganizationController,
  siginOrganizationController,
} = require("../controllers/organization");
const isAuthorized = require("../middlewares/auth/isAuthorized");

const organizationRouter = Router();

organizationRouter.post("/register", registerOrganizationController); // done

organizationRouter.post('/signin', siginOrganizationController); // done

// organizationRouter.get("/dashboard", isAuthorized, );

// Get all employees in an organization
// organizationRouter.get("/employees", isAuthorized, );

// Get a particular employee
// organizationRouter.get("/employees/:id", isAuthorized, );

// Set the active state of the employee to false.
// organizationRouter.delete("/employees/:id", isAuthorized, );

// organizationRouter.get("/dashboard", isAuthorized, );
// organizationRouter.get("/dashboard", isAuthorized, );



organizationRouter.get("/me", isAuthorized, getOrganizationController);

organizationRouter.put("/me", isAuthorized, updateOrganizationController);

organizationRouter.delete("/me", isAuthorized, deleteOrganizationController);

module.exports = organizationRouter;
