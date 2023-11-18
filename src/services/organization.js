const {Organization, CustomItemType} = require("../models/Organization");
const {Reimbursement, requestState} = require("../models/Reimbursement");
const { generate } = require("randomstring");
const { STATUS_CODE, BadRequestError, ValidationError, ApiError } = require("../utils/app-errors");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { generateHashedPassword } = require("../utils/globalFunctions");
const Employee = require("../models/Employee");
const Transaction = require("../models/Transaction");


// signup/register
async function registerOrganization(req, res, next) {
  const { name, email, password } = req.body;

  try {
    const existingOrg = await Organization.findOne({ email });

    if (existingOrg) 
      throw new ValidationError("An organization with this email already exists", STATUS_CODE.BAD_REQUEST);
    
    const hashedPassword = await generateHashedPassword(password);

    if (!hashedPassword) throw new ApiError("Could not create organization", STATUS_CODE.INTERNAL_ERROR);

    const organization = new Organization({
      name,
      code: generate(8),
      email,
      password: hashedPassword,
      policies: {
        reimbursementLimit: '0.00'
      }
    });

    const data = await organization.save();

    return res.status(STATUS_CODE.CREATED).json({ data });
  } catch (error) {
    console.log(error)
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

// signin
async function signinOrganization(req, res, next) {
  try {
    const { email, password } = req.body;

    const findOrganization = await Organization.findOne( {email} );

    if (!findOrganization) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        message: "organization does not exist"
      })
       } else {
      const comparePassword = await bcrypt.compare(
        password,
        findOrganization.password
      )

      if (!comparePassword) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({
          message: "incorrect password or email"
        })
      }
    }

    const access_token = generateAccessToken(findOrganization.email, findOrganization.code, true)
    const refresh_token = generateRefreshToken(findOrganization.email, findOrganization.code, true)

    return res.status(STATUS_CODE.OK).json({
      message: 'login successful',
      access_token,
      refresh_token
    })
  } catch (error) {
    console.log(error)
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);

  }
}


