const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const api = require("./api");
const { BadRequestError, STATUS_CODE } = require("./utils/app-errors");
const errorHandler = require("./utils/error-handler");

function appConfig(app) {
  // middleware
  app.use(cors()).use(express.json()).use(morgan("tiny"));

  // api
  app.use("/api", api);

  // Catch 404 routes
  app.all("*", (req, res, next) => {
    // next(new BadRequestError(`This route ${req.originalUrl} does not exist`));
    res.status(STATUS_CODE.NOT_FOUND).json({
      status: STATUS_CODE.NOT_FOUND,
      message: `This route ${req.originalUrl} does not exist`
    })
  });
  

  // Error middleware
  app.use(errorHandler);
}

module.exports = appConfig;
