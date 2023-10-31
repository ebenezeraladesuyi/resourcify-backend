const { Router } = require("express");
const employeeRouter = require("./routes/employeeRouter");
const organizationRouter = require("./routes/organizationRouter");

const api = Router();

api.use("/employee", employeeRouter);
api.use("/organization", organizationRouter);

module.exports = api;
