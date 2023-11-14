const Organization = require("../models/Organization");
const { generate } = require("randomstring");
const { STATUS_CODE, BadRequestError } = require("../utils/app-errors");

async function registerOrganization(req, res, next) {
  const { name, email, password } = req.body;

  try {
    const organization = new Organization({
      name,
      code: generate(8),
      email,
      password,
    });

    organization.policies.reimbusmentLimit = reimbusmentLimit;
    const data = await organization.save();
    return res.status(STATUS_CODE.CREATED).json({ data });
  } catch (error) {
    return res.status(STATUS_CODE.INTERNAL_ERROR).json(error);
  }
}

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

module.exports = {
  registerOrganization,
  getOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
};
