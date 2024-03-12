const ChatController = require('../controller/ChatController');
const router = require('express').Router();

// Định nghĩa API endpoint để gửi tin nhắn
router.post('/sendmessage', ChatController.sendMessage);

module.exports = router;
