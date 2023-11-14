import envVariable from "../config/envVariables";

export function generateAccessToken(email, code, isAdmin) {
    const data = {email, code, isAdmin}
    return jwt.sign({data}, envVariable.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
}

export function generateRefreshToken(email, code, isAdmin) {
    const data = {email, code, isAdmin}
    return jwt.sign({data}, envVariable.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    const data = jwt.verify(token, envVariable.ACCESS_TOKEN_SECRET);
    return { data };
  } catch (error) {
    return { error: error };
  }
}

export function verifyRefreshToken(token) {
  try {
    const data = jwt.verify(token, envVariable.REFRESH_TOKEN_SECRET);
    return { data };
  } catch (error: any) {
    return { error: error };
  }
}
