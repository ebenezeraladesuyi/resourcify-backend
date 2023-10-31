const {
  registerOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
} = require("../services/organization");

const registerOrganizationController = (req, res, next) =>
  registerOrganization(req, res, next);
const getOrganizationController = (req, res, next) =>
  getOrganization(req, res, next);
const getOrganizationsController = (req, res, next) =>
  getOrganizations(req, res, next);
const updateOrganizationController = (req, res, next) =>
  updateOrganization(req, res, next);
const deleteOrganizationController = (req, res, next) =>
  deleteOrganization(req, res, next);

module.exports = {
  registerOrganizationController,
  getOrganizationController,
  getOrganizationsController,
  updateOrganizationController,
  deleteOrganizationController,
};
