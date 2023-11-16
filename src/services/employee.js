const envVariable = require("../config/envVariables");
const Employee = require("../models/Employee");
const {Organization} = require("../models/Organization");
const { ValidationError, STATUS_CODE } = require("../utils/app-errors");
const bcrypt = require("bcrypt");
const { generateHashedPassword } = require("../utils/globalFunctions");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { Reimbursement } = require("../models/Reimbursement");


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


module.exports = {
  registerEmployee,
  signinEmployee,
  getEmployee,
  updateEmployee,
  deactivateEmployee,
  getReimbursmentRequests,
  getReimbursmentRequest,
  createReimbursmentRequest,
};
