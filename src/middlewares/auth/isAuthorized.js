const jwt = require("jsonwebtoken");
const { ValidationError } = require("../../utils/app-errors");
const Employee = require("../../models/Employee");

async function isAuthorized(req, res, next) {
  const authHeader =
    (req && req.headers.authorization) || (req && req.headers.authorization);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ValidationError("Token not found");
  }

  jwt.verify(authHeader.split(" ")[1], "Secret", async (err, decodedUser) => {
    if (err) {
      const errorMsg =
        err.name === "JsonWebTokenError"
          ? "Auth Failed (Unauthorized)"
          : err.message;
      next(new ValidationError(errorMsg));
    }

    const verifiedUser = await Employee.findOne({
      _id: decodedUser._id,
    }).select("-password");

    if (!verifiedUser) {
      next(ValidationError("Unauthorized user"));
    }

    req.user = verifiedUser;

    next();
  });
}

module.exports = isAuthorized;
