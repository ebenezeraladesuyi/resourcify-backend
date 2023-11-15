const jwt = require("jsonwebtoken");
const { ValidationError } = require("../../utils/app-errors");
const Employee = require("../../models/Employee");
const { verifyToken } = require("../../utils/token");

async function isAuthorized(req, res, next) {
  const authHeader =
    (req && req.headers.authorization) || (req && req.headers.authorization);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ValidationError("Token not found"));
  }
  
  const bearer = (authHeader?.split(' ')[1])?.replace(/^(['"])(.*?)\1$/, '$2');
  
  const decodedToken = verifyToken(bearer);
  if (decodedToken.error) next(new ValidationError(decodedToken.error))
  
  req.body = {...req.body, ...decodedToken.data.data}
  next()

  // jwt.verify(authHeader.split(" ")[1], "Secret", async (err, decodedUser) => {
  //   if (err) {
  //     const errorMsg =
  //       err.name === "JsonWebTokenError"
  //         ? "Auth Failed (Unauthorized)"
  //         : err.message;
  //     next(new ValidationError(errorMsg));
  //   }

  //   const verifiedUser = await Employee.findOne({
  //     _id: decodedUser._id,
  //   }).select("-password");

  //   if (!verifiedUser) {
  //     next(ValidationError("Unauthorized user"));
  //   }

  //   req.user = verifiedUser;

  //   next();
  // });
}

module.exports = isAuthorized;
