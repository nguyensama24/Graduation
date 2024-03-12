const ProductController = require('../controller/ProductController');
const MiddleWareRatingController = require('../middleware/MiddleWareRatingController');
const MiddleWareController = require('../middleware/MiddleWareController');

const MiddleWareProductController = require('../middleware/MiddleWareProductController');

const router = require('express').Router();

// thêm sản phẩm
router.post('/addImagesByProductsID', ProductController.addImagesByProductsID);

router.post('/addproduct', MiddleWareProductController.isValidate, ProductController.addProduct);

router.post('/deleteproduct', ProductController.deleteProduct);

router.put('/updateproduct/:id', MiddleWareProductController.isValidate, ProductController.updateProduct);

router.get('/chitietproduct/:id', ProductController.getProductDetail);

router.get('/allproducts', ProductController.getAllProduct);

router.post('/addimagesbyproductid', ProductController.addImagesByProductsID);

router.put('/updateimagesbyproductid/:id', ProductController.updateImageByProductID);

router.delete('/deleteimagesbyproductid/:id', ProductController.deleteImageByProductID);

router.put('/updateimagesbyproductid/:id', ProductController.updateImageByProductID);

router.get('/recommendedproducts/:id', ProductController.getSugggestProduct);

router.get('/getnewproducts', ProductController.getNewProducts);

router.get('/allproducts/availability', ProductController.getProductAvailability);
router.get('/allproducts/soldout', ProductController.getProductSoldOut);

//rating
router.post('/rating', ProductController.addProductRating);
router.get('/ratingcomment/:productId', ProductController.getAllRatingandComment);
router.put('/updateratingcomment/:ratingId', ProductController.updateRatingandComment);
router.delete('/deleteratingcomment/:ratingId', ProductController.deleteRatingandComment);

router.post('/addimagecomment', ProductController.addImageComment);

router.put('/updateimagecomment/:id', ProductController.updateImageComment);

router.put('/repComment', ProductController.RepComment);

// thêm danh mục

router.post('/addcategory', ProductController.addCategory);
router.delete('/deletecategory/:id', ProductController.deleteCategory);
router.put('/updatecategory/:id', ProductController.updateCategory);
router.get('/allcategory', ProductController.getAllCategory);
// SUGGEST sản phẩm theo giới tính
router.post('/getproductbysex', ProductController.suggestProductBySex);

module.exports = router;
