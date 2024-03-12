const ShippingController = require('../controller/ShippingController');
const router = require('express').Router();

router.post('/setStatus', ShippingController.setStatus);
router.post('/', ShippingController.getAllStatusForDelivery);
router.post('/manager', ShippingController.getAllStatusForAdmin);
router.post('/delete', ShippingController.requestDeleteOrder);
router.post('/confirmdelete', ShippingController.confirmDeleteOrder);

// Notification
router.get('/notificationadmin', ShippingController.getNotificationAdmin);
router.get('/notificationdelivery', ShippingController.getNotificationForDelivery)
router.get('/notificationforuser', ShippingController.getNotificationForUser)
router.post('/filter', ShippingController.filterWithStatusNotification);

// Đánh dấu đã đọc tất cả
router.put('/markasread', ShippingController.isMarkAsRead);

router.put('/markasreaduser', ShippingController.isMarkAsReadUser);
router.put('/markasreadadmin', ShippingController.isMarkAsReadAdmin);
router.put('/markasreaddelivery', ShippingController.isMarkAsReadDelivery);
        
module.exports = router;
