const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const multer = require('multer');
const path = require('path');
const LoggerHelper = require('../Utils/LoggerHelper');
const some = new LoggerHelper();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image'); // Thư mục lưu trữ ảnh
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận tệp ảnh có định dạng .jpg, .jpeg, hoặc .png'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: {
    //   fileSize: 1024 * 1024 * 5,
    // },
});

const ProductController = {
    //thêm danh mục
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const { image } = req.body;

            const categoryCount = await prisma.category.count({
                where: {
                    deletedAt: null,
                },
            });
            if (categoryCount >= 6) {
                return res.status(400).json('du 6 danh muc');
            }

            // Tạo danh mục mới
            const newCategory = await prisma.category.create({
                data: {
                    name,
                    image,
                },
            });

            res.status(200).json('Thêm danh mục thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    // xóa danh mục
    deleteCategory: async (req, res) => {
        try {
            const categoryId = parseInt(req.params.id);
            const existingCategory = await prisma.category.findFirst({
                where: {
                    id: categoryId,
                },
            });
            if (existingCategory) {
                await prisma.category.update({
                    where: {
                        id: categoryId,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });
                return res.status(200).json('Xóa danh mục thành công');
            }
            return res.status(404).json('Danh mục không tồn tại');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    // cập nhật danh mục
    updateCategory: async (req, res) => {
        try {
            const categoryId = parseInt(req.params.id);
            const name = req.body.name;
            const image = req.body.image;

            // Kiểm tra xem danh mục tồn tại hay không
            const existingCategory = await prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            });
            if (!existingCategory) {
                return res.status(404).json('Danh mục không tồn tại');
            }
            // Cập nhật thông tin của danh mục
            const updatedCategory = await prisma.category.update({
                where: {
                    id: categoryId,
                },
                data: {
                    name,
                    image,
                },
            });

            res.status(200).json('Cập nhật danh mục thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    // get all data category
    getAllCategory: async (req, res) => {
        try {
            const keyword = req.query.keyword;
            const whereClause = {
                deletedAt: null,
            };
            const AllCategory = await prisma.category.findMany({
                where: {
                    AND: [
                        whereClause,
                        {
                            name: {
                                contains: keyword,
                            },
                        },
                    ],
                },
            });
            res.status(200).json(AllCategory);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },
    // thêm sản phẩm

    addImagesByProductsID: async (req, res) => {
        try {
            const { url, idproduct } = req.body;
            console.log(req.body);
            const newImages = {
                url,
                idproduct: parseInt(idproduct),
            };

            const data = await prisma.productImage.create({
                data: newImages,
            });
            res.status(200).json('Thêm hinh thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    updateImageByProductID: async (req, res) => {
        try {
            const { id } = req.params;
            const { url, idproduct } = req.body;

            const existingImage = await prisma.productImage.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (!existingImage) {
                return res.status(404).json('Hình ảnh không tồn tại');
            }

            const updatedImage = await prisma.productImage.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    url,
                    idproduct: parseInt(idproduct),
                },
            });

            res.status(200).json('Cập nhật hình ảnh thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    deleteImageByProductID: async (req, res) => {
        const productID = parseInt(req.params.id);
        try {
            const imagesToDelete = await prisma.productImage.findMany({
                where: {
                    id: productID,
                },
            });

            if (!imagesToDelete || imagesToDelete.length === 0) {
                return res.status(404).json('Không có hình ảnh nào để xóa');
            }

            for (const image of imagesToDelete) {
                await prisma.productImage.delete({
                    where: {
                        id: image.id,
                    },
                });
            }
            res.status(200).json('Xóa hình ảnh thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    addProduct: async (req, res) => {
        try {
            const { name, price, rate, discount, quantity, description, status, categoryID, subcategoriesID } =
                req.body;

            const SellingPrice = price - price * (discount / 100);
            const Pricesale = price * (discount / 100);

            const newProduct = {
                name,
                price: parseInt(price),
                rate: parseInt(rate),
                pricesale: Pricesale,
                sellingPrice: SellingPrice,
                discount: parseInt(discount),
                soldcount: 0,
                quantity: parseInt(quantity),
                description,
                status,
                date: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                // productId: parseInt(productId),
                categoryID: parseInt(categoryID),
                subcateId: parseInt(subcategoriesID),
            };

            const neww = await prisma.product.create({
                data: newProduct,
            });

            console.log(neww);
            // res.status(200).json("Thêm sản phẩm thành công");
            res.status(200).json(neww);
            // });
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    // xóa sản phẩm
    deleteProduct: async (req, res) => {
        try {
            const id = parseInt(req.body.id);
            const page = parseInt(req.body.page) || 1;
            const pageSize = parseInt(req.body.pageSize) || 40;
            let skip = (page - 1) * pageSize;
            const productToDelete = await prisma.product.findFirst({
                where: {
                    id: id,
                },
            });

            some.info(`[ProductToDelete] `, `Id: ${req.params.id}`);
            if (productToDelete) {
                await prisma.product.update({
                    where: {
                        id: id,
                    },
                    data: {
                        deletedAt: new Date(),
                    },
                });
                const whereClause = {
                    deletedAt: null,
                };
                const totalProduct = await prisma.product.count({
                    where: whereClause,
                });
                const result = await prisma.product.findMany({
                    orderBy: {
                        soldcount: 'desc',
                    },
                    include: {
                        ProductImage: true,
                        fK_category: true,
                        Rating: true,
                    },
                    where: whereClause,
                    skip,
                    take: pageSize,
                });
                const resultProduct = {
                    currentPage: page,
                    totalPage: Math.ceil(totalProduct / pageSize),
                    rows: result,
                };
                return res.status(200).json(resultProduct);
            }

            return res.status(402).json('San pham khong ton tai');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    //cập nhật sản phẩm
    updateProduct: async (req, res) => {
        try {
            const productid = parseInt(req.params.id);

            const {
                name,
                price,
                // rate,
                discount,
                // soldcount,
                quantity,
                description,
                // status,
                categoryID,
                subcateId,
            } = req.body;

            const SellingPrice = price - price * (discount / 100);
            const Pricesale = price * (discount / 100);

            // Tạo dữ liệu mới để cập nhật
            const updatedProductData = {
                name,
                price: parseInt(price),
                // rate: parseInt(rate),
                pricesale: Pricesale,
                sellingPrice: SellingPrice,
                discount: parseInt(discount),
                // soldcount: parseInt(soldcount),
                quantity: parseInt(quantity),
                description,
                // status,
                date: new Date(),
                // createdAt: new Date(),
                updatedAt: new Date(),
                categoryID: parseInt(categoryID),
                subcateId: parseInt(subcateId),
            };

            const updatedProduct = await prisma.product.update({
                where: {
                    id: productid,
                },
                data: {
                    ...updatedProductData,
                    categoryID: parseInt(categoryID),
                    subcateId: parseInt(subcateId),
                },
            });

            // res.status(200).json("Cập nhật sản phẩm thành công");
            console.log(updatedProduct);
            res.status(200).json(updatedProduct);
            // });
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    // Xem chi tiết sản phẩm
    getProductDetail: async (req, res) => {
        try {
            const productId = parseInt(req.params.id);
            const productDetail = await prisma.product.findFirst({
                include: {
                    ProductImage: true,
                    fK_category: true,
                },
                where: {
                    id: productId,
                },
            });
            if (!productDetail) {
                return res.status(404).json('Không tìm thấy sản phẩm');
            }

            const ratings = await prisma.rating.findMany({
                where: {
                    idproduct: productId,
                },
                include: {
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    product: {
                        select: {
                            quantity: true,
                        },
                    },
                },
            });
            const totalRating = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
            const averageRating = totalRating / ratings.length;
            const resultProduct = {
                averageRating: averageRating,
                Rating: ratings,
                productDetail: productDetail,
            };
            res.status(200).json(resultProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    getAllProduct: async (req, res) => {
        try {
            // tìm kiếm = keyword
            const keyword = req.query.keyword;
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 40;
            const sortByPrice = req.query.sortByPrice;
            const sortByDateCreate = req.query.sortByDateCreate;
            const categoryId = req.query.categoryId;
            const categoryName = req.query.categoryName;
            const rating = req.query.rating;
            const discount = 60;
            const productid = parseInt(req.params.id);
            const availabilityType = req.query.availabilityType; // Thêm tham số availabilityType
            const sortBySoldCount = req.query.sortBySoldCount;

            const FlashsaleProducts = await prisma.product.findMany({
                where: {
                    discount: {
                        gt: discount,
                    },
                },
                take: 3,
            });

            let skip = (page - 1) * pageSize;
            if (keyword) {
                skip = 0;
            }
            const whereClause = {
                name: {
                    contains: keyword,
                },
                deletedAt: null,
            };

            if (categoryId) {
                whereClause.fK_category = {
                    id: parseInt(categoryId),
                };
            }
            if (categoryName) {
                whereClause.fK_category = {
                    name: categoryName,
                };
            }

            if (rating) {
                whereClause.rate = {
                    gte: parseInt(rating),
                };
            }

            if (req.query.minPrice && req.query.maxPrice) {
                whereClause.sellingPrice = {
                    gte: parseInt(req.query.minPrice),
                    lte: parseInt(req.query.maxPrice),
                };
            }

            if (req.query.minQuantity && req.query.maxQuantity) {
                whereClause.quantity = {
                    gte: parseInt(req.query.minQuantity),
                    lte: parseInt(req.query.maxQuantity),
                };
            }
            if (req.query.minPurchase && req.query.maxPurchase) {
                whereClause.soldcount = {
                    gte: parseInt(req.query.minPurchase),
                    lte: parseInt(req.query.maxPurchase),
                };
            }
            const totalProduct = await prisma.product.count({
                where: whereClause,
            });
            const ratings = await prisma.rating.findMany({
                include: {
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    product: {
                        select: {
                            quantity: true,
                        },
                    },
                },
            });
            const top8products = await prisma.product.findMany({
                take: 8,
                orderBy: {
                    soldcount: 'desc',
                },
            });
            const result = await prisma.product.findMany({
                orderBy: [
                    { sellingPrice: sortByPrice },
                    { createdAt: sortByDateCreate },
                    { soldcount: sortBySoldCount },
                ],
                include: {
                    ProductImage: true,
                    fK_category: true,
                    Rating: true,
                },
                where: whereClause,
                skip,
                take: pageSize,
            });

            result.forEach(async (product) => {
                const totalRating = product.Rating.reduce((sum, rating) => sum + rating.ratingValue, 0);
                const averageRating = totalRating / product.Rating.length;

                const productId = product.id;

                if (productId) {
                    await prisma.product.update({
                        where: {
                            id: productId,
                        },
                        data: {
                            rate: averageRating,
                        },
                    });
                } else {
                    console.error('k co id');
                }
            });

            if (availabilityType === 'inStock') {
                const inStockProducts = await prisma.product.findMany({
                    where: {
                        soldcount: { lt: 5 },
                        quantity: { gt: 0 },
                    },
                    include: {
                        ProductImage: true,
                        fK_category: true,
                        Rating: true,
                    },
                });
                // Trả về sản phẩm còn hàng
                res.status(200).json({
                    rows: inStockProducts,
                });
            } else if (availabilityType === 'soldOut') {
                const outOfStockProducts = await prisma.product.findMany({
                    where: {
                        soldcount: { gte: 100 },
                        quantity: { lte: 5 },
                    },
                    include: {
                        ProductImage: true,
                        fK_category: true,
                        Rating: true,
                    },
                });
                // Trả về sản phẩm hết hàng
                res.status(200).json({
                    rows: outOfStockProducts,
                });
            } else if (availabilityType === 'soldCount') {
                const soldCountProducts = await prisma.product.findMany({
                    orderBy: [{ soldcount: 'desc' }],
                    include: {
                        ProductImage: true,
                        fK_category: true,
                        Rating: true,
                    },
                    where: whereClause,
                    skip,
                    take: pageSize,
                });

                res.status(200).json({
                    rows: soldCountProducts,
                });
            } else {
                const resultProduct = {
                    FlashsaleProducts: FlashsaleProducts,
                    currentPage: page,
                    totalPage: Math.ceil(totalProduct / pageSize),
                    rows: result,
                    Rating: ratings,
                    top8products: top8products,
                };
                res.status(200).json(resultProduct);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },
    getProductAvailability: async (req, res) => {
        try {
            const inStockProducts = await prisma.product.findMany({
                where: {
                    soldcount: { lt: 5 }, // soldCount nho hon 5 va dong thoi quantity phai lon hon 0 => san pham con hang
                    quantity: { gt: 0 },
                },
                include: {
                    ProductImage: true,
                    fK_category: true,
                    Rating: true,
                },
            });
            res.status(200).json({
                rows: inStockProducts,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi khi lấy sản phẩm còn hàng.' });
        }
    },
    getProductSoldOut: async (req, res) => {
        try {
            const outOfStockProducts = await prisma.product.findMany({
                where: {
                    soldcount: { gte: 100 }, // soldCount lon hon 0 va dong thoi quantity phai nho hon 5 => san pham con hang
                    quantity: { lte: 5 },
                },
                include: {
                    ProductImage: true,
                    fK_category: true,
                    Rating: true,
                },
            });
            res.json({
                rows: outOfStockProducts,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi khi lấy sản phẩm hết hàng.' });
        }
    },
    getSugggestProduct: async (req, res) => {
        try {
            const productId = parseInt(req.params.id);

            const newProduct = await prisma.product.findUnique({
                where: {
                    id: productId,
                },
            });
            if (!newProduct) {
                return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
            }
            const categoryId = newProduct.categoryID;

            const recommendedProducts = await prisma.product.findMany({
                include: {
                    ProductImage: true,
                    Rating: true,
                },
                where: {
                    id: {
                        not: productId,
                    },
                    categoryID: categoryId,
                },
                take: 10,
            });
            recommendedProducts.map((item) => {
                const totalRating = item.Rating.reduce((sum, rating) => sum + rating.ratingValue, 0);
                const averageRating = totalRating / item.Rating.length;
                item.rate = averageRating;
            });
            res.json(recommendedProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    getNewProducts: async (req, res) => {
        try {
            const newProducts = await prisma.product.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                take: 5,
            });
            res.json(newProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    addProductRating: async (req, res) => {
        try {
            const userId = parseInt(req.cookies.id);
            const { idproduct, ratingValue, comment } = req.body;
            const rating = await prisma.rating.create({
                data: {
                    idproduct,
                    iduser: userId,
                    ratingValue,
                    comment,
                },
            });

            res.status(200).json(rating);
        } catch (error) {
            console.error(error);
            res.status(200).json('Đánh giá sản phẩm không thành công');
        }
    },

    getAllRatingandComment: async (req, res) => {
        try {
            const productId = parseInt(req.params.productId);
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 2;
            const selectedRatingValue = parseInt(req.query.selectedRatingValue) || 1;

            const ratings = await prisma.rating.findMany({
                where: {
                    idproduct: productId,
                    ratingValue: {
                        gte: selectedRatingValue, // Sử dụng lọc "greater than or equal to" (lớn hơn hoặc bằng)
                    },
                },
                orderBy: {
                    id: 'desc',
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            UserImage: {
                                select: {
                                    url: true,
                                },
                            },
                        },
                    },
                    product: {
                        select: {
                            quantity: true,
                        },
                    },
                    CommentImage: {
                        select: {
                            url: true,
                        },
                    },
                    admin: {
                        select: {
                            name: true,
                            AdminImage: {
                                select: {
                                    url: true,
                                },
                            },
                        },
                    },
                },
                skip: (page - 1) * perPage,
                take: perPage,
            });

            if (ratings.length === 0) {
                return res.status(200).json(0);
            }
            // Lấy số lượng tổng cộng của đánh giá cho sản phẩm
            const totalRatings = await prisma.rating.count({
                where: {
                    idproduct: productId,
                    ratingValue: {
                        gte: selectedRatingValue, // Sử dụng lọc "greater than or equal to" (lớn hơn hoặc bằng)
                    },
                },
            });
            const totalRating = ratings.reduce((sum, rating) => sum + rating.ratingValue, 0);
            const averageRating = totalRating / totalRatings;

            const resultProduct = {
                currentPage: page,
                perPage: perPage,
                totalRatings: Math.ceil(totalRatings / perPage),
                averageRating: averageRating,
                Rating: ratings,
            };

            res.status(200).json(resultProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    updateRatingandComment: async (req, res) => {
        try {
            const userId = parseInt(req.cookies.id);
            const ratingId = parseInt(req.params.ratingId);
            const { ratingValue, comment } = req.body;

            // Kiểm tra xem đánh giá có tồn tại không
            const existingRating = await prisma.rating.findUnique({
                where: {
                    id: ratingId,
                },
            });

            if (!existingRating) {
                return res.status(404).json('Đánh giá không tồn tại');
            }

            // Kiểm tra xem người dùng hiện tại có quyền cập nhật đánh giá hay không
            if (existingRating.iduser !== userId) {
                return res.status(403).json('Bạn không có quyền cập nhật đánh giá này');
            }

            // Thực hiện cập nhật đánh giá
            const updatedRating = await prisma.rating.update({
                where: {
                    id: ratingId,
                },
                data: {
                    ratingValue,
                    comment,
                },
            });

            res.status(200).json(updatedRating);
        } catch (error) {
            console.error(error);
            res.status(500).json('Cập nhật đánh giá sản phẩm không thành công');
        }
    },

    deleteRatingandComment: async (req, res) => {
        try {
            const userId = parseInt(req.cookies.id);
            const { ratingId } = req.params;

            const existingRating = await prisma.rating.findUnique({
                where: {
                    id: parseInt(ratingId),
                },
            });

            if (!existingRating) {
                return res.status(404).json('Đánh giá không tồn tại');
            }

            if (existingRating.iduser !== userId) {
                return res.status(403).json('Bạn không có quyền xóa đánh giá này');
            }

            await prisma.rating.delete({
                where: {
                    id: parseInt(ratingId),
                },
            });

            res.status(200).json('Xóa đánh giá thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json('Lỗi khi xóa đánh giá');
        }
    },

    addImageComment: async (req, res) => {
        try {
            const { url, idcomment } = req.body;

            const newImageComment = {
                url,
                idcomment: parseInt(idcomment),
            };

            const data = await prisma.commentImage.create({
                data: newImageComment,
            });
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    deleteImageComment: async (req, res) => {
        const ratingID = parseInt(req.params.id);
        try {
            const imagesToDelete = await prisma.commentImage.findMany({
                where: {
                    id: ratingID,
                },
            });

            if (!imagesToDelete || imagesToDelete.length === 0) {
                return res.status(404).json('Không có hình ảnh nào để xóa');
            }

            for (const image of imagesToDelete) {
                await prisma.commentImage.delete({
                    where: {
                        id: image.id,
                    },
                });
            }
            res.status(200).json('Xóa hình ảnh thành công');
        } catch (error) {
            console.error(error);
            res.status(500).json(error.message);
        }
    },

    updateImageComment: async (req, res) => {
        try {
            const { id } = req.params;
            const { url, idcomment } = req.body;

            const updateImageComment = await prisma.commentImage.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    url,
                    idcomment: parseInt(idcomment),
                },
            });
            res.status(200).json(updateImageComment);
        } catch (error) {
            res.status(500).json(error.message);
        }
    },

    RepComment: async (req, res) => {
        try {
            const ratingId = parseInt(req.body.ratingId);
            const page = parseInt(req.body.page) || 1;
            const perPage = parseInt(req.body.perPage) || 40;
            const { repComment } = req.body;

            const allAdmins = await prisma.admin.findMany();

            if (!allAdmins || allAdmins.length === 0) {
                return res.status(404).json('Không có tài khoản admin nào tồn tại');
            }

            // Chọn một tài khoản admin bất kỳ (ở đây chọn tài khoản đầu tiên)
            const randomAdmin = allAdmins[0];

            const existingRating = await prisma.rating.findUnique({
                where: {
                    id: ratingId,
                },
            });

            if (!existingRating) {
                return res.status(404).json('Đánh giá không tồn tại');
            }

            const updatedRating = await prisma.rating.update({
                where: {
                    id: ratingId,
                },
                data: {
                    repComment,
                    adminId: randomAdmin.id,
                },
            });
            const ratings = await prisma.rating.findMany({
                include: {
                    user: {
                        select: {
                            username: true,
                        },
                    },
                    product: {
                        select: {
                            quantity: true,
                        },
                    },
                    CommentImage: {
                        select: {
                            url: true,
                        },
                    },
                    admin: {
                        select: {
                            name: true,
                            AdminImage: {
                                select: {
                                    url: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    id: 'desc',
                },
                skip: (page - 1) * perPage,
                take: perPage,
            });

            const resultProduct = {
                perPage: perPage,
                page: page,
                updatedRating: updatedRating,
                Ratings: ratings,
            };
            res.status(200).json(resultProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json('Cập nhật phản hồi đánh giá không thành công. Lỗi: ' + error.message);
        }
    },
    // GỢI Ý SẢN PHẨM THEO GIỚI TÍNH
    // GỢI Ý SẢN PHẨM THEO GIỚI TÍNH
    suggestProductBySex: async (req, res) => {
        try {
            const page = parseInt(req.body.page) || 1;
            const pageSize = parseInt(req.body.pageSize) || 40;
            const idUser = parseInt(req.cookies.id);

            const whereClause = {
                deletedAt: null,
            };

            const product = await prisma.product.findMany({
                where: whereClause,
                include: {
                    ProductImage: true,
                },
            });

            const productsWithMale = product.filter((product) => product.name.toLowerCase().includes('nam'));
            const productsWithFemale = product.filter((product) => product.name.toLowerCase().includes('nữ'));
            const productsWithoutSex = product.filter(
                (product) => !product.name.toLowerCase().includes('nam') && !product.name.toLowerCase().includes('nữ')
            );

            const mergedProductsMale = productsWithMale.concat(productsWithoutSex);
            const mergedProductsFemale = productsWithFemale.concat(productsWithoutSex);
            const mergedProductsWithoutSex = productsWithoutSex.concat(productsWithFemale, productsWithMale);

            const paginateArray = (array, pageSize, page) => {
                const startIndex = (page - 1) * pageSize;
                const endIndex = page * pageSize;
                return array.slice(startIndex, endIndex);
            };

            let paginatedProducts;
            let user = null;
            if (idUser) {
                user = await prisma.user.findFirst({
                    where: {
                        id: idUser,
                    },
                });
            } else {
                const paginatedWithoutSexProducts = paginateArray(mergedProductsWithoutSex, pageSize, page);
                paginatedProducts = {
                    mergedProducts: paginatedWithoutSexProducts,
                    page,
                    pageSize,
                    totalPages: Math.ceil(mergedProductsWithoutSex.length / pageSize),
                };
            }
            if (user && user.sex == 0) {
                const paginatedFemaleProducts = paginateArray(mergedProductsFemale, pageSize, page);
                paginatedProducts = {
                    mergedProducts: paginatedFemaleProducts,
                    page,
                    pageSize,
                    totalPages: Math.ceil(mergedProductsFemale.length / pageSize),
                };
            } else if (user && user.sex == 1) {
                const paginatedMaleProducts = paginateArray(mergedProductsMale, pageSize, page);
                paginatedProducts = {
                    mergedProducts: paginatedMaleProducts,
                    page,
                    pageSize,
                    totalPages: Math.ceil(mergedProductsMale.length / pageSize),
                };
            } else {
                const paginatedWithoutSexProducts = paginateArray(mergedProductsWithoutSex, pageSize, page);
                paginatedProducts = {
                    mergedProducts: paginatedWithoutSexProducts,
                    page,
                    pageSize,
                    totalPages: Math.ceil(mergedProductsWithoutSex.length / pageSize),
                };
            }
            return res.status(200).json(paginatedProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json('Something when wrong ' + error.message);
        }
    },
};

module.exports = ProductController;
