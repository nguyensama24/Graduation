const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const SendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const decode = require('jwt-decode');
const { re } = require('mathjs');
const fs = require('fs').promises; // Sử dụng fs.promises để sử dụng promise-based API
const path = require('path');

const getAddressInfo = (localJson, { address, specificaddress, town }) => {
    return localJson.find((item) =>
        item.address === address &&
        item.specificaddress === specificaddress &&
        item.town === town
    );
};
dotenv.config();

const UserController = {
    deleteregister: async (req, res) => {
        try {
            const registerId = parseInt(req.params.id);
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: registerId,
                },
                include: {
                    Token: true,
                },
            });

            if (!existingUser) {
                return res.status(404).json('User không tồn tại');
            }

            if (existingUser.Token.length > 0) {
                await prisma.token.deleteMany({
                    where: {
                        userid: registerId,
                    },
                });
                return res.status(200).json('Xóa User thành công');
            }
            if (existingUser) {
                await prisma.user.update({
                    where: {
                        id: registerId,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });
            }
            return res.status(402).json('Xóa User that bai');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    UserProfile: async (req, res) => {
        try {
            const userId = req.body.username;

            const updatedUser = {
                email: req.body.email,
                username: req.body.username,
                name: req.body.name,
                phonenumber: req.body.phonenumber,
                sex: req.body.sex,
                dateOfBirth: new Date(req.body.dateOfBirth),
                image: req.body.image,
            };

            const updatedUserResponse = await prisma.user.update({
                where: {
                    username: userId,
                },
                data: updatedUser,
            });

            res.status(200).json('Lưu hồ sơ thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    getUser: async (req, res) => {
        try {
            const UserId = req.params.username;

            const whereClause = {
                deletedAt: null,
            };
            const userWithImage = await prisma.user.findUnique({
                include: {
                    UserImage: true,
                },
                where: {
                    username: UserId,
                },
            });

            // Tìm thông tin người dùng không có ảnh
            const userWithoutImage = await prisma.user.findUnique({
                where: {
                    username: UserId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phonenumber: true,
                    sex: true,
                    dateOfBirth: true,
                    createdAt: true,
                    image: true,
                    Order: {
                        select: {
                            amountTotal: true,
                        },
                        where: {
                            status: 6,
                        },
                    },
                },
            });
            const allUsers = await prisma.user.findMany({
                where: whereClause,
            });

            if (!userWithImage || !userWithoutImage) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' });
            }
            const totalAmount = userWithoutImage.Order.reduce((sum, order) => sum + order.amountTotal, 0);

            // Kết hợp thông tin từ cả hai kết quả
            const user = {
                ...userWithoutImage,
                UserImage: userWithImage.UserImage,
                allUsers: allUsers,
                totalAmount: totalAmount,
            };

            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    PaymentAddress: async (req, res) => {
        try {
            const id = req.body.id;

            const updatedPaymentAddress = {
                username: req.body.username,
                name: req.body.name,
                addresstype: req.body.addresstype,
                address: req.body.address,
                specificaddress: req.body.specificaddress,
                town: req.body.town,
                phonenumber: req.body.phonenumber,
            };

            const update = await prisma.user.update({
                where: {
                    id: id,
                },
                data: updatedPaymentAddress,
            });

            res.status(200).json(update);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    getPaymentAddress: async (req, res) => {
        try {
            const Name = req.params.username;

            // Đọc nội dung của file local.json
            const localFilePath = path.join(__dirname, 'local.json'); // Điều chỉnh đường dẫn tùy vào cấu trúc của dự án
            const localData = await fs.readFile(localFilePath, 'utf8');
            const localJson = JSON.parse(localData);

            // Lấy thông tin người dùng từ database
            const userWithoutImage = await prisma.user.findUnique({
                where: {
                    username: Name,
                },
                select: {
                    id: true,
                    name: true,
                    phonenumber: true,
                    addresstype: true,
                    address: true,
                    specificaddress: true,
                    town: true,
                },
            });

            // Lấy thông tin từ local.json dựa trên dữ liệu từ userWithoutImage
            const addressInfo = getAddressInfo(localJson, userWithoutImage);

            // Thêm thông tin địa chỉ vào đối tượng trả về
            const userWithAddress = {
                ...userWithoutImage,
                addressInfo,
            };

            // Trả về thông tin người dùng kèm theo thông tin địa chỉ
            res.status(200).json(userWithAddress);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },



    getAccountStatus: async (req, res) => {
        try {
            const Name = req.params.username;

            const AccountStatus = await prisma.user.findUnique({
                where: {
                    username: Name,
                },
                select: {
                    id: true,
                    createdAt: true,
                },
            });
            res.status(200).json(AccountStatus);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    AccountStatus: async (req, res) => {
        try {
            const Name = req.body.username;

            const updatedAccountStatus = {
                id: req.body.id,
                createdAt: req.body.createdAt,
            };

            const update = await prisma.user.update({
                where: {
                    username: Name,
                },
                data: updatedAccountStatus,
            });

            res.status(200).json(update);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    addImageUser: async (req, res) => {
        try {
            const { url, iduser } = req.body;

            const newImagesUser = {
                url,
                iduser: parseInt(iduser),
            };

            const data = await prisma.userImage.create({
                data: newImagesUser,
            });
            res.status(200).json('Thêm hinh thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    updateImageUser: async (req, res) => {
        try {
            const { iduser } = req.params;
            const { url } = req.body;

            const updateImage = await prisma.userImage.update({
                where: {
                    iduser: parseInt(iduser),
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

    getAllUser: async (req, res) => {
        try {
            const keyword = req.body.keyword;
            const page = parseInt(req.body.page) || 1;
            const pageSize = parseInt(req.body.pageSize) || 40;
            let skip = (page - 1) * pageSize;
            if (keyword) {
                skip = 0;
            }
            const whereClause = {
                deletedAt: null,
                username: {
                    contains: keyword,
                },
            };
            const totalUserPage = await prisma.user.count({
                where: whereClause,
            });
            const AllUser = await prisma.user.findMany({
                where: whereClause,
                skip,
                take: pageSize,
                include: {
                    Order: {
                        select: {
                            amountTotal: true,
                        },
                        where: {
                            status: 6,
                        },
                    },
                },
            });
            AllUser.forEach((user) => {
                user.totalAmount = user.Order.reduce((total, order) => total + order.amountTotal, 0);
            });
            res.status(200).json({
                page: page,
                pageSize: pageSize,
                totalPage: Math.ceil(totalUserPage / pageSize),
                data: AllUser,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
};
module.exports = UserController;
