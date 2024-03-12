const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const AdminController = {
    // get all
    getAllAdmins: async (req, res) => {
        try {
            const keyword = req.body.keyword;
            const page = parseInt(req.body.page) || 1;
            const pageSize = parseInt(req.body.pageSize) || 40;
            let skip = (page - 1) * pageSize;
            if (keyword) {
                skip = 0;
            }
            const whereClause = {
                username: {
                    contains: keyword,
                },
            };
            const totaladminPage = await prisma.admin.count({
                where: whereClause,
            });
            const Alladmin = await prisma.admin.findMany({
                where: whereClause,
                skip,
                take: pageSize,
            });
            res.status(200).json({
                page: page,
                pageSize: pageSize,
                totalPage: Math.ceil(totaladminPage / pageSize),
                data: Alladmin,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // add
    createAdmin: async (req, res) => {
        try {
            const { username, password,dateofbirth, email, name, sex, phonenumber } = req.body;

            const existingEmail = await prisma.admin.findFirst({
                where: { email },
            });

            if (existingEmail) {
                return res.status(400).json('Email đã được sử dụng');
            }

            const existingUsername = await prisma.admin.findFirst({
                where: { username },
            });

            if (existingUsername) {
                return res.status(400).json('Username đã được sử dụng');
            }

            const existingphone = await prisma.admin.findFirst({
                where: { phonenumber },
            });

            if (existingphone) {
                return res.status(400).json('Sdt đã được sử dụng');
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newAdmin = await prisma.admin.create({
                data: {
                    username,
                    password: hashedPassword,
                    email,
                    name,
                    sex,
                    phonenumber,
                    dateofbirth: new Date(),
                },
            });

            return res.status(201).json(newAdmin);
        } catch (error) {
            return res.status(500).json({ error: 'Server Error', error });
        }
    },

    // Xóa
    deleteAdmin: async (req, res) => {
        const adminId = parseInt(req.params.id);
        try {
            await prisma.admin.delete({
                where: { id: adminId },
            });
            res.json('xoa tc');
        } catch (error) {
            res.status(500).json('loi');
        }
    },

    ChangePassword: async (req, res) => {
        const adminId = parseInt(req.params.id);
        const { oldPassword, newPassword, confirmPassword } = req.body;

        try {
            const admin = await prisma.admin.findUnique({
                where: { id: adminId },
            });

            if (!admin) {
                res.status(404).json('Không tìm thấy tài khoản admin');
                return;
            }

            const oldHashedPassword = admin.password;
            // So sánh mật khẩu cũ đã nhập từ người dùng với mật khẩu cũ đã mã hóa
            const oldPasswordMatch = await bcrypt.compare(oldPassword, oldHashedPassword);

            if (!oldPasswordMatch) {
                res.status(401).json('Mật khẩu cũ không chính xác');
                return;
            }

            if (newPassword !== confirmPassword) {
                res.status(400).json('Mật khẩu mới và xác nhận mật khẩu không khớp');
                return;
            }
            if (oldPassword == newPassword) {
                res.status(400).json('Mật khẩu cũ và mật khẩu mới không được trùng nhau');
                return;
            }
            // Mã hóa mật khẩu mới
            const saltRounds = 10;
            const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

            const updatedAdmin = await prisma.admin.update({
                where: { id: adminId },
                data: {
                    password: hashedNewPassword,
                },
            });

            res.json(updatedAdmin);
        } catch (error) {
            res.status(500).json('Có lỗi xảy ra khi thay đổi mật khẩu');
        }
    },

    AdminProfile: async (req, res) => {
        try {
            const adminUsername = req.body.username;

            const updateAdmin = {
                email: req.body.email,
                username: req.body.username,
                name: req.body.name,
                phonenumber: req.body.phonenumber,
                sex: req.body.sex,
                dateofbirth: new Date(req.body.dateofbirth),
            };

            const updateAdminResponse = await prisma.admin.update({
                where: {
                    username: adminUsername,
                },
                data: updateAdmin,
            });
            res.status(200).json(updateAdminResponse);
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật hồ sơ admin.', message: error.message });
        }
    },

    getAdmin: async (req, res) => {
        try {
            const adminUsername = req.params.username;

            // Tìm thông tin người dùng có ảnh
            const adminWithImage = await prisma.admin.findUnique({
                where: {
                    username: adminUsername,
                },
                include: {
                    AdminImage: true,
                },
            });
            //ss
            // Tìm thông tin người dùng không có ảnh
            const adminWithoutImage = await prisma.admin.findUnique({
                where: {
                    username: adminUsername,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phonenumber: true,
                    sex: true,
                    dateofbirth: true,
                },
            });

            if (!adminWithImage || !adminWithoutImage) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' });
            }

            res.status(200).json({ adminWithImage });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi truy xuất dữ liệu', message: error.message });
        }
    },

    addImageAdmin: async (req, res) => {
        try {
            const { url, idadmin } = req.body;

            const newImageAdmin = {
                url,
                idadmin: parseInt(idadmin),
            };

            const data = await prisma.adminImage.create({
                data: newImageAdmin,
            });
            res.status(200).json('Them hinh thanh cong');
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    updateImageAdmin: async (req, res) => {
        try {
            const { idadmin } = req.params;
            const { url } = req.body;

            const updateImage = await prisma.adminImage.update({
                where: {
                    idadmin: parseInt(idadmin),
                },
                data: {
                    url,
                },
            });
            res.status(200).json('Cập nhật hình ảnh thành công');
        } catch (error) {
            res.status(500).json(error.message);
        }
    },
};

module.exports = AdminController;
