const {
    getItemTypes,
    getReimbursmentRequest,
    addCommmentToRequest,
    addCommmentToRequestItem,
    addAccount,
    updateAccount,
    deleteAccount,
    withdrawToAccount,
    getTransactionHistory,
} = require("../services/common");

const getReimbursmentRequestController = (req, res, next) =>
  getReimbursmentRequest(req, res, next);

const getItemTypesController = (req, res, next) =>
  getItemTypes(req, res, next);

const addCommentToRequestController = (req, res, next) =>
  addCommmentToRequest(req, res, next);

const addCommentToRequestItemController = (req, res, next) =>
  addCommmentToRequestItem(req, res, next);

const addAccountController = (req, res, next) => 
  addAccount(req, res, next);

const updateAccountController = (req, res, next) => 
  updateAccount(req, res, next);

const deleteAccountController = (req, res, next) => 
  deleteAccount(req, res, next);

const withdrawToAccountController = (req, res, next) => 
  withdrawToAccount(req, res, next);


const getTransactionHistoryController = (req, res, next) => 
  getTransactionHistory(req, res, next);


module.exports = {
  getReimbursmentRequestController,
  getItemTypesController,
  addCommentToRequestController,
  addCommentToRequestItemController,
  addAccountController,
  updateAccountController,
  deleteAccountController,
  withdrawToAccountController,
  getTransactionHistoryController,
}
