const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const AdminShippingController = {
    registerShipping: async (req, res) => {
        try {
            const { name, email, password, city, address, phonenumber, sex, dateofbirth, username } = req.body;

            const existingEmail = await prisma.shippingUnit.findFirst({
                where: { email },
            });

            if (existingEmail) {
                return res.status(400).json('Email đã được sử dụng');
            }

            const existingUsername = await prisma.shippingUnit.findFirst({
                where: { username },
            });

            if (existingUsername) {
                return res.status(400).json('Username đã được sử dụng');
            }

            const existingphone = await prisma.shippingUnit.findFirst({
                where: { phonenumber },
            });

            if (existingphone) {
                return res.status(400).json('Sdt đã được sử dụng');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newShippingUnit = await prisma.shippingUnit.create({
                data: {
                    name,
                    username,
                    email,
                    password: hashedPassword,
                    city,
                    address,
                    phonenumber,
                    sex,
                    dateofbirth: new Date(),
                },
            });

            return res.status(201).json(newShippingUnit);
        } catch (error) {
            console.error('loi', error);
            return res.status(500).json({ error: 'Server Error' });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await prisma.shippingUnit.findFirst({
                where: {
                    username,
                },
            });

            // Nếu người vận chuyển không tồn tại hoặc mật khẩu không khớp, trả về lỗi
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json('loi');
            }

            // Lưu username vào local storage
            // Bạn có thể sử dụng một middleware cookie hoặc jwt để quản lý phiên đăng nhập
            // ở đây, tôi sử dụng res.cookie để đặt cookie với tên "username" và giá trị là username
            res.cookie('username', username);

            return res.status(200).json(username);
        } catch (error) {
            console.error('Error', error);
            return res.status(500).json({ error: 'Server Error' });
        }
    },

    deleteShipping: async (req, res) => {
        try {
            const { id } = req.params;

            const existingShipping = await prisma.shippingUnit.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!existingShipping) {
                return res.status(404).json('kh tim thay');
            }

            await prisma.shippingUnit.delete({
                where: {
                    id: parseInt(id),
                },
            });

            // Trả về thông báo thành công
            return res.status(200).json('xoa thanh cong');
        } catch (error) {
            console.error('Error', error);
            return res.status(500).json({ error: 'Server Error' });
        }
    },

    getAllShipping: async (req, res) => {
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
            const totalShippingPage = await prisma.shippingUnit.count({
                where: whereClause,
            });

            const shipping = await prisma.shippingUnit.findMany({
                where: whereClause,
                skip, // Chỉ bắt đầu từ chỉ số skip
                take: pageSize, // Lấy số lượng bản ghi tối đa là pageSize
            });

            res.json({
                page: page,
                pageSize: pageSize,
                totalPage: Math.ceil(totalShippingPage / pageSize),
                data: shipping,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json('Lỗi trong quá trình xử lý yêu cầu.');
        }
    },

    ShippingProfile: async (req, res) => {
        try {
            const shippingName = req.params.username;

            const updateShipping = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                city: req.body.city,
                address: req.body.address,
                phonenumber: req.body.phonenumber,
                sex: req.body.sex,
                dateofbirth: new Date(req.body.dateofbirth),
            };

            const updateShippingResponse = await prisma.shippingUnit.update({
                where: {
                    username: shippingName,
                },
                data: updateShipping,
            });

            res.status(200).json(updateShippingResponse);
        } catch (error) {
            res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật hồ sơ Shipping.', message: error.message });
        }
    },

    getShipping: async (req, res) => {
        try {
            const Shippingusername = req.params.username;

            // Tìm thông tin người dùng có ảnh
            const ShippingWithImage = await prisma.shippingUnit.findUnique({
                where: {
                    username: Shippingusername,
                },
                include: {
                    ShippingImage: true,
                },
            });

            // Tìm thông tin người dùng không có ảnh
            const ShippingWithoutImage = await prisma.shippingUnit.findUnique({
                where: {
                    username: Shippingusername,
                },
                select: {
                    id: true,
                    email: true,
                    city: true,
                    address: true,
                    phonenumber: true,
                    sex: true,
                    dateofbirth: true,
                },
            });

            if (!ShippingWithImage || !ShippingWithoutImage) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' });
            }

            res.status(200).json({ ShippingWithImage });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi truy xuất dữ liệu', message: error.message });
        }
    },

    addImageShipping: async (req, res) => {
        try {
            const { url, idshipping } = req.body;

            const newImageShipping = {
                url,
                idshipping: parseInt(idshipping),
            };

            const data = await prisma.shippingImage.create({
                data: newImageShipping,
            });
            res.status(200).json('Them hinh thanh cong');
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    updateImageShipping: async (req, res) => {
        try {
            const { idshipping } = req.params;
            const { url } = req.body;

            const updateImage = await prisma.shippingImage.update({
                where: {
                    idshipping: parseInt(idshipping),
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

    ChangePassword: async (req, res) => {
        const ShippingId = parseInt(req.params.id);
        const { oldPassword, newPassword, confirmPassword } = req.body;

        try {
            const shipping = await prisma.shippingUnit.findUnique({
                where: { id: ShippingId },
            });

            if (!shipping) {
                res.status(404).json('Không tìm thấy tài khoản shipping');
                return;
            }

            const oldHashedPassword = shipping.password;
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

            const updatedShipping = await prisma.shippingUnit.update({
                where: { id: ShippingId },
                data: {
                    password: hashedNewPassword,
                },
            });

            res.json(updatedShipping);
        } catch (error) {
            res.status(500).json('Có lỗi xảy ra khi thay đổi mật khẩu');
        }
    },

    // logout: async (req, res) => {
    //   try {

    //     localStorage.removeItem('username');

    //     res.status(200).send(username);
    //   } catch (error) {
    //     console.error('Logout failed:', error);
    //     res.status(500).send('Logout failed');
    //   }
    // },
};

module.exports = AdminShippingController;
