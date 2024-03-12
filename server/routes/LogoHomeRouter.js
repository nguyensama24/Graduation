const LogoHomeController = require('../controller/LogoHomeController');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/// router logo
router.post('/addlogohome', LogoHomeController.AddLogo);
router.delete('/deletelogohome/:id', LogoHomeController.DeleteLogo);
router.put('/updatelogohome/:id', LogoHomeController.UpdateLogo);
router.get('/alllogohome', LogoHomeController.getAllLogo);



module.exports = router;
