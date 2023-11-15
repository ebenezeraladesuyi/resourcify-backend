const envVariable = require("../config/envVariables");
const jwt = require("jsonwebtoken");

function generateAccessToken(email, code, isAdmin) {
    const data = {email, code, isAdmin}
    return jwt.sign({data}, envVariable.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
}

function generateRefreshToken(email, code, isAdmin) {
    const data = {email, code, isAdmin}
    return jwt.sign({data}, envVariable.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    const data = jwt.verify(token, envVariable.ACCESS_TOKEN_SECRET);
    return { data };
  } catch (error) {
    return { error: error };
  }
}

function verifyRefreshToken(token) {
  try {
    const data = jwt.verify(token, envVariable.REFRESH_TOKEN_SECRET);
    return { data };
  } catch (error) {
    return { error: error };
  }
}


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    verifyRefreshToken
}