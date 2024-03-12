const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const LogoHome1Controller = {
    AddLogo: async (req, res) => {
      try {
        const { image, linkgoogle } = req.body;
  
        const createdLogo = await prisma.imageLogoHome1.create({
          data: {
            image,
            linkgoogle,
          },
        });
  
        res.status(201).json(createdLogo);
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
    },
  
    DeleteLogo: async (req, res) => {
      try {
        const  id  = parseInt(req.params.id);
        
  
        const deletedLogo = await prisma.imageLogoHome1.delete({
          where: {
            id: parseInt(id),
          },
        });
  
        res.status(200).json(deletedLogo );
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
    },
  
    UpdateLogo: async (req, res) => {
      try {
        const { id } = req.params;
        const { image } = req.body;
        const { linkgoogle } = req.body;
  
        const updatedLogo = await prisma.imageLogoHome1.update({
          where: {
            id: parseInt(id),
          },
          data: {
            image,
            linkgoogle,
          },
        });
  
        res.status(200).json( updatedLogo );
      } catch (error) {
        console.error( error);
        res.status(500).json(error);
      }
    },
  
    getAllLogo : async (req , res)=> {
        try {
            const allLogos = await prisma.imageLogoHome1.findMany();
      
            res.status(200).json( allLogos );
          } catch (error) {
            console.error(error);
            res.status(500).json(error);
          }
        },
    











  };
  
  module.exports = LogoHome1Controller;