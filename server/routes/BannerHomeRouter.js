const BannerHomeController = require('../controller/BannerHomeController');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/// router banner
router.post('/addbannerhome', BannerHomeController.AddBannerHome);
router.delete('/deletebannerhome/:id', BannerHomeController.DeleteBannerHome);
router.put('/updatebannerhome/:id', BannerHomeController.UpdateBannerHome);
router.get('/allbannerhome', BannerHomeController.getAllBannerHome);

module.exports = router;
