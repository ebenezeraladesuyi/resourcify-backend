const Employee = require("../models/Employee");
const { CustomItemType, Organization } = require("../models/Organization");
const { Reimbursement, Comment, requestState } = require("../models/Reimbursement");
const { STATUS_CODE } = require("../utils/app-errors");


async function getReimbursmentRequest(req, res, next) {
    try {
      const {email, code, isAdmin} = req.body
  
      const {id} = req.params
  
      if (!id) throw new ValidationError('parameter id is required')
  
      const request = await Reimbursement.findById(id)
      .populate({
        path: 'ownerId',
        select: 'firstName lastName email',
      })
      .populate({
        path: 'comments',
        populate: {
            path: 'sender',
            select: 'firstName lastName name email',
        }
      })
      .populate({
        path: 'items.type',
        select: 'name',
      })
      .populate({
        path: 'items.comments',
        populate: {
            path: 'sender',
            select: 'firstName lastName name email',
        }
      });

    if (request.status === requestState[0]) {
        request.status = requestState[1];
        await request.save()
    }

    // Sort comments in the request object
    request.comments.sort((a, b) => a.date - b.date);

    // Sort comments within each item in request.items
    request.items.forEach(item => {
        item.comments.sort((a, b) => a.date - b.date);
    });

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

        const comm = await Comment.create({
            comment,
            sender: user._id,
            docModel: isAdmin ? "Organization": "Employee"
        })

        item.comments.push(comm._id)

        await request.save();


    return res.status(STATUS_CODE.OK).json(comm);

    } catch (error) {
        console.log(error)
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

        const comm = await Comment.create({
            comment,
            sender: user._id,
            docModel: isAdmin ? "Organization": "Employee"
        })

        request.comments.push(comm._id)

        await request.save();

    return res.status(STATUS_CODE.OK).json(comm);

    } catch (error) {
        return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }
}


module.exports = {
  getReimbursmentRequest,
  getItemTypes,
  addCommmentToRequest,
  addCommmentToRequestItem,
}