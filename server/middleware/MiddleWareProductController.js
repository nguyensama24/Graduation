const isValidate = (req, res, next) => {
    const { name, price, pricesale, discount } = req.body;
  
    if (name.length <= 6) {
      return res.status(400).json("Tên sản phẩm phải có ít nhất 6 kí tự");
    }
    if (parseInt(price) <= 0) {
      return res.status(400).json("Giá sản phẩm phải lớn hơn 0");
    }
    if (parseInt(pricesale) <= 0) {
      return res.status(400).json("Sản phẩm Sale phải lớn hơn 0");
    }
    if (parseInt(discount) <= 0) {
      return res.status(400).json("Giảm giá sản phẩm phải lớn hơn 0");
    }
    next();
  };

  module.exports = {
    isValidate
  };
  