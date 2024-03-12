const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const BannerHomeController = {
/////////// CRUD BANNER
AddBannerHome: async (req, res) => {
  try {
    const { image, linkgoogle } = req.body;

    const createdbanner = await prisma.imageBannerHome.create({
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

DeleteBannerHome: async (req, res) => {
  try {
    const  id  = parseInt(req.params.id);
    

    const deletedbanner = await prisma.imageBannerHome.delete({
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

UpdateBannerHome: async (req, res) => {
  try {
    const { id } = req.params;
    const { image, linkgoogle } = req.body;

    const updatedbanner = await prisma.imageBannerHome.update({
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

getAllBannerHome : async (req , res)=> {
    try {
        const allBanner = await prisma.imageBannerHome.findMany();
  
        res.status(200).json( allBanner );
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
    },



  };
  
  module.exports = BannerHomeController;