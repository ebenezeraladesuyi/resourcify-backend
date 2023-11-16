const { Router } = require("express");
const {
  registerEmployeeController,
  getEmployeeController,
  updateEmployeeController,
  deactivateEmployeeController,
  signinEmployeeController,
  getReimbursmentRequestsController,
  getReimbursmentRequestController,
  createReimbursmentRequestController,
} = require("../controllers/employee");
const isAuthorized = require("../middlewares/auth/isAuthorized");

const employeeRouter = Router();

employeeRouter.post("/register", registerEmployeeController); // done

employeeRouter.post("/signin", signinEmployeeController) // done

// return details needed for the employee dashboard based on what we have on the Figma design
// employeeRouter.get("/dashboard",isAuthorized, );

// This should save details about a reimbursment request, except the comments, items and total amount. 
employeeRouter.post("/requests", isAuthorized, createReimbursmentRequestController) 

// This should return all reimbursment requests that belongs to an employee
employeeRouter.get("/requests", isAuthorized, getReimbursmentRequestsController) 

// Get a particular reimbursment request based on the id provided
employeeRouter.get("/requests/:id", isAuthorized, getReimbursmentRequestController) 

// employeeRouter.put("/requests/:id", isAuthorized, ) 

// Add a comment to a reimbursment request
// employeeRouter.post("/requests/:id/comment", isAuthorized, ) 

// Add a new item to a reimbursment request
// employeeRouter.post("/request/:id/item", isAuthorized, )

// employeeRouter.put("/request/:id/item", isAuthorized, )

// employeeRouter.delete("/request/:id/item", isAuthorized, )

// Add a comment to an individual item of a reimbursment request
// employeeRouter.post("/request/:id/item/comment", isAuthorized, )

employeeRouter.get("/me", isAuthorized, getEmployeeController);

employeeRouter.put("/me", isAuthorized, updateEmployeeController);

employeeRouter.delete("/me", isAuthorized, deactivateEmployeeController);

module.exports = employeeRouter;
