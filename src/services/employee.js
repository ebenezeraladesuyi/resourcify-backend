const envVariable = require("../config/envVariables");
const Employee = require("../models/Employee");
const Organization = require("../models/Organization");
const Token = require("../models/Token");
const { ValidationError, STATUS_CODE } = require("../utils/app-errors");

async function registerEmployee(req, res, next) {
  const { firstName, lastName, email, password, organizationCode } = req.body;

  try {
    const organization = await Organization.findOne({ code: organizationCode });

    if (organizationCode !== organization.code) {
      throw new ValidationError("Invalid organization code");
    }
    const employee = new Employee({
      firstName,
      lastName,
      email,
      password,
      organizationCode,
    });

    await employee.save();
    organization.employees.push(employee._id);

    const token = new Token({ userID: employee._id });
    const accessToken = envVariable.ACCESS_TOKEN_SECRET;

    return res.status(STATUS_CODE.CREATED).json(employee);
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

async function signinEmployee(req, res, next) {}

async function getEmployees(req, res, next) {
  try {
  } catch (error) {}
}
async function getEmployee(req, res, next) {}
async function updateEmployee(req, res, next) {}
async function deleteEmployee(req, res, next) {}

module.exports = {
  registerEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
