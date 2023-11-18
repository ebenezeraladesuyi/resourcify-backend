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
  approveOrRejectRequestController,
  getDashboardDetailsController,
} = require("../controllers/organization");
const isAuthorized = require("../middlewares/auth/isAuthorized");
const { addCommentToRequestController, addCommentToRequestItemController, getReimbursmentRequestController } = require("../controllers/common");

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

organizationRouter.get("/dashboard", isAuthorized, getDashboardDetailsController);
// organizationRouter.get("/dashboard", isAuthorized, );

// Get a particular reimbursment request based on the id provided
organizationRouter.get("/requests/:id", isAuthorized, getReimbursmentRequestController)
organizationRouter.patch("/requests/:id", isAuthorized, approveOrRejectRequestController)

// Add a comment to an individual item of a reimbursment request
organizationRouter.post("/requests/:id/comment", isAuthorized, addCommentToRequestController )
organizationRouter.post("/requests/:id/item/:itemId/comment", isAuthorized, addCommentToRequestItemController )



organizationRouter.get("/me", isAuthorized, getOrganizationController);

organizationRouter.put("/me", isAuthorized, updateOrganizationController);

organizationRouter.delete("/me", isAuthorized, deleteOrganizationController);

module.exports = organizationRouter;
