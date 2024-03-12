const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const BannerController = {
/////////// CRUD BANNER
AddBanner: async (req, res) => {
  try {
    const { image, linkgoogle } = req.body;

    const createdbanner = await prisma.imageBanner.create({
      data: {
        image,
        linkgoogle,
      },
    });

    res.status(201).json(createdbanner);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
},

DeleteBanner: async (req, res) => {
  try {
    const  id  = parseInt(req.params.id);
    

    const deletedbanner = await prisma.imageBanner.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json(deletedbanner );
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
},

UpdateBanner: async (req, res) => {
  try {
    const { id } = req.params;
    const { image, linkgoogle } = req.body;

    const updatedbanner = await prisma.imageBanner.update({
      where: {
        id: parseInt(id),
      },
      data: {
        image,
        linkgoogle,
      },
    });

    res.status(200).json( updatedbanner );
  } catch (error) {
    console.error( error);
    res.status(500).json(error);
  }
},

getAllBanner : async (req , res)=> {
    try {
        const allBanner = await prisma.imageBanner.findMany();
  
        res.status(200).json( allBanner );
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
    },



  };
  
  module.exports = BannerController;