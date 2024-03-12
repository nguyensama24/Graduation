const express = require('express');
const app = express();
const OrderController = require('../controller/OrderController');

app.post('/', OrderController.createOrder);
app.post('/userOrder', OrderController.getOrderUser);
app.get('/:id', OrderController.getOrderDetails);
app.get('/admin/listOrder', OrderController.getOrderAdmin);
app.put('/:id', OrderController.isRatingAt);

// update quantity product
app.post('/quantityCreateOrder', OrderController.quantityCreateOrder);
app.post('/quantityCancelOrder', OrderController.quantityCancelOrder);
app.post('/updateSoldcount', OrderController.updateSoldcount);

// update quantity cart
app.post('/updateQuantityCart', OrderController.updateQuantityItemcarts);
module.exports = app;
