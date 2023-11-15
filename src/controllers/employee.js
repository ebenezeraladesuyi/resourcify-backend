const {
  registerEmployee,
  signinEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../services/employee");

const registerEmployeeController = (req, res, next) =>
  registerEmployee(req, res, next);

const signinEmployeeController = (req, res, next) =>
  signinEmployee(req, res, next);
  
const getEmployeesController = (req, res, next) => getEmployees(req, res, next);

const getEmployeeController = (req, res, next) => getEmployee(req, res, next);

const updateEmployeeController = (req, res, next) =>
  updateEmployee(req, res, next);

const deleteEmployeeController = (req, res, next) =>
  deleteEmployee(req, res, next);

module.exports = {
  registerEmployeeController,
  signinEmployeeController,
  getEmployeeController,
  getEmployeesController,
  updateEmployeeController,
  deleteEmployeeController,
};
