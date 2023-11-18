const { getItemTypes, getReimbursmentRequest, addCommmentToRequest, addCommmentToRequestItem } = require("../services/common");

const getReimbursmentRequestController = (req, res, next) =>
  getReimbursmentRequest(req, res, next);

const getItemTypesController = (req, res, next) =>
  getItemTypes(req, res, next);

const addCommentToRequestController = (req, res, next) =>
  addCommmentToRequest(req, res, next);

const addCommentToRequestItemController = (req, res, next) =>
  addCommmentToRequestItem(req, res, next);



module.exports = {
  getReimbursmentRequestController,
  getItemTypesController,
  addCommentToRequestController,
  addCommentToRequestItemController,
}
