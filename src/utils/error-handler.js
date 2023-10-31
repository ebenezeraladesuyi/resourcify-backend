const { AppError } = require("./app-errors");

class ErrorLogger {
  constructor() {}
  async logError(err) {
    console.log(
      "=================== Starting ErrorLogger ====================="
    );
    console.log({ message: `${new Date().getTime()}--${JSON.stringify(err)}` });
    console.log(
      "=================== Starting ErrorLogger ====================="
    );

    return false;
  }

  isTrustError(error) {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}

const errorHandler = async (err, req, res, next) => {
  const errorLogger = new ErrorLogger();

  process.on("unhandledRejection", (reason, promise) => {
    console.log(reason);
    throw reason;
  });

  process.on("uncaughtException", (error, origin) => {
    console.log(error);
  });

  if (err) {
    await errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(err.statusCode).json({ message: errorDescription });
      }
      return res.status(err.statusCode).json({ message: err.message });
    } else {
    }
    return res.status(err.statusCode).json({ message: err.message });
  }
  next();
};

module.exports = errorHandler;
