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

employeeRouter.post("/register", registerEmployeeController);

employeeRouter.post("/signin", signinEmployeeController)

employeeRouter.get("/",isAuthorized, getEmployeesController);

employeeRouter.get("/:employeeID", isAuthorized, getEmployeeController);

employeeRouter.patch("/:employeeID", isAuthorized, updateEmployeeController);

employeeRouter.delete("/:employeeID", isAuthorized, deleteEmployeeController);

module.exports = employeeRouter;
