const envVariable = require("../config/envVariables");
const Employee = require("../models/Employee");
const {Organization} = require("../models/Organization");
const { ValidationError, STATUS_CODE } = require("../utils/app-errors");
const bcrypt = require("bcrypt");
const { generateHashedPassword } = require("../utils/globalFunctions");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");


// signup
async function registerEmployee(req, res, next) {
  const { firstName, lastName, email, password, organizationCode } = req.body;

  try {
    const organization = await Organization.findOne({ code: organizationCode });

    if (organizationCode !== organization.code) {
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

    return res.status(STATUS_CODE.CREATED).json(employee);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_ERROR).json(error);
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


// 
async function getEmployees(req, res, next) {
  try {
  } catch (error) {}
}


async function getEmployee(req, res, next) {}


async function updateEmployee(req, res, next) {}


async function deleteEmployee(req, res, next) {}


module.exports = {
  registerEmployee,
  signinEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
