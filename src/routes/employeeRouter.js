const { Router } = require("express");
const {
  registerEmployeeController,
  getEmployeesController,
  getEmployeeController,
  updateEmployeeController,
  deleteEmployeeController,
} = require("../controllers/employee");

const employeeRouter = Router();

employeeRouter.post("/register", registerEmployeeController);
employeeRouter.get("/", getEmployeesController);
employeeRouter.get("/:employeeID", getEmployeeController);
employeeRouter.patch("/:employeeID", updateEmployeeController);
employeeRouter.delete("/:employeeID", deleteEmployeeController);

module.exports = employeeRouter;
