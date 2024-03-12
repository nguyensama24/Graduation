// const sendEmail = require("../utils/sendEmail"
const AuthController = require("../controller/AuthController");
const MiddleWareController = require("../middleware/MiddleWareController");

const {
  checkTokenForgotPassword,
} = require("../middleware/validateRequest/token.middleware");
const {
  createVali,
  FogotPasswordValid,
  ResetPasswordValid,
} = require("../middleware/validateRequest/auth.middleware");
const router = require("express").Router();

// REGISTER
router.post("/register", createVali, AuthController.register);
// router.delete("/deleteregister/:id", AuthController.deleteregister);
// router.put("/userprofile/:username", AuthController.UserProfile);
// router.put("/updatepassword/:id", AuthController.UpdatePassword);

// LOGIN
router.post(
  "/login",
  MiddleWareController.loginvalidator,
  AuthController.login
);

// VERIFY TOKEN
router.post("/:id/verify/:token", AuthController.verify);

// CHANGE PASSWORD WITH isLogin
router.put(
  "/changepassword",
  MiddleWareController.verifyAuthenticate,
  ResetPasswordValid,
  AuthController.changePassword
);

// RESET PASSSWORD WITH LINK EMAIL
router.post(
  "/resetpassword/:token",
  checkTokenForgotPassword,
  FogotPasswordValid,
  AuthController.resetPassword
);
//FORGOT-PASSWORD
router.post("/forgotpassword", AuthController.forgotPassword);
// LOG OUT
router.post(
  "/logout",
  MiddleWareController.verifyAuthenticate,
  AuthController.logout
);
// GENERATE NEW ACCESSTOKEN 
router.post("/1", AuthController.generateNewAccessToken)
// CHECK REFRESH TOKEN EXPRIED
router.post("/refresh", AuthController.checkRefreshToken)

module.exports = router;
