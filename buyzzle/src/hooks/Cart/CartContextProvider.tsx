import { createContext, useContext, useEffect, useState } from "react";
import { ModelCart, cartControllers } from "../../controllers/CartControllers";
import { toastSuccess } from "../../helper/Toast/Success";
import { toastWarn } from "../../helper/Toast/Warning";
import { CartItem, CartProduct } from "../../model/CartModel";
import { orderControllers } from "../../controllers/OrderControllers";
import { UpdateQuantityModal } from "../../model/OrderModel";
import { useNavigate } from "react-router-dom";

export default function useCartContext() {
   const [loading, setLoading] = useState(true);
   const [idProduct, setIdProduct] = useState(0);
   const [warning, setWarning] = useState<string>("");
   const [productChecked, setProductChecked] = useState<CartItem[]>([]);
   const [carts, setCarts] = useState<CartProduct>({} as CartProduct);
   let listProductQuantity: UpdateQuantityModal[] = [];
   const navigate = useNavigate();

   const addProduct = (
      productId: number,
      productQuantities: number,
      type: boolean
   ) => {
      const data: ModelCart = {
         productId: productId,
         quantity: productQuantities,
      };
      cartControllers
         .addCart(data)
         .then((res) => {
            getCart()

            if (type) {
               setProductChecked([])
               const buynowChecked = res.data.item.find((e) => e.productid == data.productId)
               const _buynowChecked: CartItem = {
                  id: buynowChecked?.id,
                  productid: buynowChecked?.productid!,
                  quantity: buynowChecked?.quantity!,
                  cartid: buynowChecked?.cartid!,
                  product: buynowChecked?.product!,
                  total: buynowChecked?.total!,
               }
               handleChecked(true, _buynowChecked)
               navigate('/cart');
               return
            } else {
               if (productChecked.length > 0) {
                  const isCheck = productChecked.find((item) => item.productid == productId)
                  if (isCheck) {
                     const indexProduct = productChecked.findIndex(
                        (item) => item.productid === data.productId
                     );
                     const _productChecked = [...productChecked];
                     _productChecked[indexProduct].quantity += productQuantities;
                     setProductChecked(_productChecked);
                  }
               }
            }

            toastSuccess("Thêm thành công");
         })
         .catch((err) => {
            setWarning(err.response?.data);
            openModal("idWarningQuantity");
         });
   };

   const getCart = async () => {
      setLoading(true);
      await cartControllers
         .getCart()
         .then((res) => {
            setCarts(res.data);
            res.data.item.map((e) => {
               if (e.quantity > e.product.quantity) {
                  listProductQuantity.push({
                     productId: e.id!,
                     quantity: e.product.quantity,
                  });
               }
            })
         })
         .then(() => {
            updateQuantityCart();
         })
         .finally(() => setLoading(false));
   };

   const updateQuantityCart = async () => {
      if (listProductQuantity.length > 0) {
         await orderControllers.updateQuantityCart(listProductQuantity);
      }
      return await cartControllers.getCart()
         .then((res) => {
            setCarts(res.data);
            return res.data.item;
         });
   };
   useEffect(() => {
      getCart();
   }, []);

   const handleBuyNow = async () => {
      if (productChecked.length == 0) {
         toastWarn("Chưa chọn sản phẩm");
      } else {
         await getCart();
         await updateQuantityCart().then((res) => {
            const listCheckout = res!.filter((e) => productChecked.some(ele => ele.productid == e.productid))
            sessionStorage.setItem("cartBuyzzle", JSON.stringify(listCheckout));
            setProductChecked(listCheckout)
         });
         navigate('/checkout');
      }
   };

   const openModal = (id: string) => {
      const modal = document.getElementById(id) as HTMLDialogElement | null;
      if (modal) {
         modal.showModal();
      }
   };

   const closeModal = (id: string) => {
      const modal = document.getElementById(id) as HTMLDialogElement | null;
      if (modal) {
         modal.close();
      }
   };
   const idItemCart = "confirmCart";
   const idAllCart = "confirmAllCart";
   const removeItemCart = (id: number) => {
      cartControllers.removeItemCart(idProduct).then(() => {
         getCart();
         closeModal(idItemCart);
         const _productChecked = [...productChecked];
         const Product = _productChecked.filter(
            (item) => item.productid !== id
         );
         setProductChecked(Product);
      });
   };
   const removeAllCart = () => {
      productChecked.length > 0 &&
         productChecked.map((e) => {
            cartControllers.removeItemCart(e.productid).then(() => {
               getCart();
               setProductChecked([]);
               closeModal(idAllCart);
            })
         });
   };
   const handleChecked = (checked: boolean, item: CartItem) => {
      if (checked) {
         if (item.product.quantity > 0) {
            setProductChecked((prev) => [...prev, item]);
         }
      } else {
         let cloneProduct = [...productChecked];
         let products = cloneProduct.filter((e) => {
            return e.productid !== item.productid;
         });
         setProductChecked(products);
      }
   };
   return {
      carts,
      setCarts,
      addProduct,
      loading,
      setLoading,
      getCart,
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
      warning,
      handleChecked,
   };
}
type CartContextType = ReturnType<typeof useCartContext>;

export const CartContext = createContext<CartContextType>(
   {} as CartContextType
);

export const useCart = () => useContext(CartContext);
