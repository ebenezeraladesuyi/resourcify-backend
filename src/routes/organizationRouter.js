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
  addCardController,
  removeCardController,
  fundWalletController,
} = require("../controllers/organization");
const isAuthorized = require("../middlewares/auth/isAuthorized");
const {
  addCommentToRequestController,
  addCommentToRequestItemController,
  getReimbursmentRequestController,
  addAccountController,
  updateAccountController,
  deleteAccountController,
  withdrawToAccountController,
  getTransactionHistoryController,
} = require("../controllers/common");

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

organizationRouter.post("/accounts", isAuthorized, addAccountController)
organizationRouter.put("/accounts/:id", isAuthorized, updateAccountController)
organizationRouter.delete("/accounts/:id", isAuthorized, deleteAccountController)


organizationRouter.post("/cards", isAuthorized, addCardController)
organizationRouter.delete("/cards/:id", isAuthorized, removeCardController)
organizationRouter.post("/wallet-topup", isAuthorized, fundWalletController);


organizationRouter.get("/me", isAuthorized, getOrganizationController);

organizationRouter.put("/me", isAuthorized, updateOrganizationController);

organizationRouter.delete("/me", isAuthorized, deleteOrganizationController);

organizationRouter.post("/withdrawal", isAuthorized, withdrawToAccountController);
organizationRouter.get("/transaction-history", isAuthorized, getTransactionHistoryController);


module.exports = organizationRouter;
