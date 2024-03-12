// const sendEmail = require("../utils/sendEmail"
const OAuthController = require("../controller/OAuth2Controller");

const router = require("express").Router();

router.post("/", OAuthController.saveGoogleUserToDB)
router.post("/savecookies", OAuthController.saveToCookies)

module.exports = router;
