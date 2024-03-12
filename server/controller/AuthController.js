const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const SendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const decode = require('jwt-decode');
dotenv.config();

const AuthController = {
    // CHECK EXPRIED REFRESH TOKEN
    isRefreshTokenExpired: (refreshToken) => {
        const decoded = jwt.decode(refreshToken);

        if (decoded && decoded.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp > currentTime;
        }

        return true; // Treat as expired if there's no expiration claim
    },
    // CHECK EXPRIED ACCESS TOKEN
    isAccessTokenExpired: (accesstoken) => {
        const decoded = jwt.decode(accesstoken);

        if (decoded && decoded.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp > currentTime;
        }

        return true; // Treat as expired if there's no expiration claim
    },
    // GENERATE ACCESS TOKEN
    genereateAccessToken: (email) => {
        return jwt.sign(
            {
                email: email,
            },
            process.env.SECRECT_KEY,
            { expiresIn: '30m' }
        );
    },
    // GENERATE REFRESH TOKEN
    genereateRefreshToken: (email) => {
        return jwt.sign(
            {
                email: email,
            },
            process.env.JWT_REFRESH_TOKEN,
            { expiresIn: '30d' }
        );
    },
    generateForgotPasswordToken: (email) => {
        return jwt.sign(
            {
                email: email,
            },
            process.env.JWT_FORGOT_PASSWORD_TOKEN,
            { algorithm: 'HS256' },
            { expiresIn: '15m' }
        );
    },
    // GENERATE A NEW ACCESSTOKEN IF IT'S EXPRIED
    generateNewAccessToken: async (req, res) => {
        try {
            const idUser = parseInt(req.cookies.id);
            const accessToken = req.cookies.accesstoken;
            const user = await prisma.user.findFirst({
                where: {
                    id: idUser,
                },
            });
            if (!user) return res.status(404).send('User is undifined');
            if (AuthController.isRefreshTokenExpired(user.refresh_token) == false)
                return res.status(404).send('Refresh token is expried');

            if (AuthController.isAccessTokenExpired(accessToken) == false) {
                let newAccessToken = AuthController.genereateAccessToken(user.email);
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);

                res.cookie('accesstoken', newAccessToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    expires: expirationDate,
                });
                return res.status(200).json({ newAccessToken, message: 'Access token renewed' });
            } else {
                return res.status(200).json('Access token still expried');
            }
        } catch (error) {
            res.status(404).send(error);
        }
    },
    // RETURN REFRESH TOKEN TO FE
    checkRefreshToken: async (req, res) => {
        try {
            const idUser = parseInt(req.cookies.id);
            const user = await prisma.user.findFirst({
                where: {
                    id: idUser,
                },
            });
            if (!user) return res.send('user is undifined');
            if (AuthController.isRefreshTokenExpired(user.refresh_token) == false) {
                res.clearCookie('id');
                res.clearCookie('accesstoken');
                res.status(300).json('AccessToken is expried, login again');
            } else {
                res.send('Refresh token still expried');
            }
        } catch (error) {
            res.status(404).send(error);
        }
    },
    // REGISTER
    register: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            if (!req.body.password || !salt) {
                throw new Error('Missing password or salt');
            }

            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = {
                email: req.body.email,
                username: req.body.username,
                password: hashed,
                name: req.body.name,
                phonenumber: req.body.phonenumber,
            };

            const user = await prisma.user.create({
                data: newUser,
            });
            const token = await prisma.token.create({
                data: {
                    userid: user.id,
                    token: crypto.randomBytes(32).toString('hex'),
                },
            });

            const url = `${process.env.BASE_URL_FORGOTPASSWORD}/buyzzle/auth/${user.id}/verify/${token.token}`;
            await SendEmail(user.email, 'Verify email', url);

            res.status(200).send('Register Successfully, Please check Email to verify your account');
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // LOGIN
    login: async (req, res) => {
        try {
            const reqpassword = req.body.password;

            const user = await prisma.user.findFirst({
                where: { email: req.body.email },
            });
            if (!user) {
                return res.status(404).json('Sai email');
            }
            const validPassword = await bcrypt.compare(reqpassword, user.password);

            if (!validPassword) {
                return res.status(404).json('Sai mật khẩu');
            }

            if (user.verify == false) {
                const token = await prisma.token.findFirst({
                    where: { userid: parseInt(user.id) },
                });
                if (!token) {
                    token = await prisma.token.create({
                        id: user.id,
                        token: crypto.randomBytes(32).toString('hex'),
                    });
                    const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;
                    await SendEmail(user.email, 'Verify email', url);
                }
                return res.status(404).json('An email has sent to your email, please check that');
            }

            if (user.email && validPassword) {
                let accessToken = AuthController.genereateAccessToken(user.email);
                let refreshToken = AuthController.genereateRefreshToken(user.email);

                if (!user.refresh_token) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { refresh_token: refreshToken },
                    });
                } else {
                    const refreshTokenExpires = AuthController.isRefreshTokenExpired(user.refresh_token);
                    if (refreshTokenExpires == false) {
                        await prisma.user.update({
                            where: {
                                id: user.id,
                            },
                            data: {
                                refresh_token: refreshToken,
                            },
                        });
                    }
                }

                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);

                res.cookie('accesstoken', accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    expires: expirationDate, // Set an expiration date
                });

                res.cookie('id', user.id, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                    expires: expirationDate, // Set an expiration date
                });

                const { password, ...others } = user;
                return res.status(200).json({ accessToken, ...others });
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).json(error.message);
        }
    },

    // RESET PASSWORD

    resetPassword: async (req, res) => {
        try {
            const token = req.params.token;
            const decodedBase64 = Buffer.from(token, 'base64').toString('utf-8');
            const decoded = decode(decodedBase64);
            const salt = await bcrypt.genSalt(10);
            if (!req.body.newPassword || !salt) {
                throw new Error('Missing password or salt');
            }
            const hashed = await bcrypt.hash(req.body.newPassword, salt);
            await prisma.user.update({
                where: {
                    email: decoded.email,
                },
                data: {
                    password: hashed,
                },
            });

            await prisma.user.update({
                where: {
                    email: decoded.email,
                },
                data: {
                    forgotpassword_token: null,
                },
            });
            res.status(200).send('Change password successfully');
        } catch (error) {
            res.status(500).send('Something when Wrong');
        }
    },

    // SEND EMAIL TO FORGOT PASSWORD
    forgotPassword: async (req, res) => {
        try {
            const reqemail = req.body.email;

            const user = await prisma.user.findUnique({
                where: {
                    email: reqemail,
                },
            });

            if (!user) {
                return res.status(404).send('Email is not found');
            }

            if (!user.verify) {
                return res.status(400).send('Your account is not verified. Please check your Email');
            }

            if (user.forgotpassword_token == null) {
                const forgot_pasword_token_JWT = AuthController.generateForgotPasswordToken(user.email);
                const forgot_password_token_base64 = Buffer.from(forgot_pasword_token_JWT).toString('base64');
                await prisma.user.update({
                    where: {
                        email: user.email,
                    },
                    data: {
                        forgotpassword_token: forgot_password_token_base64,
                    },
                });
                const url = `${process.env.BASE_URL}/buyzzle/auth/resetpassword/${forgot_password_token_base64}`;
            } else {
                const url = `${process.env.BASE_URL}/buyzzle/auth/resetpassword/${user.forgotpassword_token}`;
            }

            const url = `${process.env.BASE_URL_FORGOTPASSWORD}/buyzzle/auth/resetpassword/${user.forgotpassword_token}`;
            await SendEmail(user.email, 'Forgot Password', url);

            res.status(200).send('A Link has sent to your email');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    },

    // REQUEST REFRESH AND ACCESS TOKEN
    requestRefreshToken: async (req, res) => {
        // take refresh token from user
        const refreshToken = req.cookies.refreshtoken;
        if (!refreshToken) return res.status(401).json('You are not authenticated');
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, email) => {
            if (err) {
                console.log(err);
            }
            // create new access token, refresh token
            const newAccesstoken = AuthController.genereateAccessToken(email);
            const newRefrestoken = AuthController.genereateRefreshToken(email);
            res.status(200).json({ accesstoken: newAccesstoken });
        });
    },

    // VERIFY ACCOUNT WHEN REGISTER WITH EMAIL
    verify: async (req, res) => {
        try {
            const userID = parseInt(req.params.id);
            const reqToken = req.params.token;

            const user = await prisma.user.findUnique({
                where: { id: userID },
            });

            if (!user) return res.status(400).send({ message: 'invalid link' });

            const token = await prisma.token.findFirst({
                where: {
                    userid: user.id,
                    token: reqToken,
                },
            });
            if (!token) {
                return res.status(400).send({ message: 'Invalid token' });
            }
            await prisma.user.update({
                where: { id: userID },
                data: { verify: true },
            });
            const tokenId = parseInt(token.id);

            await prisma.token.delete({
                where: {
                    userid: userID,
                    id: tokenId,
                },
            });
            res.status(200).send({ message: 'Email verified successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Internal server error' });
        }
    },
    //CHANGE PASSWORD
    changePassword: async (req, res) => {
        try {
            const idUser = parseInt(req.cookies.id);
            const refresh_token = req.cookies.refreshtoken;
            const user = await prisma.user.findUnique({
                where: {
                    id: idUser,
                },
            });
            const isValidPassword = await bcrypt.compare(req.body.oldPassword, user.password);

            if (!isValidPassword) {
                return res.status(404).send('Old Password is not valid');
            }

            const salt = await bcrypt.genSalt(10);
            if (!req.body.newPassword || !salt) {
                throw new Error('Missing password or salt');
            }
            const hashed = await bcrypt.hash(req.body.newPassword, salt);

            await prisma.user.update({
                where: {
                    id: idUser,
                },
                data: {
                    password: hashed,
                },
            });

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashed,
              
                },
            });
            res.status(200).send('Change Password Successfully');
        } catch (error) {
            res.status(404).send('Change Password Failed');
        }
    },
    // LOG OUT
    logout: async (req, res) => {
        try {
            const accessToken = req.cookies.accesstoken;
            const token = decode(accessToken);

            const user = await prisma.user.update({
                where: {
                    email: token.email,
                },
                data: {
                    refresh_token: null,
                },
            });
            res.clearCookie('refreshtoken');
            res.clearCookie('accesstoken');
            res.clearCookie('id');
            res.status(200).send('Logged out successfully');
        } catch (error) {
            res.status(500).send('Logout failed');
        }
    },
};
module.exports = AuthController;
