const LogoController = require('../controller/LogoController');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/// router logo
router.post('/addlogo', LogoController.AddLogo);
router.delete('/deletelogo/:id', LogoController.DeleteLogo);
router.put('/updatelogo/:id', LogoController.UpdateLogo);
router.get('/alllogo', LogoController.getAllLogo);



module.exports = router;
