const CartController = require('../controller/CartController');
const router = require('express').Router();

router.post('/', CartController.addToCart);
router.get('/', CartController.getCart);
// DELETE ITEM
router.delete('/:id', CartController.deleteItem);
router.post('/removeOnStripe/:id', CartController.removeItemcartStripe);
// DELETE all item on cart
router.delete('/', CartController.deleteAllItemOnCart);
// Increase and decrease item on cart
router.put('/increase', CartController.increaseItem);
router.put('/decrease', CartController.decreaseItem);

module.exports = router;
