const { Router } = require("express");
const {
  registerEmployeeController,
  getEmployeeController,
  updateEmployeeController,
  deactivateEmployeeController,
  signinEmployeeController,
  getReimbursmentRequestsController,
  createReimbursmentRequestController,
  createReimbursmentRequestItemController,
  updateReimbursmentRequestItemController,
  deleteReimbursementRequestItemController,
  getDashboardDetailsController,
} = require("../controllers/employee");
const isAuthorized = require("../middlewares/auth/isAuthorized");
const {
  getReimbursmentRequestController,
  getItemTypesController,
  addCommentToRequestItemController,
  addCommentToRequestController,
  addAccountController,
  updateAccountController,
  deleteAccountController,
  withdrawToAccountController,
  getTransactionHistoryController,
} = require("../controllers/common");

const employeeRouter = Router();

employeeRouter.post("/register", registerEmployeeController); // done

employeeRouter.post("/signin", signinEmployeeController) // done

// return details needed for the employee dashboard based on what we have on the Figma design
employeeRouter.get("/dashboard",isAuthorized, getDashboardDetailsController);

// This should save details about a reimbursment request, except the comments, items and total amount. 
employeeRouter.post("/requests", isAuthorized, createReimbursmentRequestController) 

// This should return all reimbursment requests that belongs to an employee
employeeRouter.get("/requests", isAuthorized, getReimbursmentRequestsController) 

// Get a particular reimbursment request based on the id provided
employeeRouter.get("/requests/:id", isAuthorized, getReimbursmentRequestController) 

employeeRouter.get("/item-types", isAuthorized, getItemTypesController) 



// employeeRouter.put("/requests/:id", isAuthorized, ) 

// Add a comment to a reimbursment request
// employeeRouter.post("/requests/:id/comment", isAuthorized, ) 

// Add a new item to a reimbursment request
employeeRouter.post("/requests/:id/item", isAuthorized, createReimbursmentRequestItemController)

employeeRouter.put("/requests/:id/item/:itemId", isAuthorized, updateReimbursmentRequestItemController)

employeeRouter.delete("/requests/:id/item/:itemId", isAuthorized, deleteReimbursementRequestItemController)

// Add a comment to an individual item of a reimbursment request
employeeRouter.post("/requests/:id/comment", isAuthorized, addCommentToRequestController )
employeeRouter.post("/requests/:id/item/:itemId/comment", isAuthorized, addCommentToRequestItemController )


employeeRouter.post("/accounts", isAuthorized, addAccountController)
employeeRouter.put("/accounts/:id", isAuthorized, updateAccountController)
employeeRouter.delete("/accounts/:id", isAuthorized, deleteAccountController)

employeeRouter.get("/me", isAuthorized, getEmployeeController);

employeeRouter.put("/me", isAuthorized, updateEmployeeController);

employeeRouter.delete("/me", isAuthorized, deactivateEmployeeController);



employeeRouter.post("/withdrawal", isAuthorized, withdrawToAccountController);
employeeRouter.get("/transaction-history", isAuthorized, getTransactionHistoryController);

module.exports = employeeRouter;
