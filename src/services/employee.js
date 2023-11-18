const envVariable = require("../config/envVariables");
const Employee = require("../models/Employee");
const {Organization} = require("../models/Organization");
const { ValidationError, STATUS_CODE } = require("../utils/app-errors");
const bcrypt = require("bcrypt");
const { generateHashedPassword } = require("../utils/globalFunctions");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { Reimbursement } = require("../models/Reimbursement");
const Transaction = require("../models/Transaction");
const { default: mongoose } = require("mongoose");


// signup
async function registerEmployee(req, res, next) {
  const { firstName, lastName, email, password, organizationCode } = req.body;

  try {
    const organization = await Organization.findOne({ code: organizationCode });

    if (!organization || organizationCode !== organization.code) {
      throw new ValidationError("Invalid organization code");
    }
  
    const checkEmployee = await Employee.findOne({ email });

    if (checkEmployee) {
      throw new ValidationError("An Employee with this mail already exists");
    }

    const hashedPassword = await generateHashedPassword(password);

    if (!hashedPassword) throw new ApiError("Could not create employee", STATUS_CODE.INTERNAL_ERROR);

    const employee = new Employee({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      organizationCode,
    });

    await employee.save();
    organization.employees.push(employee._id);

    await organization.save();

    return res.status(STATUS_CODE.CREATED).json(employee);
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}


// signin
async function signinEmployee(req, res, next) {
  try {
    const { email, password } = req.body;

    const findEmployee = await Employee.findOne( {email} )

    if (!findEmployee) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        message: "user does not exist"
      })
     } else {
    const comparePassword =await bcrypt.compare(
      password,
      findEmployee.password
    )
    if (!comparePassword) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: "incorrect password or email"
      })
    }

    if (!findEmployee.active) throw new ValidationError("Auth Failed (Unauthorized)")
  }


  const access_token = generateAccessToken(findEmployee.email, findEmployee.organizationCode, false)
  const refresh_token = generateRefreshToken(findEmployee.email, findEmployee.organizationCode, false)

  findEmployee.lastLogin = Date.now()
  await findEmployee.save()
  return res.status(STATUS_CODE.OK).json({
    message: 'login successful',
    access_token,
    refresh_token
  })
} catch (error) {
  return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
}

}


