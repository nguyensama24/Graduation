const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cron = require('node-cron');
// const { Translate } = require('@google-cloud/translate');
// const translate = new Translate();

const VoucherController = {
    VoucherExpired: async (req, res) => {
        try {
            const today = new Date();
            const expiredVouchers = await prisma.voucher.findMany({
                where: {
                    endDay: {
                        lte: today,
                    },
                },
            });

            // Xóa voucher hết hạn
            for (const voucher of expiredVouchers) {
                await prisma.voucher.delete({
                    where: {
                        id: voucher.id,
                    },
                });
                console.log(`Voucher ${voucher.id} đã hết hạn và đã được xóa.`);
            }

            res.status(200).json('Đã xóa voucher hết hạn.');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    getAdmin: async (req, res) => {
        try {
            const page = parseInt(req.body.page) || 1;
            const pageSize = parseInt(req.body.pageSize) || 40;
            const keyword = req.body.keyword;
            let skip = (page - 1) * pageSize;
            if (keyword) {
                skip = 0;
            }
            const whereClause = {
                deletedAt: null,
                endDay: {
                    gte: new Date(),
                },
                code: {
                    contains: keyword,
                },
            };
            const totalProduct = await prisma.voucher.count({
                where: whereClause,
            });

            const products = await prisma.voucher.findMany({
                where: whereClause,
                skip,
                take: pageSize,
            });

            const results = {
                page: page,
                pageSize: pageSize,
                totalPage: Math.ceil(totalProduct / pageSize),
                data: products,
            };

            return res.status(200).json(results ?? []);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },

    getUser: async (req, res) => {
        try {
            const pageCurr = parseInt(req.query.page);
            const userIdFromCookies = parseInt(req.cookies.id);
            const limit = 100;
            const startIndex = (pageCurr - 1) * limit;
            const totalProduct = (await prisma.voucher.findMany()).length;

            const whereClause = {
                deletedAt: null,
                quantity: {
                    gte: 1,
                },
                endDay: {
                    gte: new Date(),
                },
            };
            let voucher;
            let user = null;
            if (userIdFromCookies) {
                user = await prisma.user.findFirst({
                    where: {
                        id: userIdFromCookies,
                    },
                });
                voucher = await prisma.voucher.findMany({
                    where: {
                        quantity: {
                            gte: 1,
                        },
                        endDay: {
                            gte: new Date(),
                        },
                        deletedAt: null,
                    },
                    skip: startIndex,
                    take: limit,
                    include: {
                        savedBy: {
                            where: {
                                userId: userIdFromCookies,
                            },
                            select: {
                                used: true,
                            },
                        },
                    },
                });
            } else {
                voucher = await prisma.voucher.findMany({
                    where: whereClause,
                    skip: startIndex,
                    take: limit,
                });

            }

            const results = {
                page: pageCurr,
                pageSize: limit,
                totalPage: Math.ceil(totalProduct / limit),
                data: voucher,
            };

            return res.status(200).json(results ?? []);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    },

    add: async (req, res) => {
        try {
            const { code, quantity, startDay, endDay, discount } = req.body;

            // Lấy ngày hôm nay
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili giây thành 0 để so sánh ngày

            // Chuyển đổi "startDay" và "endDay" từ dữ liệu đầu vào thành đối tượng ngày
            const startDate = new Date(startDay);
            const endDate = new Date(endDay);

            // Kiểm tra startDay
            if (startDate < today) {
                return res.status(400).json({ message: 'startDay phải là ngày hôm nay hoặc sau ngày hôm nay' });
            }

            // Kiểm tra endDay
            if (endDate < startDate) {
                return res.status(400).json({ message: 'endDay phải sau startDay' });
            }

            // Tạo voucher
            const newVoucher = {
                code,
                discount: parseInt(discount),
                quantity: parseInt(quantity),
                startDay,
                endDay,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const neww = await prisma.voucher.create({
                data: newVoucher,
            });

            res.status(200).json(neww);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    remove: async (req, res) => {
        try {
            const voucherId = parseInt(req.params.id);
            const voucherFind = await prisma.voucher.findFirst({
                where: {
                    id: voucherId,
                },
            });
            if (voucherFind) {
                await prisma.voucher.update({
                    where: {
                        id: voucherId,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });
                return res.status(200).json('thành công');
            }
            return res.status(402).json('that bai');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    update: async (req, res) => {
        try {
            const voucherid = parseInt(req.params.id);

            const { code, quantity, startDay, endDay, discount } = req.body;

            // Lấy ngày hôm nay
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây và mili giây thành 0 để so sánh ngày

            // Chuyển đổi "startDay" và "endDay" từ dữ liệu đầu vào thành đối tượng ngày
            const startDate = new Date(startDay);
            const endDate = new Date(endDay);

            // Kiểm tra startDay
            if (startDate < today) {
                return res.status(400).json({ message: 'startDay phải là ngày hôm nay hoặc sau ngày hôm nay' });
            }

            // Kiểm tra endDay
            if (endDate < startDate) {
                return res.status(400).json({ message: 'endDay phải sau startDay' });
            }

            const updateVoucher = {
                code,
                discount: parseInt(discount),
                quantity: parseInt(quantity),
                startDay,
                endDay,
                updatedAt: new Date(),
            };

            const updatedProduct = await prisma.voucher.update({
                where: {
                    id: voucherid,
                },
                data: updateVoucher,
            });
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    SaveVoucher: async (req, res) => {
        try {
            const userIdFromCookies = parseInt(req.cookies.id);
            const voucherId = parseInt(req.params.voucherId);

            const user = await prisma.user.findUnique({
                where: { id: userIdFromCookies },
            });

            const voucher = await prisma.voucher.findUnique({
                where: { id: voucherId },
            });

            if (!user || !voucher) {
                return res.status(404).json('Người dùng hoặc voucher không tồn tại.');
            }

            if (!voucher || voucher.quantity === 0) {
                return res.status(400).json('Voucher không tồn tại hoặc đã hết.');
            }

            // Kiểm tra xem người dùng đã lưu voucher này trước đó chưa
            const existingVoucher = await prisma.savedVoucher.findFirst({
                where: {
                    userId: userIdFromCookies,
                    voucherId,
                },
            });

            if (existingVoucher) {
                return res.status(400).json('Voucher đã được lưu trước đó.');
            }

            // Nếu chưa lưu, thì lưu voucher cho người dùng
            await prisma.$transaction([
                prisma.savedVoucher.create({
                    data: {
                        userId: userIdFromCookies,
                        voucherId,
                    },
                }),
                prisma.voucher.update({
                    where: {
                        id: voucherId,
                    },
                    data: {
                        quantity: voucher.quantity - 1, // Giảm quantity đi 1
                    },
                }),
            ]);

            res.status(201).json('Voucher đã được lưu thành công.');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        } finally {
            await prisma.$disconnect();
        }
    },

    getSavedUser: async (req, res) => {
        try {
            const userIdFromCookies = parseInt(req.cookies.id);

            const user = await prisma.savedVoucher.findMany({
                where: {
                    userId: userIdFromCookies,
                    used: false,
                    voucher: {
                        endDay: {
                            gte: new Date(),
                        },
                        startDay: {
                            lte: new Date(),
                        },
                        deletedAt: null,
                    },
                },
                include: {
                    voucher: true,
                },
            });

            if (user) {
                // Trả về danh sách voucher mà người dùng đã lưu
                const savedVouchers = user.map((sv) => sv.voucher);
                res.status(200).json(savedVouchers);
            } else {
                res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    UseVoucher: async (req, res) => {
        try {
            const userId = parseInt(req.body.userId);
            const voucherId = parseInt(req.body.voucherId);

            // Kiểm tra xem người dùng đã lưu voucher chưa
            const savedVoucher = await prisma.savedVoucher.findFirst({
                where: {
                    userId: userId,
                    voucherId: voucherId,
                    used: false,
                },
            });

            // Sử dụng voucher và xóa voucher đã lưu khỏi danh sách voucher đã lưu của người dùng
            await prisma.$transaction([
                prisma.savedVoucher.update({
                    where: {
                        id: savedVoucher.id,
                    },
                    data: {
                        used: true,
                    },
                }),
                prisma.voucher.update({
                    where: {
                        id: voucherId,
                    },
                    data: {
                        used: {
                            increment: 1,
                        },
                    },
                }),
            ]);

            res.status(200).json({ message: 'Sử dụng voucher thành công.' });
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    //
};

module.exports = VoucherController;
