const {
  registerEmployee,
  signinEmployee,
  getEmployee,
  updateEmployee,
  deactivateEmployee,
  getReimbursmentRequests,
  createReimbursmentRequest,
  createReimbursmentRequestItem,
  updateReimbursmentRequestItem,
  deleteReimbursementRequestItem,
  getDashboardDetails,
} = require("../services/employee");

const registerEmployeeController = (req, res, next) =>
  registerEmployee(req, res, next);

const signinEmployeeController = (req, res, next) =>
  signinEmployee(req, res, next);

const getDashboardDetailsController = (req, res, next) =>
  getDashboardDetails(req, res, next)
  
const getEmployeeController = (req, res, next) => getEmployee(req, res, next);

const updateEmployeeController = (req, res, next) =>
  updateEmployee(req, res, next);

const deactivateEmployeeController = (req, res, next) =>
  deactivateEmployee(req, res, next);

const getReimbursmentRequestsController = (req, res, next) =>
  getReimbursmentRequests(req, res, next);


const createReimbursmentRequestController = (req, res, next) =>
  createReimbursmentRequest(req, res, next);


const createReimbursmentRequestItemController = (req, res, next) =>
  createReimbursmentRequestItem(req, res, next);

const updateReimbursmentRequestItemController = (req, res, next) =>
  updateReimbursmentRequestItem(req, res, next);

const deleteReimbursementRequestItemController = (req, res, next) =>
  deleteReimbursementRequestItem(req, res, next);

module.exports = {
  registerEmployeeController,
  signinEmployeeController,
  getEmployeeController,
  updateEmployeeController,
  deactivateEmployeeController,
  getReimbursmentRequestsController,
  createReimbursmentRequestController,
  createReimbursmentRequestItemController,
  updateReimbursmentRequestItemController,
  deleteReimbursementRequestItemController,
  getDashboardDetailsController,
};
