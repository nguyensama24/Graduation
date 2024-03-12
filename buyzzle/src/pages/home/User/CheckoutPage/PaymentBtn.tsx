import { useState } from "react";
import { toast } from "react-toastify";
import Buyzzle from "../../../../assets/TSX/Buyzzle";
import { cartControllers } from "../../../../controllers/CartControllers";
import { orderControllers } from "../../../../controllers/OrderControllers";
import { paymentControllers } from "../../../../controllers/PaymentControllers";
import { voucherControllers } from "../../../../controllers/VoucherControllers";
import { toastWarn } from "../../../../helper/Toast/Warning";
import { CartItem } from "../../../../model/CartModel";
import { OrderItems, UpdateQuantityModal } from "../../../../model/OrderModel";
import { VoucherModel } from "../../../../model/VoucherModel";
import { PaymentMethod } from "./CheckOut";

export interface StripePayment {
  cartItems: CartItem[];
  voucher: VoucherModel;
  method: PaymentMethod;
  idUser: number;
  note: string;
  invoice: boolean;
  name: string;
  address: string;
  phoneNumber: string;
}

export default function PaymentBtn(props: StripePayment) {
  const {
    cartItems,
    method,
    voucher,
    idUser,
    note,
    invoice,
    address,
    name,
    phoneNumber,
  } = props;
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (address != null && phoneNumber != null) {
      if (cartItems.length > 0) {
        if (method == "stripe") {
          setLoading(true);
          setTimeout(async () => {
            await paymentControllers
              .createPayment({
                cartItems: cartItems,
                method: method,
                discount: voucher.discount,
                idUser: Number(idUser),
                note: note,
                invoice: invoice,
                name: name,
                address: address,
                phoneNumber: phoneNumber,
                voucherId: voucher.id,
              })
              .then((res) => {
                if (res.data.url) {
                  window.location.href = res.data.url;
                }
              })
              .then(() => sessionStorage.removeItem("cartBuyzzle"))
              .catch((err) => console.log(err.message));
          }, 100);
        } else if (method == "cash") {
          let item: OrderItems[] = [];
          let listProductQuantity: UpdateQuantityModal[] = [];
          let subtotal = 0;

          cartItems?.map((e) => {
            subtotal += e.product.sellingPrice * e.quantity;
            item.push({
              productId: e.product.id,
              name: e.product.name,
              image: e.product.ProductImage[0].url,
              price: e.product.sellingPrice,
              quantity: e.quantity,
              total: e.product.sellingPrice * e.quantity,
            });
            listProductQuantity.push({
              productId: e.product.id,
              quantity: e.quantity,
            });
          });
          let order = {
            iduser: Number(idUser),
            method: "Thanh toán khi nhận hàng",
            cartItems: item,
            amount_subtotal: subtotal,
            shipping: 30000,
            discount: subtotal * (voucher.discount / 100),
            amount_total:
              subtotal - subtotal * (voucher.discount / 100) + 30000,
            note: note,
            invoice: invoice,
            name: name,
            address: address,
            phoneNumber: phoneNumber,
          };
          setLoading(true);
          setTimeout(async () => {
            await orderControllers
              .create(order)
              .then(() => {
                window.location.href = "/orderhistory";
                sessionStorage.removeItem("cartBuyzzle");
              })
              .then(() => {
                order.cartItems.map((e) => {
                  cartControllers.removeItemCart(e.productId);
                });
              })
              .then(() => {
                if (voucher.id != 0) {
                  voucherControllers.useVoucher(Number(idUser), voucher.id);
                }
              })
              .then(() => {
                orderControllers.quantityCreateOrder(listProductQuantity);
              });
          }, 3000);
        }
      } else {
        toast.warning("Chưa có sản phẩm");
      }
    } else {
      toastWarn("Địa chỉ hoặc SĐT đang trống");
    }
  };

  const handleLoading = () => {
    if (loading) {
      return (
        <>
          <span className="loading loading-spinner loading-md"></span>
          <p>Đang xử lý...</p>
        </>
      );
    } else {
      return (
        <>
          <Buyzzle />
          <p>Đặt ngay</p>
        </>
      );
    }
  };

  return (
    <>
      <button
        onClick={() => handleCheckout()}
        className="justify-center gap-3 items-center text-base font-bold text-white w-full
                             rounded-md py-[11px] hover:bg-[#ff6d65] flex mt-1
                                transition duration-150 bg-[#EA4B48] cursor-pointer
                                max-[1105px]:px-[80px] max-lg:px-[60px] max-lg:text-sm max-[850px]:px-[45px] max-[850px]:text-xs"
      >
        {handleLoading()}
      </button>
    </>
  );
}
