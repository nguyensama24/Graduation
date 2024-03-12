const LogoHome1Controller = require('../controller/LogoHome1Controller');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/// router logo
router.post('/addlogohome1', LogoHome1Controller.AddLogo);
router.delete('/deletelogohome1/:id', LogoHome1Controller.DeleteLogo);
router.put('/updatelogohome1/:id', LogoHome1Controller.UpdateLogo);
router.get('/alllogohome1', LogoHome1Controller.getAllLogo);



module.exports = router;
