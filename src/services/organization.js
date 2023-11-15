const {Organization, CustomItemType} = require("../models/Organization");
const { generate } = require("randomstring");
const { STATUS_CODE, BadRequestError, ValidationError, ApiError } = require("../utils/app-errors");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { generateHashedPassword } = require("../utils/globalFunctions");
const Employee = require("../models/Employee");


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

    await CustomItemType.create({
      name: 'others',
      organization: data._id,
      description: 'General Type for reimbursment items',
    })

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

    const employees = await Employee.find({organizationCode: code}, 'firstName lastName email')
    // const employees = await Organization.findOne({code}).populate("employees")
    return res.status(STATUS_CODE.OK).json(employees)
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
};
