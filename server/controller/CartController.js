const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CartController = {
    // ADD ITEM TO CART ////
    addToCart: async (req, res) => {
        try {
            const userId = parseInt(req.cookies.id);
            const { productId: prodId, quantity: qty } = req.body;

            const productId = parseInt(prodId);
            const quantity = parseInt(qty || 1); // default to 1 if not provided
            let cart = await CartController.findCart(userId, productId);

            if (!cart) {
                cart = await CartController.createCart(userId, productId, quantity);
                cart.subtotal += cart.item.price * quantity;
                return res.status(201).json(cart);
            }

            const product = await prisma.product.findFirst({
                where: { id: productId },
            });
            const existingCartItem = cart.item.find((item) => item.productid === productId);

            if (existingCartItem) {
                if (existingCartItem.quantity + quantity > product.quantity) {
                    return res
                        .status(500)
                        .json(
                            `Bạn đã có ${existingCartItem.quantity} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
                        );
                }
            } else {
                if (quantity > product.quantity) {
                    return res
                        .status(500)
                        .json(
                            `Bạn đã có ${existingCartItem.quantity} sản phẩm trong giỏ hàng. Không thể thêm số lượng đã chọn vào giỏ hàng vì sẽ vượt quá giới hạn mua hàng của bạn.`
                        );
                }
            }

            const updatedCart = await CartController.updateCart(cart, productId, quantity);
            res.status(200).json(updatedCart);
        } catch (error) {
            console.error('error', error);
            res.status(500).json({
                error: 'An error occurred while adding the product to the cart.',
            });
        }
    },

    findCart: (userId, productId) => {
        return prisma.cart.findFirst({
            where: { userId },
            include: {
                item: { where: { productid: productId } },
            },
        });
    },

    createCart: async (userId, productId, quantity) => {
        const product = await prisma.product.findFirst({
            where: { id: productId },
        });
        return prisma.cart.create({
            data: {
                userId,
                subtotal: product.sellingPrice * quantity,
                item: {
                    create: {
                        productid: productId,
                        quantity,
                        price: product.sellingPrice,
                        total: product.sellingPrice * quantity,
                    },
                },
            },
            include: {
                item: {
                    include: {
                        product: {
                            include: {
                                ProductImage: true,
                            },
                        },
                    },
                },
            },
        });
    },

    updateCart: async (cart, productId, quantity) => {
        const existingCartItem = cart.item.find((item) => item.productid === productId);
        if (existingCartItem) {
            await prisma.itemCart.update({
                where: { id: existingCartItem.id },
                data: {
                    quantity: existingCartItem.quantity + quantity,
                    price: existingCartItem.price,
                    total: (existingCartItem.quantity + quantity) * existingCartItem.price,
                },
            });
        } else {
            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new Error(`Product with ID ${productId} not found.`);
            }

            await prisma.itemCart.create({
                data: {
                    quantity,
                    price: product.sellingPrice,
                    total: quantity * product.sellingPrice,
                    cartschema: { connect: { id: cart.id } },
                    product: { connect: { id: product.id } },
                },
            });
        }
        const updatedCartItems = await prisma.itemCart.findMany({
            where: { cartid: cart.id },
        });

        // Calculate the updated subtotal of the cart
        const updatedSubtotal = updatedCartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
        return prisma.cart.update({
            where: { id: cart.id },
            data: { subtotal: updatedSubtotal },
            include: {
                item: {
                    include: {
                        product: {
                            include: {
                                ProductImage: true,
                            },
                        },
                    },
                },
            },
        });
    },
    // DELETE ITEM FROM CART
    deleteItem: async (req, res) => {
        try {
            const userId = parseInt(req.cookies.id);
            const productId = parseInt(req.params.id);
            const cart = await prisma.cart.findFirst({
                where: {
                    userId: userId,
                },
            });
            if (!cart) {
                return res.send('Cart is not valid');
            }
            const cartItem = await prisma.itemCart.findFirst({
                where: {
                    cartid: cart.id,
                    productid: productId,
                },
            });
            if (!cartItem) {
                return res.send('Product not found in the cart');
            }
            await prisma.itemCart.delete({
                where: {
                    id: cartItem.id,
                },
            });
            const newSubtotal = cart.subtotal - cartItem.total;

            await prisma.cart.update({
                where: {
                    id: cart.id,
                },
                data: {
                    subtotal: newSubtotal,
                },
            });
            res.status(200).send('Delete item successfully');
        } catch (error) {
            console.log('error', error);
            res.status(404).send('Delete item failed');
        }
    },
    // DELETE ITEMCART FROM STRIPE
    removeItemcartStripe: async (req, res) => {
        try {
            const userId = parseInt(req.body.userId);
            const productId = parseInt(req.body.productId);
            const cart = await prisma.cart.findFirst({
                where: {
                    userId: userId,
                },
            });
            if (!cart) {
                return res.send('Cart is not valid');
            }
            const cartItem = await prisma.itemCart.findFirst({
                where: {
                    cartid: cart.id,
                    productid: productId,
                },
            });
            if (!cartItem) {
                return res.send('Product not found in the cart');
            }
            await prisma.itemCart.delete({
                where: {
                    id: cartItem.id,
                },
            });
            const newSubtotal = cart.subtotal - cartItem.total;

            await prisma.cart.update({
                where: {
                    id: cart.id,
                },
                data: {
                    subtotal: newSubtotal,
                },
            });
            res.status(200).send('Delete item successfully');
        } catch (error) {
            res.status(404).send('failed Delete item');
        }
    },
    // DELETE ALL ITEM ON CART
    deleteAllItemOnCart: async (req, res) => {
        try {
            const userId = parseInt(req.cookies.id);
            const cart = await prisma.cart.findFirst({
                where: {
                    userId: userId,
                },
            });
            if (!cart) {
                return res.send('Cart is not valid');
            }
            const cartItems = await prisma.itemCart.findMany({
                where: {
                    cartid: cart.id,
                },
            });
            if (cartItems.length === 0) {
                return res.send('No items in the cart to delete');
            }
            for (const cartItem of cartItems) {
                await prisma.itemCart.delete({
                    where: {
                        id: cartItem.id,
                    },
                });
            }
            const updateCart = await prisma.cart.update({
                where: {
                    id: cart.id,
                },
                data: {
                    subtotal: 0,
                },
            });
            res.status(200).send('Delete cart successfully');
        } catch (error) {
            console.log('error', error);
            res.status(404).send('Delete all item failed');
        }
    },

    // INCREASE-ITEM (tăng số lượng của item)
    increaseItem: async (req, res) => {
        try {
            const cartId = parseInt(req.body.cartId);
            const productId = parseInt(req.body.productId);
            const increase = 1;
            const cartItem = await prisma.itemCart.findFirst({
                where: { cartid: cartId, productid: productId },
            });

            if (!cartItem) throw new Error('Item not found in cart.');

            await prisma.itemCart.update({
                where: { id: cartItem.id },
                data: {
                    quantity: cartItem.quantity + increase,
                    total: (cartItem.quantity + increase) * cartItem.price,
                },
            });
            const cartItems = await prisma.itemCart.findMany({
                where: { cartid: cartId },
            });

            const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);

            const newCart = await prisma.cart.update({
                where: { id: cartId },
                data: { subtotal: subtotal },
                include: {
                    item: {
                        include: {
                            product: {
                                include: {
                                    ProductImage: true,
                                },
                            },
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    },
                },
            });

            res.status(200).json({
                status: true,
                data: newCart,
            });
        } catch (error) {
            console.log('error', error);
            // res.status(404).send('Increase item is failed');
        }
    },
    // DECREASE-ITEM (Giảm số lượng của item)
    decreaseItem: async (req, res) => {
        try {
            const cartId = parseInt(req.body.cartId);
            const productId = parseInt(req.body.productId);
            const decrease = 1;
            const cartItem = await prisma.itemCart.findFirst({
                where: { cartid: cartId, productid: productId },
            });

            if (!cartItem) throw new Error('Item not found in cart.');

            await prisma.itemCart.update({
                where: { id: cartItem.id },
                data: {
                    quantity: cartItem.quantity - decrease,
                    total: (cartItem.quantity - decrease) * cartItem.price,
                },
            });
            const cartItems = await prisma.itemCart.findMany({
                where: { cartid: cartId },
            });

            const subtotal = cartItems.reduce((acc, item) => acc + item.total, 0);

            const newCart = await prisma.cart.update({
                where: { id: cartId },
                data: { subtotal: subtotal },
                include: {
                    item: {
                        include: {
                            product: {
                                include: {
                                    ProductImage: true,
                                },
                            },
                        },
                        orderBy: {
                            id: 'desc',
                        },
                    },
                },
            });

            res.status(200).json({
                status: true,
                data: newCart,
            });
        } catch (error) {
            console.log('error', error);
            // res.status(404).send('Increase item is failed');
        }
    },

    // GET CART
    getCart: async (req, res) => {
        try {
            const id = parseInt(req.cookies.id);
            if (!id) {
                res.status(404).send('You are not Authenticate');
            } else {
                let cart = await prisma.cart.findFirst({
                    where: {
                        userId: id,
                    },
                    include: {
                        item: {
                            include: {
                                product: {
                                    include: {
                                        ProductImage: true,
                                    },
                                },
                            },
                            orderBy: {
                                id: 'desc',
                            },
                        },
                    },
                });
                if (!cart) {
                    return res.status(400).json({
                        type: 'Invalid',
                        msg: 'Cart not Found',
                    });
                }
                res.status(200).json({
                    status: true,
                    data: cart,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({
                type: 'Invalid',
                msg: 'Something went wrong',
                err: err,
            });
        }
    },
};

module.exports = CartController;
