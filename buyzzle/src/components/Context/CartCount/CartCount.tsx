import { Link } from "react-router-dom";
import { useCart } from "../../../hooks/Cart/CartContextProvider";
import Shoppingcart from "../../../assets/TSX/Shopping-cart";

export default function CartCount() {
  const { carts } = useCart();
  return (
    <div>
      {
        <div>
          <Link to={"/cart"}>
            <div className="items-center flex pr-11 max-[769px]:pr-[10px]">
              <span className="relative inline-block">
                <Shoppingcart />
                <span
                  className={`absolute top-0 right-0 inline-flex items-center justify-center py-1 px-[6px] text-xs  border-[1px] border-[#44170f]
                  font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full
                  ${
                    carts.item?.length == 0 || carts.item?.length == undefined
                      ? "hidden"
                      : ""
                  }
                  `}
                >
                  {carts.item?.length >= 10 ? (
                    <p>10+</p>
                  ) : (
                    <p>{carts.item?.length}</p> ?? 0
                  )}
                </span>
              </span>
            </div>
          </Link>
        </div>
      }
    </div>
  );
}
