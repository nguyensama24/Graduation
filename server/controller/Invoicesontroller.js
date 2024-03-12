const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const InvoiceController = {
    CreateInvoice: async (req, res) => {
        try {
            const itemCart = req.body.cartItems;
            const iduser = parseInt(req.cookies.id);
            if (!itemCart) {
                return console.log('Item cart not found');
            }
            const newInvoice = await prisma.invoice.create({
                data: {
                    iduser: iduser,
                    invoiceDetails: {
                        create: {
                            cartId: itemCart.id,
                        },
                    },
                },
            });
            res.status(200).send(newInvoice);
        } catch (error) {
            console.log('error', error);
            res.status(404).send('Create invoice failed');
        }
    },

    getInvoice: async (req, res) => {
        try {
            const itemCart = req.body.cartItems;
            const iduser = parseInt(req.cookies.id);
            if (!itemCart) {
                return console.log('Item cart not found');
            }
            let user = await prisma.user.findFirst({
                where: {
                    id: iduser,
                },
            });
            if (!user) {
                return console.log('Cannot find user');
            }

            let invoice = await prisma.invoice.findFirst({
                where: {
                    iduser: iduser,
                },
                include: {
                    invoiceDetails: {
                        where: {
                            cartId: itemCart.id,
                        },
                        include: {
                            cart: {
                                include: {
                                    item: {
                                        include: {
                                            product: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            res.status(200).json({
                status: true,
                data: {
                    invoice: invoice,
                    user: user,
                },
            });
        } catch (error) {
            res.status(404).send('Get invoice failed');
        }
    },
    getDetailOrder: async (req, res) => {
        try {
            const iduser = parseInt(req.cookies.id);
            let user = await prisma.user.findFirst({
                where: {
                    id: iduser,
                },
            });
            if (!user) {
                return console.log('Cannot find user');
            }
            let order = await prisma.invoice.findMany({
                where: {
                    iduser: iduser,
                },
                include: {
                    invoiceDetails: {
                        include: {
                            cart: {
                                include: {
                                    item: {
                                        include: {
                                            product: {
                                                include: { ProductImage: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            res.status(200).json({
                status: true,
                data: order
            });
        } catch (error) {
            res.send(404).send('Get order details failed');
        }
    },
};
module.exports = InvoiceController;
