import useThrottle from "@rooks/use-throttle";
import { Link, useNavigate } from "react-router-dom";
import Buyzzle from "../../../../assets/TSX/Buyzzle";
import Minus from "../../../../assets/TSX/Minus";
import Plus from "../../../../assets/TSX/Plus";
import Container from "../../../../components/container/Container";
import {
  UpdateCart,
  cartControllers,
} from "../../../../controllers/CartControllers";
import { userController } from "../../../../controllers/UserController";
import DialogComfirm from "../../../../helper/Dialog/DialogComfirm";
import EmptyPage from "../../../../helper/Empty/EmptyPage";
import { numberFormat } from "../../../../helper/Format";
import { toastWarn } from "../../../../helper/Toast/Warning";
import { useCart } from "../../../../hooks/Cart/CartContextProvider";
import { CartItem } from "../../../../model/CartModel";
import Back from "../../admin/assets/TSX/Back";
import Delete from "../../admin/assets/TSX/Delete";
export default function Cart() {
  const navigate = useNavigate();

  const {
    carts,
    setCarts,
    setIdProduct,
    idProduct,
    productChecked,
    setProductChecked,
    handleBuyNow,
    openModal,
    closeModal,
    removeItemCart,
    removeAllCart,
    idItemCart,
    idAllCart,
    handleChecked,
  } = useCart();

  const CheckToken = async () => {
    userController.CheckToken().then((res) => {
     
    });
  };
  const CheckRefreshToken = async () => {
    userController.CheckRefreshToken().then((res) => {
   
    });
  };
  const muti = () => {
    CheckToken();
    handleBuyNow();
    CheckRefreshToken();
    
  };

  const handleIncreaseQuantity = (data: UpdateCart) => {
    cartControllers.increaseCart(data).then((res) => {
      setCarts(res.data);
    });
    if (productChecked.length > 0) {
      const indexProduct = productChecked.findIndex(
        (item) => item.productid === data.productId
      );
      const _productChecked = [...productChecked];
      _productChecked[indexProduct].quantity += 1;

      setProductChecked(_productChecked);
    }
  };
  const handleDecreaseQuantity = (quantity: number, data: UpdateCart) => {
    if (quantity > 1) {
      cartControllers.decreaseCart(data).then((res) => {
        setCarts(res.data);
      });

      if (productChecked.length > 0) {
        const indexProduct = productChecked.findIndex(
          (item) => item.productid === data.productId
        );
        const _productChecked = [...productChecked];
        _productChecked[indexProduct].quantity -= 1;

        setProductChecked(_productChecked);
      } else {
        return;
      }
    }
  };

  const [plusThrottled] = useThrottle(handleIncreaseQuantity, 300);
  const [minusThrottled] = useThrottle(handleDecreaseQuantity, 300);

  const cartLength = carts.item?.filter((e) => e.product.quantity > 0);
  var checkAll: boolean =
    cartLength?.length > 0
      ? !!carts.item?.length && productChecked?.length === cartLength?.length
      : false;

  const handleCheckedAll = (checked: boolean) => {
    if (checked) {
      if (carts.item) {
        const _data = cartLength;
        setProductChecked(_data);
      }
    } else {
      setProductChecked([]);
    }
  };
  const calculatePrice = () => {
    let totalCart = 0;
    let sale = 0;
    for (let i = 0; i < productChecked.length; i++) {
      const element = productChecked[i];
      totalCart += element.quantity * element.product.sellingPrice;
      sale +=
        element.quantity *
        (element.product.price - element.product.sellingPrice);
    }

    return {
      sale,
      totalCart,
    };
  };
  const checked = (item: CartItem) => {
    const _check = productChecked.findIndex(
      (el) => el.productid == item.productid
    );
    return _check !== -1;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container>
      <div>
        {/* back */}
        <div className="back h-[57px] mt-[46px] ">
          <div className="flex gap-3 items-center">
            <button onClick={handleGoBack}>
              <div className="border-[1px] border-[#EA4B48] rounded-md py-4 px-4 max-xl:p-3 max-lg:p-2">
                <Back />
              </div>
            </button>
            <div>
              <p className="font-normal text-sm max-xl:text-xs max-lg:text-[10px]">
                Quay lại
              </p>
              <h2 className="uppercase text-[32px] font-bold max-xl:text-[28px] max-lg:text-2xl">
                Giỏ Hàng
              </h2>
            </div>
          </div>
        </div>
        {/* end back */}
        <div
          className="bg-white py-7 mt-[50px] rounded-md items-center
                shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]
                grid grid-cols-12"
        >
          <div className="col-span-1 text-center leading-none	">
            <input
              checked={checkAll}
              type="checkbox"
              className="checkbox checkbox-sm items-center"
              onChange={(element) => handleCheckedAll(element.target.checked)}
            />
          </div>
          <div className="col-span-4">
            <p className="text-[#1A1A1A] text-base font-medium">Sản Phẩm</p>
          </div>
          <div className="col-span-2 flex justify-center">
            <p className="text-[#1A1A1A] text-base font-medium">Đơn giá</p>
          </div>
          <div className="col-span-2 flex justify-center">
            <p className="text-[#1A1A1A] text-base font-medium">Số Lượng </p>
          </div>
          <div className="col-span-2 flex justify-center">
            <p className="text-[#1A1A1A] text-base font-medium">Số Tiền</p>
          </div>
          <div className="col-span-1 flex justify-center">
            <p className="text-[#1A1A1A] text-base font-medium">Thao Tác</p>
          </div>
        </div>
        <div>
          <div
            className={`overscroll-auto md:overscroll-contain lg:overscroll-none mt-8 flex flex-col gap-5 overflow-x-hidden ${
              carts?.item?.length > 5 ? `h-[1000px]` : ``
            }`}
          >
            {carts.item?.length > 0 ? (
              (carts.item ?? []).map((e) => {
                return (
                  <>
                    <div
                      key={e.productid}
                      className="bg-white h-auto rounded-md items-center py-[30px]
                              shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]
                                 grid grid-cols-12"
                    >
                      <div className="col-span-1 text-center leading-none	">
                        <input
                          checked={checked(e)}
                          onChange={(element) =>
                            handleChecked(element.target.checked, e)
                          }
                          type="checkbox"
                          className="checkbox checkbox-sm items-center"
                        />
                      </div>
                      <div className="flex col-span-4 items-center">
                        <img
                          src={e.product.ProductImage[0].url}
                          className="w-[112px] h-[112px] object-contain"
                          alt="product"
                        />
                        <div>
                          <Link to={`/Detailproducts/${e.productid}`}>
                            <p className="text-[#1A1A1A] text-base font-medium mx-3">
                              {e.product.name}
                            </p>
                          </Link>
                          <div className="bg-[#f9e9e9] rounded-[30px] max-w-max mx-3 mt-3">
                            <p className="text-[#EA4B48] px-[10px] py-1">
                              Giảm {e.product.discount}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex gap-3 items-center justify-center">
                          <p className="text-[#7A828A] text-xs line-through leading-none	">
                            {numberFormat(e.product.price)}
                          </p>{" "}
                          <p className="text-[#EA4B48] text-xl">
                            {numberFormat(e.product.sellingPrice)}
                          </p>
                        </div>
                      </div>
                      <div className=" flex items-center col-span-2 justify-center gap-1">
                        {e.product.quantity > 0 ? (
                          <>
                            <div
                              className="border-[2px] border-[#FFAAAF] rounded-md bg-white p-2"
                              onClick={() => {
                                minusThrottled(e.quantity, {
                                  productId: e.productid,
                                  cartId: e.cartid,
                                });
                                setIdProduct(e.productid);
                              }}
                            >
                              <Minus />
                            </div>
                            <div>
                              <p className="text-base mx-2 font-medium">
                                {e.quantity}
                              </p>
                            </div>
                            <div
                              className="border-[2px] border-[#FFAAAF] rounded-md bg-white p-2"
                              onClick={() => {
                                e.quantity < e.product.quantity
                                  ? plusThrottled({
                                      productId: e.productid,
                                      cartId: e.cartid,
                                    })
                                  : toastWarn(
                                      `Chỉ còn ${e.product.quantity} sản phẩm`
                                    );
                                setIdProduct(e.productid);
                              }}
                            >
                              <Plus />
                            </div>
                          </>
                        ) : (
                          <>
                            <p>Hết hàng</p>
                          </>
                        )}
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <p className="text-[#EA4B48] text-xl">
                          {numberFormat(e.product.sellingPrice * e.quantity)}
                        </p>
                      </div>
                      <div className="col-span-1 justify-center flex">
                        <button
                          onClick={() => {
                            openModal(idItemCart);
                            setIdProduct(Number(e.productid));
                          }}
                          className="p-3 rounded-full
                    shadow-[rgba(108,_108,_108,_0.25)_0px_0px_4px_0px]"
                        >
                          <Delete />
                        </button>
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <>
                <EmptyPage title="Giỏ hàng của bạn đang trống!" />
              </>
            )}
            <DialogComfirm
              desc="sản phẩm"
              id={idItemCart}
              onClose={() => closeModal(idItemCart)}
              onSave={() => removeItemCart(idProduct)}
              title="Xóa sản phẩm này!"
            />
          </div>

          <div
            className="bg-white mt-[30px] items-center
                shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
          >
            <div className="w-[100%] flex items-center justify-between  ">
              <div className="p-4 flex items-center w-[35%]">
                <div className="w-[15%] text-center leading-none	">
                  <input
                    checked={checkAll}
                    onChange={(element) =>
                      handleCheckedAll(element.target.checked)
                    }
                    type="checkbox"
                    className="checkbox checkbox-sm items-center"
                  />
                </div>
                <div className="flex w-[40%] text-[#1A1A1A] text-base">
                  <p>Chọn Tất Cả</p>
                  <div className="mx-2 gap-2">({carts.item?.length ?? 0})</div>
                </div>
                <div
                  className="rounded-full shadow-[rgba(108,_108,_108,_0.25)_0px_0px_4px_0px]
                        "
                >
                  {productChecked.length > 0 && (
                    <>
                      <div onClick={() => openModal(idAllCart)} className="p-3">
                        <Delete />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between w-[55%] p-4">
                <div>
                  <p>Tổng thanh toán ({productChecked.length} sản phẩm):</p>
                </div>{" "}
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-[#EA4B48] text-3xl">
                      {numberFormat(calculatePrice().totalCart)}
                    </p>
                    <div className="flex">
                      <p>Tiết kiệm : </p>
                      <p className="ml-2 text-[#EA4B48]">
                        {numberFormat(calculatePrice().sale)}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={muti}
                  className="justify-center gap-3 items-center text-lg font-bold text-white w-[287px]
                             rounded-md h-[58px] hover:bg-[#ff6d65] flex 
                                transition duration-150 bg-[#EA4B48] cursor-pointer"
                >
                  <Buyzzle />
                  <p>Mua ngay</p>
                </button>
                <DialogComfirm
                  desc="các sản phẩm"
                  id={idAllCart}
                  onClose={() => closeModal(idAllCart)}
                  onSave={() => removeAllCart()}
                  title="Xóa các sản phẩm đã chọn!"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
