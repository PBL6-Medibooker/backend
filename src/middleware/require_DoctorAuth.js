const jwt = require("jsonwebtoken");
require("dotenv").config();

// Doctor auth middleware
const AuthDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login",
      });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWTSecret);

    req.body.docId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = AuthDoctor;
