const decode = require("jwt-decode");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { error } = require("console");

// VERIFY FORGOT PASSWORD TOKEN
const checkTokenForgotPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decodedBase64 = Buffer.from(token, "base64").toString("utf-8");
    const decoded = decode(decodedBase64);
    const error = {};
    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
        forgotpassword_token: token,
      },
    });
    if (user.forgotpassword_token !== token) {
      error.token = "Invalid token!";
    }

    next();
  } catch (error) {
    console.log("Somthing when wrong", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  checkTokenForgotPassword,
};
