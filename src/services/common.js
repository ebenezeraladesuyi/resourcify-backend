const { CustomItemType, Organization } = require("../models/Organization");
const { Reimbursement } = require("../models/Reimbursement");
const { STATUS_CODE } = require("../utils/app-errors");


async function getReimbursmentRequest(req, res, next) {
    try {
      const {email, code} = req.body
  
      const {id} = req.params
  
      if (!id) throw new ValidationError('parameter id is required')
  
      const request = await Reimbursement.findById(id).populate('ownerId', 'firstName lastName email')
  
      return res.status(STATUS_CODE.OK).json(request)
  
    } catch (error) {
      return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }
}

async function getItemTypes(req, res, next) {
    try {
      const {code} = req.body

      const orgId = await Organization.findOne({code: code}, "_id")
    
      const itemTypes = await CustomItemType.find({organization: orgId})
  
      return res.status(STATUS_CODE.OK).json(itemTypes)
    } catch(error) {
        console.log(error)
      return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }
}

module.exports = {
  getReimbursmentRequest,
  getItemTypes,
}