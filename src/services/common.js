const Employee = require("../models/Employee");
const { CustomItemType, Organization } = require("../models/Organization");
const { Reimbursement } = require("../models/Reimbursement");
const { STATUS_CODE } = require("../utils/app-errors");


async function getReimbursmentRequest(req, res, next) {
    try {
      const {email, code} = req.body
  
      const {id} = req.params
  
      if (!id) throw new ValidationError('parameter id is required')
  
      const request = await Reimbursement.findById(id)
      .populate({
        path: 'ownerId',
        select: 'firstName lastName email',
      })
      .populate({
        path: 'comments.sender.data',
        select: "name firstName lastName email",
      })
      .populate({
        path: 'items.type',
        select: 'name',
      })
      .populate({
        path: 'items.comments.sender.data',
        select: {
          $cond: {
            if: { $eq: ['$items.comments.sender.type', 'Organization'] },
            then: 'name email', // Organization
            else: 'firstName lastName email', // Employee
          },
        },
      });
    
  
      return res.status(STATUS_CODE.OK).json(request)
  
    } catch (error) {
        console.log(error)
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

async function addCommmentToRequestItem(req, res, next) {
    try {
        const {comment, code, isAdmin, email} = req.body
        const {id, itemId} = req.params

        if (!id || !itemId) throw new ValidationError('request id param and item id param are required');

        const user = await (isAdmin ? Organization : Employee).findOne({email: email}, "_id")
        const request = await Reimbursement.findById(id)

        if (!isAdmin && !user._id.equals(request.ownerId._id)) throw new ValidationError("Your are not the author of this request")

        const item = request.items.id(itemId);

        if (!item) {
            throw new NotFoundError('Item not found');
        }

        item.comments.push({
            message: comment,
            sender: { type: isAdmin ? 'Organization' : 'Employee', data: user._id },
            date: new Date()
        })

        await request.save();


    return res.status(STATUS_CODE.OK).json(item);

    } catch (error) {
        return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }
}

async function addCommmentToRequest(req, res, next) {
    try {
        const {comment, code, isAdmin, email} = req.body
        const {id} = req.params

        if (!id) throw new ValidationError('request id param is required');

        const user = await (isAdmin ? Organization : Employee).findOne({email: email}, "_id")
        const request = await Reimbursement.findById(id)

        if (!isAdmin && !user._id.equals(request.ownerId._id)) throw new ValidationError("Your are not the author of this request")

        const newComment = {
            message: comment,
            sender: { type: isAdmin ? 'Organization' : 'Employee', data: user._id },
            date: new Date()
        };

        request.comments.push(newComment)

        await request.save();

    return res.status(STATUS_CODE.OK).json(newComment);

    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }
}


module.exports = {
  getReimbursmentRequest,
  getItemTypes,
  addCommmentToRequest,
  addCommmentToRequestItem,
}