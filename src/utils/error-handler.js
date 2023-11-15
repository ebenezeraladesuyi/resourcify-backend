const { AppError } = require("./app-errors");

class ErrorLogger {
  async logError(err) {
    console.log("=================== Starting ErrorLogger =====================");
    console.log({ message: `${new Date().getTime()}--${JSON.stringify(err)}` });
    console.log("=================== Ending ErrorLogger =====================");

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

const errorLogger = new ErrorLogger();

// Set up unhandledRejection listener at the top level
process.on("unhandledRejection", (reason, promise) => {
  console.error(reason);
  // Terminate the process
  process.exit(1);
});

// Set up uncaughtException listener at the top level
process.on("uncaughtException", (error, origin) => {
  console.error(error);
  // Terminate the process
  process.exit(1);
});

const errorHandler = async (err, req, res, next) => {
  if (err) {
    await errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      const statusCode = err.statusCode || 500; // Use 500 as a default status code
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(statusCode).json({ message: errorDescription });
      }
      return res.status(statusCode).json({ message: err.message });
    } else {
      // Handle non-operational errors here
      console.error("Non-operational error:", err);
    }
    return res.status(500).json({ message: "Internal Server Error" }); // Use a default status code
  }
  next();
};

module.exports = errorHandler;
