const {
  registerEmployee,
  signinEmployee,
  getEmployee,
  updateEmployee,
  deactivateEmployee,
  getReimbursmentRequests,
  getReimbursmentRequest,
  createReimbursmentRequest,
} = require("../services/employee");

const registerEmployeeController = (req, res, next) =>
  registerEmployee(req, res, next);

const signinEmployeeController = (req, res, next) =>
  signinEmployee(req, res, next);
  
const getEmployeeController = (req, res, next) => getEmployee(req, res, next);

const updateEmployeeController = (req, res, next) =>
  updateEmployee(req, res, next);

const deactivateEmployeeController = (req, res, next) =>
  deactivateEmployee(req, res, next);

const getReimbursmentRequestsController = (req, res, next) =>
  getReimbursmentRequests(req, res, next);


const getReimbursmentRequestController = (req, res, next) =>
  getReimbursmentRequest(req, res, next);

const createReimbursmentRequestController = (req, res, next) =>
  createReimbursmentRequest(req, res, next);

module.exports = {
  registerEmployeeController,
  signinEmployeeController,
  getEmployeeController,
  updateEmployeeController,
  deactivateEmployeeController,
  getReimbursmentRequestsController,
  getReimbursmentRequestController,
  createReimbursmentRequestController,
};
