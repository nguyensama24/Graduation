const AdminController = require('../controller/AdminController');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkAdminAuthentication = async (req, res, next) => {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const { username, password } = req.body;

    if (username === adminUsername && password === adminPassword) {
        // Đăng nhập bằng tài khoản env
        req.adminDetails = {
            username: adminUsername,
            // Thêm các trường env cần thiết
            email: process.env.ADMIN_EMAIL,
            name: process.env.ADMIN_NAME,
            phonenumber: process.env.ADMIN_PHONE,
            dateofbirth: process.env.ADMIN_DATE_OF_BIRTH,
            sex: process.env.ADMIN_SEX,
        };
        next();
    } else {
        try {
            const admin = await prisma.admin.findFirst({
                where: { username },
            });

            if (admin) {
                const passwordMatch = await bcrypt.compare(password, admin.password);

                if (passwordMatch) {
                    // Đăng nhập thành công bằng tài khoản database
                    // Nếu muốn thêm dữ liệu từ database, bạn cũng có thể thực hiện tương tự
                    req.adminDetails = {
                        username: admin.username,
                        email: admin.email,
                        name: admin.name,
                        phonenumber: admin.phonenumber,
                        dateofbirth: admin.dateofbirth,
                        sex: admin.sex,
                    };
                    next();
                } else {
                    res.status(401).send('Không thể đăng nhập');
                }
            } else {
                res.status(401).send('Không thể đăng nhập');
            }
        } catch (error) {
            console.error('Lỗi: ' + error);
            res.status(500).json({ error: 'Lỗi khi xác thực' });
        }
    }
};

router.post('/login', checkAdminAuthentication, (req, res) => {
    // Đối tượng req.adminDetails giờ có thêm dữ liệu từ env hoặc database
    const adminDetails = req.adminDetails;

    res.send(adminDetails);
});

router.post('/getalladmin', AdminController.getAllAdmins);
router.post('/addadmin', AdminController.createAdmin);
router.delete('/deleteadmin/:id', AdminController.deleteAdmin);
router.post('/changepassword/:id', AdminController.ChangePassword);

router.put('/adminprofile/:username', AdminController.AdminProfile);

router.get('/chitietadmin/:username', AdminController.getAdmin);

router.post('/addimageadmin', AdminController.addImageAdmin);
router.put('/updateimageadmin/:idadmin', AdminController.updateImageAdmin);

// router.post("/logoutAdmin", AdminController.logoutAdmin);
//ss

module.exports = router;
