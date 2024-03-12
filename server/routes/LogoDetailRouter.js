const LogoDetailController = require('../controller/LogoDetailController');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/// router logo
router.post('/addlogodetail', LogoDetailController.AddLogoDetail);
router.delete('/deletelogodetail/:id', LogoDetailController.DeleteLogoDetail);
router.put('/updatelogodetail/:id', LogoDetailController.UpdateLogoDetail);
router.get('/alllogodetail', LogoDetailController.getAllLogoDetail);



module.exports = router;
