const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Check for authorization header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  // Get the token from the authorization header ('Bearer': '{token}')
  const token = authHeader.split(" ")[1];
  let decodedToken;

  // Attempt to veirfy the token
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  // Decoded Token has a payload of {email, userId, iat-issuedat, exp-expiry}
  req.userId = decodedToken.userId;
  next();
};
