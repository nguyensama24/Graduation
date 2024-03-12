const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const ChatController = {
  // Gửi tin nhắn từ admin hoặc user
  sendMessage : async (req, res) => {
    try {
      const { senderId, receiverId, content } = req.body;
  
      // Tạo một tin nhắn mới trong cơ sở dữ liệu
      const message = await prisma.message.create({
        data: {
          content,
          sender: {
            connect: { id: senderId },
          },
          receiver: {
            connect: { id: receiverId },
          },
        },
      });
  
      // Gửi tin nhắn cho người dùng thông qua Socket.io
      io.emit('receive message', message);
  
      res.status(201).json({ message: 'Tin nhắn đã được gửi.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Lỗi trong quá trình gửi tin nhắn.' });
        }
    },
};

module.exports = ChatController;
