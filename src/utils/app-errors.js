const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_FOUND: 404,
  UNAUTHORIZED: 403,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
};

class AppError extends Error {
  constructor(name, statusCode, description, logErrorResponse) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = this.isOperational;
    this.errorStack = this.errorStack;
    this.logErrorResponse = logErrorResponse;
    this.msg = description;
    Error.captureStackTrace(this);
  }
}

class ApiError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODE.INTERNAL_ERROR,
    description = "Internal Server Error",
    isOperational = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

class BadRequestError extends AppError {
  constructor(description = "Bad Request", logErrorResponse) {
    super(
      "NOT FOUND",
      STATUS_CODE.BAD_REQUEST,
      description,
      true,
      false,
      logErrorResponse
    );
  }
}

class ValidationError extends AppError {
  constructor(description = "Validation Error", errorStack) {
    super(
      "BAD_REQUEST",
      STATUS_CODE.BAD_REQUEST,
      description,
      true,
      errorStack
    );
  }
}

module.exports = {
  STATUS_CODE,
  AppError,
  ApiError,
  BadRequestError,
  ValidationError,
};
