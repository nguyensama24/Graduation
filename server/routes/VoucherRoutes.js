const VoucherController = require('../controller/VoucherController');
const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cron = require('node-cron');

//ADMIN
router.post('/', VoucherController.add);
router.post('/getVoucher', VoucherController.getAdmin);
router.delete('/:id', VoucherController.remove);
router.put('/:id', VoucherController.update);

//USER
router.get('/pageUser', VoucherController.getUser); //Get để user lưu

router.get('/getSavedUser', VoucherController.getSavedUser); // Get những voucher user đã lưu

router.get('/savevoucher/:voucherId', VoucherController.SaveVoucher); //User lưu Voucher

router.post('/usevoucher', VoucherController.UseVoucher); // User Sử dụng Voucher

router.get('/VoucherExpired', VoucherController.VoucherExpired);

// router.post('/translate', VoucherController.translate);

module.exports = router;
