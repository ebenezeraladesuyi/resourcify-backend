const { Router } = require("express");
const {
  getOrganizationsController,
  getOrganizationController,
  deleteOrganizationController,
  updateOrganizationController,
  registerOrganizationController,
  siginOrganizationController,
  getEmployeesController,
  getEmployeeController,
  deactivateEmployeeController,
} = require("../controllers/organization");
const isAuthorized = require("../middlewares/auth/isAuthorized");

const organizationRouter = Router();

organizationRouter.post("/register", registerOrganizationController); // done

organizationRouter.post('/signin', siginOrganizationController); // done

// organizationRouter.get("/dashboard", isAuthorized, );

// Get all employees in an organization
organizationRouter.get("/employees", isAuthorized, getEmployeesController ); // done

// Get a particular employee
organizationRouter.get("/employees/:id", isAuthorized, getEmployeeController);

// Set the active state of the employee to false.
organizationRouter.delete("/employees/:id", isAuthorized, deactivateEmployeeController);

// organizationRouter.get("/dashboard", isAuthorized, );
// organizationRouter.get("/dashboard", isAuthorized, );



organizationRouter.get("/me", isAuthorized, getOrganizationController);

organizationRouter.put("/me", isAuthorized, updateOrganizationController);

organizationRouter.delete("/me", isAuthorized, deleteOrganizationController);

module.exports = organizationRouter;
