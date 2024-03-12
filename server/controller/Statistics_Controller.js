const { PrismaClient } = require('@prisma/client');
const { prototype } = require('events');
const moment = require('moment');
const prisma = new PrismaClient();

const StatisticsController = {
    getStatictics: async (req, res) => {
        try {
            const { startDate: from, endDate: to, filterValue, page, pageSize } = req.body;

            const skip = (page - 1) * pageSize; // Số lượng sản phẩm được bỏ qua (trang đầu tiên)
            const take = pageSize; // Số lượng sản phẩm được lấy

            const currentDate = new Date();

            const yesterday = new Date(currentDate);
            yesterday.setHours(23, 59, 59, 999);
            yesterday.setDate(currentDate.getDate() - 1);

            const oneWeekAgo = new Date(yesterday);
            oneWeekAgo.setHours(0, 0, 0, 0);
            oneWeekAgo.setDate(yesterday.getDate() - 7);

            const orderInTimeRange = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: filterValue.from,
                        lte: filterValue.to,
                    },
                },
                include: {
                    OrderDetail: {
                        select: {
                            productId: true,
                            quantity: true,
                            productOrder: {
                                select: {
                                    id: true,
                                    name: true,
                                    soldcount: true,
                                    createdAt: true,
                                },
                            },
                        },
                    },
                },
            });

            const productQuantityMap = {};

            orderInTimeRange.forEach((order) => {
                if (order.OrderDetail) {
                    order.OrderDetail.forEach((detail) => {
                        const productId = detail.productId;
                        const quantity = detail.quantity;

                        if (productQuantityMap[productId]) {
                            productQuantityMap[productId] += quantity;
                        } else {
                            productQuantityMap[productId] = quantity;
                        }
                    });
                }
            });

            const topProductsInRange = await prisma.orderDetail.groupBy({
                by: ['name', 'productId', 'total', 'id', 'quantity', 'price'],
                _sum: {
                    quantity: true,
                },
                where: {
                    createdAt: {
                        gte: filterValue.from,
                        lte: filterValue.to,
                    },
                },
                orderBy: {
                    _sum: {
                        quantity: 'desc',
                    },
                },
                skip,
                take,
            });

            let totalRevenueInRange = 0;

            orderInTimeRange.forEach((order) => {
                totalRevenueInRange += order.amountTotal;
                if (order.OrderDetail) {
                    totalRevenueInRange += order.OrderDetail.reduce((acc, detail) => acc + detail.quantity, 0);
                }
            });

            const totalQuantitySoldInRange = await prisma.orderDetail.aggregate({
                where: {
                    createdAt: {
                        gte: filterValue.from,
                        lte: filterValue.to,
                    },
                },
                _sum: {
                    quantity: true,
                },
            });

            const totalOrdersInRange = await prisma.order.count({
                where: {
                    createdAt: {
                        gte: filterValue.from,
                        lte: filterValue.to,
                    },
                },
            });

            const totalQuantityInRange = orderInTimeRange.reduce((acc, order) => {
                if (order.OrderDetail) {
                    return acc + order.OrderDetail.reduce((acc, detail) => acc + detail.quantity, 0);
                }
                return acc;
            }, 0);

            // Tính phần trăm số lượng sản phẩm đã bán
            const percentageQuantitySold = (totalQuantitySoldInRange._sum.quantity / totalQuantityInRange) * 100;

            const revenuePercentageInRange = (totalQuantitySoldInRange._sum.quantity / totalRevenueInRange) * 100;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            const dataByDayLineChart = {};

            const endDate = new Date(); // Ngày hôm nay
            endDate.setHours(23, 59, 59, 999);

            const startDate = new Date(endDate); // Sao chép ngày hôm nay
            startDate.setDate(startDate.getDate() - 1); // Trừ 1 ngày
            const sixDaysAgos = new Date(startDate); // Sao chép ngày hôm qua
            sixDaysAgos.setDate(sixDaysAgos.getDate() - 6); // Trừ thêm 6 ngày

            while (startDate >= sixDaysAgos) {
                const startOfDay = new Date(startDate);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(startDate);
                endOfDay.setHours(23, 59, 59, 999);

                const categories = await prisma.category.findMany({
                    select: {
                        name: true,
                        products: {
                            where: {
                                date: {
                                    gte: startOfDay,
                                    lte: endOfDay,
                                },
                            },
                            select: {
                                soldcount: true,
                            },
                        },
                    },
                });

                // Tính tổng số lượng sản phẩm bán được cho từng danh mục trong ngày
                const topSellingProductsByCategory = categories.map((category) => {
                    const totalSoldCount = category.products.reduce(
                        (acc, product) => acc + (product.soldcount || 0),
                        0
                    );
                    return { name: category.name, totalSoldCount };
                });

                topSellingProductsByCategory.sort((a, b) => b.totalSoldCount - a.totalSoldCount);

                dataByDayLineChart[startDate.toISOString().split('T')[0]] = topSellingProductsByCategory;

                startDate.setDate(startDate.getDate() - 1); // Chuyển sang ngày trước đó
            }

            const labelsLineChart = Object.keys(dataByDayLineChart).reverse();
            const datasetsLineChart = Object.values(dataByDayLineChart[labelsLineChart[0]]).map((category) => ({
                label: category.name,
                data: labelsLineChart.map((date) => {
                    const categoryData = dataByDayLineChart[date].find((item) => item.name === category.name);
                    return categoryData ? categoryData.totalSoldCount : 0;
                }),
            }));

            const initialDataChartLine = {
                labels: labelsLineChart,
                datasets: datasetsLineChart,
            };

            const yesterdays = moment().subtract(1, 'day');
            const sixDaysAgo = yesterdays.clone().subtract(6, 'days');

            const labels = [];
            const data = [];

            while (yesterdays >= sixDaysAgo) {
                const startOfDay = yesterdays.clone().startOf('day');
                const endOfDay = yesterdays.clone().endOf('day');

                // Query the database to retrieve orders placed within the day
                const orders = await prisma.order.findMany({
                    where: {
                        createdAt: {
                            gte: startOfDay.toDate(),
                            lte: endOfDay.toDate(),
                        },
                    },
                    select: {
                        amountTotal: true,
                    },
                });

                // Calculate daily revenue
                const dailyRevenue = orders.reduce((total, order) => {
                    return total + (order.amountTotal || 0);
                }, 0);

                labels.unshift(yesterdays.format('YYYY-MM-DD'));
                data.unshift(dailyRevenue);

                yesterdays.subtract(1, 'day');
            }

            const initialDataChartBar = {
                labels,
                datasets: [
                    {
                        label: 'Doanh thu',
                        data,
                    },
                ],
            };

            res.status(200).json({
                totalRevenueInRange,
                totalQuantitySoldInRange: totalQuantitySoldInRange._sum.quantity,
                purchaseOrShoppingInRange: totalOrdersInRange,
                revenuePercentageInRange: revenuePercentageInRange,
                percentageQuantitySold: percentageQuantitySold,
                hotProductsInRange: topProductsInRange,

                initialDataChartLine: initialDataChartLine,
                initialDataChartBar: initialDataChartBar,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error });
        }
    },
};

module.exports = StatisticsController;
