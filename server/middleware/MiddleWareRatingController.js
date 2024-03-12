const isAuthenticated = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json("Bạn phải đăng nhập để thực hiện thao tác này");
    }
    next();
  };
  
  const isAuthor = (req, res, next) => {
    const loggedInUserId = req.user.id;
    const reviewUserId = req.params.userId;
  
    if (loggedInUserId !== reviewUserId) {
      return res.status(403).json("Bạn không có quyền thực hiện thao tác này");
    }
    next();
  };
  
  module.exports = {
    isAuthenticated,
    isAuthor,
  };
  