async function getEmployee(req, res, next) {
  try {
    const {email, code} = req.body
    const employee = await Employee.findOne({email, organizationCode: code}, "firstName lastName email role accounts walletBalance")
    if (!employee) {
      throw new BadRequestError('employee does not exist')
    }

    return res.status(STATUS_CODE.OK).json(employee)
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}


async function updateEmployee(req, res, next) {
  try {
    const {email, code, firstName, lastName, role} = req.body

    const employee = await Employee.findOne({email, organizationCode: code}, "firstName lastName email role accounts walletBalance")
    if (!employee) {
      throw new BadRequestError('employee does not exist')
    }

    if (firstName) employee.firstName = firstName
    if (lastName) employee.lastName = lastName
    if (role) employee.role = role

    await employee.save()

    return res.status(STATUS_CODE.OK).json(employee)
  } catch(error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }

}


async function deactivateEmployee(req, res, next) {
  try {
    const {email, code} = req.body

    const employee = await Employee.findOneAndUpdate(
      {email},
      {active: false},
      { new: true } // This option returns the updated document
    );

    if (employee) {
      return res.status(STATUS_CODE.NO_CONTENT).json({message: "Employee deleted sucessfully"})
    } else {
      throw new BadRequestError('employee does not exist')
    }
  } catch(error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

async function getReimbursmentRequests(req, res, next) {
  try {
    const {email, code} = req.body
    const employee = await Employee.findOne({email, organizationCode: code}, "_id")

    if (employee) {
      const requests = await Reimbursement.find({ownerId: employee._id}, "title description status totalAmount")

      return res.status(STATUS_CODE.OK).json(requests)
    } else {
      throw new BadRequestError('employee does not exist')
    }
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}


async function getReimbursmentRequest(req, res, next) {
  try {
    const {email, code, id} = req.body

      const request = await Reimbursement.findById(id).populate('userId', 'firstName lastName email')

      return res.status(STATUS_CODE.OK).json(request)

  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}


async function createReimbursmentRequest(req, res, next) {
  try {
    const {email, code, employeeId, title, description} = req.body

    if (!employeeId || !title || !description) throw new ValidationError('title, description and employeeId are required')

      const request = await Reimbursement.create({
        title,
        description,
        ownerId: employeeId
      })

      return res.status(STATUS_CODE.CREATED).json(request)

  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

async function createReimbursmentRequestItem(req, res, next) {
  try {
    const {name, amount, content, type} = req.body
    const {id} = req.params

    if (!id || !name || !amount || !content || !type) throw new ValidationError('id param, name, amount, content and type are required')

    // add a new reimbursment item and return the added item
    const request = await Reimbursement.findById(id).populate('items')

    const item = await request.items.create({
      name,
      content,
      type,
      amount
    })

    request.items.push(item)
    await request.save()

    return res.status(STATUS_CODE.CREATED).json(item)

  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

async function updateReimbursmentRequestItem(req, res, next) {
  try {
    const { name, amount, content, type, email } = req.body;
    const { id, itemId } = req.params;

    if (!id || !itemId) throw new ValidationError('request id param, and item id param are required');

    // find the particular item with the item id, and check if the ownerId belongs to a user with the same email
    const request = await Reimbursement.findById(id, "items ownerId");

    if (!request) {
      throw new NotFoundError('Reimbursement request not found');
    }

    const author = await Employee.findOne({ email }, "_id");

    if (!author) {
      throw new NotFoundError('Author not found');
    }

    const item = request.items.id(itemId);

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    if (request.ownerId.toString() !== author._id.toString()) {
      throw new ValidationError('You are not the author of this request');
    }

    if (name) item.name = name;
    if (amount) item.amount = amount;
    if (content) item.content = content;
    if (type) item.type = type;

    await request.save();

    return res.status(STATUS_CODE.OK).json(item);

  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}


async function deleteReimbursementRequestItem(req, res, next) {
  try {
    const { email } = req.body;
    const { id, itemId } = req.params;

    if (!id || !itemId) throw new ValidationError('request id param and item id param are required');

    // Find the particular item with the item id and check if the ownerId belongs to a user with the same email
    const request = await Reimbursement.findById(id, 'items ownerId');

    if (!request) {
      throw new NotFoundError('Reimbursement request not found');
    }

    const author = await Employee.findOne({ email }, '_id');

    if (!author) {
      throw new NotFoundError('Author not found');
    }

    const item = request.items.id(itemId);

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    if (request.ownerId.toString() !== author._id.toString()) {
      throw new ValidationError('You are not the author of this request');
    }

    // Remove the item from the items array using pull
    request.items.pull(itemId);

    // Save the parent document to persist the changes to the items array
    await request.save();

    return res.status(STATUS_CODE.NO_CONTENT).json(item);

  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

async function getDashboardDetails(req, res, next) {
  try {
    const {code, email} = req.body

    const data = {}

    const employee = await Employee.findOne({ email }, 'walletBalance');

    data.balance = employee.walletBalance

    // get the total reimbursment received every month within this year
    const reimbursmentTransactionsWithinThisYear = await Transaction.find({ transactionType: "Reimbursment", org: code, author: employee._id, date: {$gte: new Date(new Date().getFullYear(), 0, 1), $lte: new Date(new Date().getFullYear(), 11, 31)}}, 'amount date')
    const reimbursmentTransactionsWithinLastYear = 
      await Transaction.find({transactionType: "Reimbursement", org: code, author: employee._id, date: {$gte: new Date(new Date().getFullYear() - 1, 0, 1), $lte: new Date(new Date().getFullYear() - 1, 11, 31)}}, 'amount date')

  
      const calculateStatisticsForAYear = (transactions, dataKey) => {
        const monthlyTotals = {};
    
        // Iterate through each transaction
        transactions.forEach((transaction) => {
            const date = new Date(transaction.date);
            const month = date.toLocaleString('default', { month: 'long' }); // Get the month name
    
            // Initialize the monthly total if it doesn't exist
            if (!monthlyTotals[month]) {
                monthlyTotals[month] = 0;
            }
    
            // Add the transaction amount to the monthly total
            monthlyTotals[month] += parseFloat(transaction.amount);
        });
    
        // Convert the result to an array of objects
        const resultArray = Object.keys(monthlyTotals).map((month) => ({
            total: monthlyTotals[month],
            month: month,
        }));
    
        data[dataKey] = resultArray;
    };

    calculateStatisticsForAYear(reimbursmentTransactionsWithinThisYear, 'totalReimbursmentsPerMonthThisYear');
    calculateStatisticsForAYear(reimbursmentTransactionsWithinLastYear, 'totalReimbursmentsPerMonthLastYear');
    
    data.topTenRecentRequests = await Reimbursement.find({ ownerId: employee._id }, 'title createdAt totalAmount status')
    .sort({ createdAt: -1 }) // Sort in descending order based on the update date
    .limit(10); // Limit the result to the last 10 requests

    data.itemTypeRanking = await Reimbursement.aggregate([
      { $match: { ownerId: employee._id } },
      { $unwind: "$items" },
      { $lookup: { from: "customitemtypes", localField: "items.type", foreignField: "_id", as: "itemType" } },
      { $unwind: "$itemType" },
      {
          $group: {
              _id: "$itemType.name",
              count: { $sum: 1 },
          },
      },
      {
          $project: {
              _id: 0,
              type: "$_id",
              percentage: { $multiply: [{ $divide: ["$count", { $literal: 1 }] }, 100] },
          },
      },
  ]);

  return res.status(STATUS_CODE.OK).json(data);

  } catch (error) {
    console.log(error)
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}



module.exports = {
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
};
