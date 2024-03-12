const AdminShippingController = require('../controller/AdminShippingController');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/register', AdminShippingController.registerShipping);

router.post('/login', AdminShippingController.login);

router.delete('/delete/:id', AdminShippingController.deleteShipping);

router.post('/allshipping', AdminShippingController.getAllShipping);

router.put('/shippingprofile/:username', AdminShippingController.ShippingProfile);

router.get('/getShipping/:username', AdminShippingController.getShipping);

router.post('/addimageshipping', AdminShippingController.addImageShipping);
router.put('/updateimageshipping/:idshipping', AdminShippingController.updateImageShipping);

router.post('/changepassword/:id', AdminShippingController.ChangePassword);

// router.post('/logout', AdminShippingController.logout);

module.exports = router;
