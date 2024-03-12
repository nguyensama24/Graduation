const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const decode = require("jwt-decode");
const cookieParser = require("cookie-parser");

dotenv.config();

const MiddleWareController = {
  // VERIFY TOKEN
  verifyAuthenticate: (req, res, next) => {
    const token = req.cookies.accesstoken;
    if (token) {
      jwt.verify(token, process.env.SECRECT_KEY, (err, user) => {
        if (err) {
          console.log("Token is not valid");
          return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
      });
    } else {
      console.log("You are not authenticated "+token);
      return res.status(401).json({ message: "Unauthorized" });
    }
  },

  loginvalidator: async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).send("missing Email or Password");
    }
    next();
  },
   verifyAuthenticate1 : (req, res, next) => {
    const accessToken = req.cookies.accesstoken;
    const refreshToken = req.cookies.refreshtoken;

    if (accessToken) {
        jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                console.log("Access token is not valid");
                if (refreshToken) {
                    // Access token is expired, try to refresh it
                    try {
                        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

                        // Generate a new access token
                        const newAccessToken = jwt.sign({ email: decodedRefreshToken.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

                        // Set the new access token in the response cookie
                        res.cookie('accesstoken', newAccessToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour in milliseconds

                        // Continue with the request
                        req.user = decodedRefreshToken;
                        next();
                    } catch (refreshError) {
                        console.log("Refresh token is not valid");
                        return res.status(401).json({ message: 'Unauthorized' });
                    }
                } else {
                    console.log("No refresh token available");
                    return res.status(401).json({ message: 'Unauthorized' });
                }
            } else {
                // Access token is valid, continue with the request
                req.user = user;
                next();
            }
        });
    } else {
        console.log("No access token available");
        return res.status(401).json({ message: 'Unauthorized' });
    }
  }
};
module.exports = MiddleWareController;
