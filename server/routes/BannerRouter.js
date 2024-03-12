const BannerController = require('../controller/BannerController');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/// router banner
router.post('/addbanner', BannerController.AddBanner);
router.delete('/deletebanner/:id', BannerController.DeleteBanner);
router.put('/updatebanner/:id', BannerController.UpdateBanner);
router.get('/allbanner', BannerController.getAllBanner);

module.exports = router;
