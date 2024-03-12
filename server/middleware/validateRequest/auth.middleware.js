'use strict';

const validator = require('validator');
const { PrismaClient } = require('@prisma/client');
const { error } = require('console');

const prisma = new PrismaClient();

const createVali = async (req, res, next) => {
    const { username, name, email, password, confirmpassword, phonenumber } = req.body;

    const error = {};

    const user_name = await prisma.user.findFirst({
        where: {
            username: username,
        },
    });
    const user_email = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });
    const phonenumber_email = await prisma.user.findFirst({
        where: {
            phonenumber: phonenumber,
        },
    });
    

    if (user_name) {
        error.username = 'Tên tài khoản đã tồn tại!';
    }
    if (user_email) {
        error.email = 'Email đã tồn tại!';
    }
    if(phonenumber_email){
        error.phonenumber = 'Số điện thoại đã được sử dụng!';
    }
    if (!email) {
        error.email = 'Email là trường bắt buộc!';
    } else if (!validator.isEmail(email)) {
        error.email = 'Sai định dạng email!';
    }
    if (!username) {
        error.username = 'Tên tài khoản là trường bắt buộc!';
    } else if (!validator.isLength(username, { min: 5, max: 20 })) {
        error.username = 'Tên tài khoản có độ dài không hợp lệ!';
    } else if (!validator.isAlphanumeric(username)) {
        error.username = 'Tên tài khoản không đúng!';
    }

    if (!name) {
        error.name = 'Tên là trường bắt buộc!';
    } else if (!validator.isLength(name, { min: 5, max: 30 })) {
        error.name = 'Tên có độ dài không hợp lệ!';
    }

    if (!password) {
        error.password = 'Mật khẩu là trường bắt buộc!';
    } else if (!validator.isLength(password, { min: 6, max: 20 })) {
        error.password = 'Mật khẩu có độ dài không hợp lệ';
    }

    if (!confirmpassword) {
        error.confirmpassword = 'Xác nhận lại mật khẩu là trường bắt buộc!';
    } else if (!validator.equals(password, confirmpassword)) {
        error.confirmpassword = 'Xác nhận lại mật khẩu phải trùng khớp!';
    }

    if (!phonenumber) {
        error.phonenumber = 'Số điện thoại là trường bắt buộc!';
    } else {
        // Define a regular expression pattern for a valid phone number.
        const phonePattern = /^0\d{9}$/; // This pattern assumes a 10-digit phone number.

        // Test the phone number against the pattern.
        if (!phonePattern.test(phonenumber)) {
            error.phonenumber = 'Số điện thoại không đúng định dạng!';
        }
    }

    if (Object.keys(error).length > 0) {
        return res.status(400).json({ error });
    }
    req.username = username.toLowerCase().trim();
    req.password = password.trim();
    req.name = name.trim();
    req.email = email.toLowerCase().trim();
    req.phonenumber = phonenumber.trim();

    next();
};

const FogotPasswordValid = async (req, res, next) => {
    const { newPassword, confirmNewPassword } = req.body;
    const error = {};
    if (!newPassword) {
        error.newPassword = 'Mật khẩu là trường bắt buộc!';
    } else if (!validator.isLength(newPassword, { min: 6, max: 20 })) {
        error.newPassword = 'Mật khẩu có độ dài không hợp lệ!';
    }

    if (!confirmNewPassword) {
        error.confirmNewPassword = 'Xác nhận lại mật khẩu là trường bắt buộc!';
    } else if (!validator.equals(newPassword, confirmNewPassword)) {
        error.confirmNewPassword = 'Xác nhận lại mật khẩu phải trùng khớp!';
    }

    if (Object.keys(error).length > 0) {
        return res.status(400).json({ error });
    }
    req.newPassword = newPassword.trim();
    next();
};

const ResetPasswordValid = async (req, res, next) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const error = {};
    if (!oldPassword) {
        error.newPassword = 'Mật khẩu là trường bắt buộc!';
    } else if (!validator.isLength(oldPassword, { min: 6, max: 20 })) {
        error.newPassword = 'Mật khẩu có độ dài không hợp lệ!';
    }

    if (!newPassword) {
        error.newPassword = 'Mật khẩu là trường bắt buộc!';
    } else if (!validator.isLength(newPassword, { min: 6, max: 20 })) {
        error.newPassword = 'Mật khẩu có độ dài không hợp lệ';
    }

    if (!confirmNewPassword) {
        error.confirmNewPassword = 'Xác nhận lại mật khẩu là trường bắt buộc!';
    } else if (!validator.equals(newPassword, confirmNewPassword)) {
        error.confirmNewPassword = 'Xác nhận lại mật khẩu phải trùng khớp!';
    }

    if (Object.keys(error).length > 0) {
        return res.status(400).json({ error });
    }
    req.oldPassword = oldPassword.trim();
    req.newPassword = newPassword.trim();

    next();
};
module.exports = {
    createVali,
    ResetPasswordValid,
    FogotPasswordValid,
};
