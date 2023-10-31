const dotenv = require("dotenv");
dotenv.config();

const envVariable = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

module.exports = envVariable;
