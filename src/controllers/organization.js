const {
  registerOrganization,
  signinOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
  getEmployees,
  getEmployee,
  deactivateEmployee,
  approveOrRejectRequest,
  getDashboardDetails,
} = require("../services/organization");

const registerOrganizationController = (req, res, next) =>
  registerOrganization(req, res, next);

const siginOrganizationController = (req, res, next) => 
  signinOrganization(req, res, next);

const getDashboardDetailsController = (req, res, next) =>
  getDashboardDetails(req, res, next)
  
const getOrganizationController = (req, res, next) =>
  getOrganization(req, res, next);

const getOrganizationsController = (req, res, next) =>
  getOrganizations(req, res, next);

const updateOrganizationController = (req, res, next) =>
  updateOrganization(req, res, next);
const deleteOrganizationController = (req, res, next) =>
  deleteOrganization(req, res, next);

const getEmployeesController = (req, res, next) => 
  getEmployees(req, res, next);

const getEmployeeController = (req, res, next) => 
  getEmployee(req, res, next);

const deactivateEmployeeController = (req, res, next) => 
  deactivateEmployee(req, res, next);

const approveOrRejectRequestController = (req, res, next) =>
  approveOrRejectRequest(req, res, next);

module.exports = {
  registerOrganizationController,
  siginOrganizationController,
  getOrganizationController,
  getOrganizationsController,
  updateOrganizationController,
  deleteOrganizationController,
  getEmployeesController,
  getEmployeeController,
  deactivateEmployeeController,
  approveOrRejectRequestController,
  getDashboardDetailsController
};
