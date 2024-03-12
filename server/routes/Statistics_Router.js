const StatisticsController = require('../controller/Statistics_Controller');
const router = require('express').Router();

router.post('/', StatisticsController.getStatictics);

module.exports = router;