// 
async function getOrganization(req, res, next) {
  try {
    const organizationID = req.params.id;
    const organization = await Organization.findById(organizationID);
    if (!organization) {
      next(new BadRequestError("Couldn't find organization"));
    }
    return res.status(STATUS_CODE.OK).json({ organization });
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}
async function getOrganizations(req, res, next) {
  try {
    const organization = await Organization.find().sort({ createdAt: -1 });
    return res.status(STATUS_CODE.OK).json({ organization });
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}
async function updateOrganization(req, res, next) {
  try {
    const organizationID = req.params.id;
    const { name, reimbusmentLimit } = req.body;
    const organization = await Organization.findById(organizationID);
    if (!organization) {
      next(new BadRequestError("Couldn't find organization"));
    }

    organization.name = name || organization.name;
    organization.policies.reimbusmentLimit =
      reimbusmentLimit || organization.policies.reimbusmentLimit;

    const updatedOrganization = await organization.save({
      validateBeforeSave: false,
    });

    return res.status(STATUS_CODE.OK).json({ updatedOrganization });
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}
async function deleteOrganization(req, res, next) {
  try {
    const organizationID = req.params.id;
    const organization = await Organization.findById(organizationID);
    if (!organization) {
      next(new BadRequestError("Couldn't find organization"));
    }

    await organization.deleteOne();

    return res.status(STATUS_CODE.OK).json("organization deleted");
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

async function getEmployees(req, res, next) {
  try {
    const {code, isAdmin} = req.body


    if (!isAdmin) return res.status(STATUS_CODE.UNAUTHORIZED).json("Forbidden");

    const employees = await Employee.find({organizationCode: code}, 'firstName lastName email active lastLogin')
    // const employees = await Organization.findOne({code}, 'employees').populate("employees")
    return res.status(STATUS_CODE.OK).json(employees)
  } catch (error) {
    console.log(error)
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

async function getEmployee(req, res, next) {
  try {
    const {code, isAdmin} = req.body
    const {id} = req.params

    if (!isAdmin) return res.status(STATUS_CODE.UNAUTHORIZED).json("Forbidden");

    if (!id) return res.status(STATUS_CODE.BAD_REQUEST).json("Bad Request");

    // const employee = await Employee.findById(id, 'firstName lastName email active accounts')
    const employee = await Employee.findById(id, 'firstName lastName email active accounts reimbursmentRequests').populate("reimbursementRequests", "title description status")
    // const count = await 
    return res.status(STATUS_CODE.OK).json(employee)

  } catch (error) {
    console.log(error)
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}


async function deactivateEmployee(req, res, next) {
  try {
    const {code, isAdmin} = req.body
    const {id} = req.params

    if (!isAdmin) return res.status(STATUS_CODE.UNAUTHORIZED).json("Forbidden");

    if (!id) return res.status(STATUS_CODE.BAD_REQUEST).json("Bad Request");

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {active: false},
      { new: true } // This option returns the updated document
    );

    if (updatedEmployee) {
      return res.status(STATUS_CODE.NO_CONTENT).json({message: "employee deactivated sucessfully!"})
    } else {
      throw new ApiError()
    }

  } catch (error) {
    console.log(error)
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

async function approveOrRejectRequest(req, res, next) {
  try {
    const {code} = req.body
    const {id} = req.params
    const {status} = req.query


    if (!id || !status) return res.status(STATUS_CODE.BAD_REQUEST).json("Bad Request");

    const request = await Reimbursement.findById(id)

    if (!request) return res.status(STATUS_CODE.NOT_FOUND).json("Not Found");

    if (["approved", "rejected"].indexOf(status) === -1) return res.status(STATUS_CODE.BAD_REQUEST).json({message: "Bad Request, status must be either approved or rejected"});
    if (status === "approved") {
      const org = await Organization.findOne({code}, "walletBalance")

      const amount = parseFloat(request.totalAmount)
      const wallet = parseFloat(org.walletBalance)

      if (wallet < amount) return res.status(STATUS_CODE.BAD_REQUEST).json({message: "Bad Request, insufficient wallet balance"})


      const updatedOrg = await Organization.findByIdAndUpdate(org._id, {wallet: (wallet - amount).toString()}, {new: true})
      const updatedEmployee = await Employee.findByIdAndUpdate(request.ownerId, {wallet: (wallet + amount).toString()}, {new: true})

      if (updatedOrg && updatedEmployee) {
        const transRemove = Transaction.create({
          transactionType: "Reimbursement",
          requestId: id,
          employee: request.ownerId,
          amount: amount,
          deduction: true,
          org: code,
          model: 'Organization',
          author: org._id
        })

        const transAdd = Transaction.create({
          transactionType: "Reimbursement",
          requestId: id,
          amount: amount,
          deduction: false,
          org: code,
          model: 'Employee',
          author: updatedEmployee._id
        })

        if (transRemove && transAdd) {
          request.status = requestState[2]
          await request.save()
          return res.status(STATUS_CODE.OK).json({message: "request approved sucessfully!"})
        }
      }

      throw new ApiError(STATUS_CODE.INTERNAL_ERROR, "Unable to approve request");
    } else {
      request.status = requestState[3]
      await request.save()
      return res.status(STATUS_CODE.OK).json({message: "request rejected sucessfully!"})
    }

  } catch (error) {
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }

}

async function getDashboardDetails(req, res, next) {
  try {
    const {code} = req.body

    const data = {}

    const org = await Organization.findOne({code})
    data.balance = org.walletBalance

    const reimbursmentTransactions = await Transaction.find({transactionType: "Reimbursement", org: code, author: org._id}, 'amount')
    data.totalAmountDisbursed = reimbursmentTransactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

    const walletFundingTransactions = await Transaction.find({transactionType: "Top Up", org: code, author: org._id}, 'amount')
    data.totalAmountFunded = walletFundingTransactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

    const reimbursmentTransactionsWithinThisYear = await Transaction.find({transactionType: "Reimbursement", org: code, author: org._id, date: {$gte: new Date(new Date().getFullYear(), 0, 1), $lte: new Date(new Date().getFullYear(), 11, 31)}}, 'amount employee')
    const reimbursmentTransactionsWithinLastYear = 
      await Transaction.find({transactionType: "Reimbursement", org: code, author: org._id, date: {$gte: new Date(new Date().getFullYear() - 1, 0, 1), $lte: new Date(new Date().getFullYear() - 1, 11, 31)}}, 'amount employee')

    const getTop10 = async (arr, dataKey) => {
      // calculate top 10 employees with the most expense within a given year
      // arr is the array of reimbursement transactions within a given year
      // dataKey is the corresponding key for the result response to be returned
      const sortByTop10 = {};
      arr.forEach((transaction) => {
        if (transaction.employee in sortByTop10) {
          sortByTop10[transaction.employee].total += parseFloat(transaction.amount);
          sortByTop10[transaction.employee].count += 1;
        } else {
          sortByTop10[transaction.employee] = {
            total: parseFloat(transaction.amount),
            count: 1,
          };
        }
      });

      // Convert sortByTop10 into an array sorted in decreasing order from item.count
      const top10 = Object.keys(sortByTop10).sort(
        (a, b) => sortByTop10[b].count - sortByTop10[a].count
      ).slice(0, 10);
  
      data[dataKey] = await Promise.all(
        top10.map(async (employee) => {
          const user = await Employee.findById(employee, 'firstName lastName');
          return {
            employee: user,
            total: sortByTop10[employee].total,
            count: sortByTop10[employee].count,
          };
        })
      );
    }

    await getTop10(reimbursmentTransactionsWithinThisYear, 'topTenEmployeesWithMostExpenseThisYear')
    await getTop10(reimbursmentTransactionsWithinLastYear, 'topTenEmployeesWithMostExpenseLastYear')

    return res.status(STATS_CODE.OK).json(data);

  } catch (error) {
    console.log(error)
    return res.status(error.statusCode || STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

module.exports = {
  registerOrganization,
  signinOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
  getEmployees,
  getEmployee,
  deactivateEmployee,
  approveOrRejectRequest,
  getDashboardDetails,
};
