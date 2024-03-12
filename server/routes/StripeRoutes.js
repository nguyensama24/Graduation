const express = require('express');
const axios = require('axios');
const app = express();
const bodyParser = require('body-parser');
const stripe = require('stripe')(
    'sk_test_51O1l6rKkoUZ1lXyFytV0ahVe1qc5GMonf289XGJlLaVxCwDwwSRZrMt30c7pWqmlxTMx5L5OhcsYnguuFDdiNJUY00ictvC17Y'
);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const cartItems = req.body.cartItems;
        const discount = req.body.discount;

        const initialTotal = cartItems.reduce((total, item) => {
            return total + item.product.sellingPrice * item.quantity;
        }, 0);

        let finalTotal = initialTotal;
        if (discount != 0) {
            finalTotal = initialTotal * (discount / 100);
        }

        const line_items = cartItems.map((item) => {
            return {
                price_data: {
                    currency: 'vnd',
                    product_data: {
                        name: item.product.name,
                        images: [item.product.ProductImage[0].url],
                        metadata: {
                            productId: item.productid,
                        },
                    },
                    unit_amount: item.product.sellingPrice,
                },
                quantity: item.quantity,
            };
        });
        const customer = await stripe.customers.create({
            metadata: {
                idUser: req.body.idUser,
                paymentMethod: req.body.method,
                note: req.body.note,
                invoice: req.body.invoice,
                name: req.body.name,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                voucherId: req.body.voucherId,
            },
        });
        const coupon = await stripe.coupons.create({
            percent_off: discount || 1,
            duration: 'once',
        });
        const shippingRate = await stripe.shippingRates.create({
            display_name: 'Ground shipping',
            type: 'fixed_amount',
            fixed_amount: {
                amount: 30000,
                currency: 'vnd',
            },
        });
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            customer: customer.id,
            discounts: !discount ? [] : [{ coupon: coupon.id }],
            shipping_options: [{ shipping_rate: shippingRate.id }],
            invoice_creation: {
                enabled: true,
            },
            success_url: 'http://localhost:5173/orderhistory',
            cancel_url: 'http://localhost:5173/cart',
        });
        res.send({ url: session.url });
    } catch (error) {
        console.log('Cannot check-out', error);
    }
});

const getCartItems = async (line_items, object, metadata) => {
    return new Promise((resolve, reject) => {
        let cartItems = [];
        let order = {
            iduser: parseInt(metadata.idUser),
            cartItems,
            amount_subtotal: object.amount_subtotal,
            shipping: object.total_details.amount_shipping,
            discount: object.total_details.amount_discount,
            amount_total: object.amount_total,
            method: 'Thẻ tín dụng',
            note: metadata.note,
            invoice: metadata.invoice,
            name: metadata.name,
            address: metadata.address,
            phoneNumber: metadata.phoneNumber,
        };
        line_items?.data?.map(async (element) => {
            const product = await stripe.products.retrieve(element.price.product);
            const id = parseInt(product.metadata.productId);

            cartItems.push({
                productId: id,
                name: product.name,
                image: product.images[0],
                price: element.price.unit_amount,
                quantity: element.quantity,
                total: element.price.unit_amount * element.quantity,
            });

            if (cartItems.length === line_items?.data.length) {
                resolve(order);
            }
        });
    });
};

const endpointSecret = 'whsec_552c5c038fb79b6ce04ee2655ed10451defd99c0c1195f27953833dbb4d1d032';

app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
    try {
        const event = request.body;

        switch (event.type) {
            case 'checkout.session.completed':
                const line_items = await stripe.checkout.sessions.listLineItems(event.data.object.id);
                const iduser = await stripe.customers.retrieve(event.data.object.customer);
                const orderItems = await getCartItems(line_items, event.data.object, iduser.metadata);

                let listProductQuantity = [];
                orderItems.cartItems.map((element) => {
                    listProductQuantity.push({
                        productId: element.productId,
                        quantity: element.quantity,
                    })
                })

                await axios
                    .post('http://localhost:5000/buyzzle/order', { order: orderItems })
                    .then(() => {
                        orderItems.cartItems.map((e) => {
                            return axios.post(`http://localhost:5000/buyzzle/cart/removeOnStripe/${e.productId}`, {
                                userId: parseInt(iduser.metadata.idUser),
                                productId: e.productId,
                            });
                        });
                    })
                    .then(() => {
                        axios.post(`http://localhost:5000/buyzzle/order/quantityCreateOrder`, listProductQuantity);
                    })
                    .then(() => {
                        if (parseInt(iduser.metadata.voucherId) != 0) {
                            axios.post(`http://localhost:5000/buyzzle/voucher/usevoucher`, {
                                userId: parseInt(iduser.metadata.idUser),
                                voucherId: parseInt(iduser.metadata.voucherId),
                            });
                        }
                    })
                    .catch((err) => { });
                break;
        }
        response.json({ received: true });
    } catch (error) {
        console.log(error);
    }
});

module.exports = app;
