const { getItemTypes, getReimbursmentRequest } = require("../services/common");

const getReimbursmentRequestController = (req, res, next) =>
  getReimbursmentRequest(req, res, next);

const getItemTypesController = (req, res, next) =>
  getItemTypes(req, res, next);


module.exports = {
  getReimbursmentRequestController,
  getItemTypesController,
}
