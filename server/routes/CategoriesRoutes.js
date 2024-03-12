const CategoriesController = require("../controller/CategoriesController");
const router = require("express").Router();

router.post("/", CategoriesController.addSubcategoriesLv1)
router.get("/", CategoriesController.getSubCategories)
router.get("/:id", CategoriesController.getProductFromSubcategories)
router.delete("/:id",CategoriesController.DeleteSubcategories)
router.put("/:id", CategoriesController.updateSubCategories)


module.exports = router;
