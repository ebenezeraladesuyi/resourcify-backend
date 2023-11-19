const Employee = require("../models/Employee");
const { CustomItemType, Organization } = require("../models/Organization");
const { Reimbursement, Comment, requestState } = require("../models/Reimbursement");
const Transaction = require("../models/Transaction");
const { STATUS_CODE, ApiError, ValidationError } = require("../utils/app-errors");


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

async function addAccount (req, res, next) {
    try {
        const {bankName, accountName, accountNumber, code, isAdmin, email} = req.body


        const user = await (isAdmin ? Organization : Employee).findOne({email: email}, "accounts")

        const accountExists = user.accounts.find((acc) => acc.accountNumber === accountNumber)
        
        if (accountExists) throw new ValidationError("Account already exists")

        const newAccount = await user.accounts.create({
            bankName,
            accountName,
            accountNumber,
        })

        user.accounts.push(newAccount)

        await user.save()

        return res.status(STATUS_CODE.CREATED).json(newAccount)
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }
}

async function updateAccount (req, res, next) {
    try {
        const {bankName, accountName, accountNumber, code, isAdmin, email} = req.body
        const {id} = req.params

        const user = await (isAdmin ? Organization : Employee).findOne({email: email}, "accounts")

        const accountExists = user.accounts.find((acc) => acc.accountNumber === accountNumber)
        
        if (accountExists && accountExists._id != id) throw new ValidationError("Account with this account Number already exists")

        const account = await user.accounts.id(id)
        if (bankName) account.bankName = bankName
        if (accountName) account.accountName = accountName
        if (accountNumber) account.accountNumber = accountNumber

        await user.save()

        return res.status(STATUS_CODE.OK).json(account)
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }
}

async function deleteAccount (req, res, next) {
    try {
        const { isAdmin, email} = req.body
        const {id} = req.params

        const user = await (isAdmin ? Organization : Employee).findOne({email: email}, "accounts")

        const accountExists = user.accounts.find((acc) => acc._id == id)
        
        if (!accountExists) throw new ApiError("Account not found", STATUS_CODE.NOT_FOUND)

        user.accounts.filter(acc => acc._id != id)

        await user.save()

        return res.status(STATUS_CODE.NO_CONTENT).json(accountExists)
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }
}

async function withdrawToAccount (req, res, next) {
    try {
        const { isAdmin, email, amount, accountId, code} = req.body
        const user = await (isAdmin ? Organization : Employee).findOne({email: email})

        if (!amount || !accountId) 
            throw new ValidationError("Amount and accountId are required", STATUS_CODE.BAD_REQUEST)

        const account = user.accounts.find((acc) => acc._id == accountId)
        if (!account) throw new ApiError("Account not found", STATUS_CODE.NOT_FOUND)

        if (parseFloat(amount) <= 0) throw new ValidationError("Amount must be greater than 0", STATUS_CODE.BAD_REQUEST)
        const newBalance = parseFloat(user.walletBalance) - parseFloat(amount)

        if (newBalance < 0) throw new ApiError("BAD_REQUEST", STATUS_CODE.BAD_REQUEST, "Amount is greater than the wallet balance")

        user.walletBalance = newBalance.toString()

        const trans = await Transaction.create({
            transactionType: 'Widthrawal',
            deduction: true,
            account: `${account.bankName}: ${account.accountName} - ${account.accountNumber}`,
            amount: parseFloat(amount),
            author: user._id,
            model: isAdmin ? "Organization" : "Employee",
            org: code,
        })

        if (trans) {
            await account.save()
            return res.status(STATUS_CODE.OK).json({message: "Withdrawal Successfull!"})
        }

        throw new ApiError("Withdrawal Failed", STATUS_CODE.INTERNAL_ERROR)
    } catch (error) {
        console.log(error)
        return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }   
}

async function getTransactionHistory(req, res, next) {
    try {
        const { code, email, isAdmin } = req.body

        const user = await (isAdmin ? Organization : Employee).findOne({email: email})
        
        const transactionHistory = await Transaction.find({org: code, author: user._id})

        return res.status(STATUS_CODE.OK).json(transactionHistory)
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
    }  
}


module.exports = {
  getReimbursmentRequest,
  getItemTypes,
  addCommmentToRequest,
  addCommmentToRequestItem,
  addAccount,
  updateAccount,
  deleteAccount,
  withdrawToAccount,
  getTransactionHistory,
}