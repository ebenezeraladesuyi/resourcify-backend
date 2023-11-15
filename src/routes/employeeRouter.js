const { Router } = require("express");
const {
  registerEmployeeController,
  getEmployeesController,
  getEmployeeController,
  updateEmployeeController,
  deleteEmployeeController,
  signinEmployeeController,
} = require("../controllers/employee");
const isAuthorized = require("../middlewares/auth/isAuthorized");

const employeeRouter = Router();

employeeRouter.post("/register", registerEmployeeController); // done

employeeRouter.post("/signin", signinEmployeeController) // done

// return details needed for the employee dashboard based on what we have on the Figma design
// employeeRouter.get("/dashboard",isAuthorized, );

// This should save details about a reimbursment request, except the comments, items and total amount. 
// employeeRouter.post("/request", isAuthorized, ) 

// This should return all reimbursment requests that belongs to an employee
// employeeRouter.get("/request", isAuthorized, ) 

// Get a particular reimbursment request based on the id provided
// employeeRouter.get("/request/:id", isAuthorized, ) 

// employeeRouter.put("/request/:id", isAuthorized, ) 

// Add a comment to a reimbursment request
// employeeRouter.post("/request/:id/comment", isAuthorized, ) 

// Add a new item to a reimbursment request
// employeeRouter.post("/request/:id/item", isAuthorized, )

// employeeRouter.put("/request/:id/item", isAuthorized, )

// employeeRouter.delete("/request/:id/item", isAuthorized, )

// Add a comment to an individual item of a reimbursment request
// employeeRouter.post("/request/:id/item/comment", isAuthorized, )

employeeRouter.get("/me", isAuthorized, getEmployeeController);

employeeRouter.put("/me", isAuthorized, updateEmployeeController);

employeeRouter.delete("/me", isAuthorized, deleteEmployeeController);

module.exports = employeeRouter;
