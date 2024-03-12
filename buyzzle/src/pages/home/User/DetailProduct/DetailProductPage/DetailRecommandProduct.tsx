import { Link } from "react-router-dom";
import { Images } from "../../../../../assets/ts";
import {
  formatSoldCount,
  numberFormat,
  roundedNumber,
} from "../../../../../helper/Format";
import { Row } from "../../../../../model/ProductModel";
type Props = {
  productRecommand: Row;
};
export default function DetailRecommandProduct(props: Props) {
  const { productRecommand } = props;
  const stars = Array(5).fill(0);
  return (
    <>
      <Link to={`/Detailproducts/${productRecommand.id}`}>
        <div
          className="w-[210px] h-[311px] flex-col cursor-pointer transition duration-200 max-xl:max-w-[180px]
                                        hover:shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] "
        >
          <img
            className="h-[207px] w-[100%] max-2xl:h-[247px]  max-lg:h-[347px] "
            alt=""
            src={productRecommand.ProductImage[0].url}
          />
          <div
            className="p-[10px] border-x-[1px] border-b-[1px] border-[#FFAAAF] 
        max-2xl:max-h-max 
        max-lg:h-[180px]
        "
          >
            <p
              className="font-bold text-base max-xl:text-[15px] break-words truncate
          max-2xl:text-[15px]
          max-lg:text-2xl
          max-lg:mt-4
          "
            >
              {productRecommand.name}
            </p>

            <div
              className="flex gap-[7px]
          max-lg:mt-2
          "
            >
              <div
                className="text-[7px] font-normal bg110k bg-red-500 max-w-[151px] text-white text-center p-[3px]
          max-lg:text-[10px]
            "
              >
                Giảm{" "}
                {numberFormat(
                  productRecommand.price * (productRecommand.discount / 100)
                )}
                k
              </div>
              <div
                className="text-[7px]  bg110k max-w-[51px] bg-red-500 text-white text-center p-[3px]
            max-lg:text-[10px]"
              >
                FREE SHIP
              </div>
            </div>

            <div className="flex items-center gap-3 max-lg:mt-1">
              <p
                className="text-xs text-[rgba(0,0,0,.26)] col-span-1 line-through
          max-2xl:text-[9px]
          max-lg:text-[15px]
          "
              >
                {numberFormat(productRecommand.price)}
              </p>
              <p
                className="text-[16px] text-[#865546] col-span-2 font-bold 
          max-2xl:text-sm
          max-lg:text-2xl
            "
              >
                {numberFormat(
                  productRecommand.price -
                    productRecommand.price * (productRecommand.discount / 100)
                )}
              </p>
            </div>

            <div
              className="flex justify-between max-2xl:items-center
          max-lg:mt-2
          "
            >
              <div>
                {stars.map((_, index) => (
                  <button key={index}>
                    <img
                      src={
                        index < productRecommand.rate
                          ? Images.star1
                          : Images.star2
                      }
                      alt=""
                    />
                  </button>
                ))}
                <span className="text-[12px] mr-[30px] ml-[4px] max-lg:text-base">
                  {roundedNumber(productRecommand.rate)}.0
                </span>
              </div>

              <p
                className="text-[12px] text-[#4c4c4c] font-medium
            max-2xl:text-[10px]
            max-lg:text-base
            "
              >
                Đã bán{" "}
                {productRecommand.soldcount == 0
                  ? "0"
                  : productRecommand.soldcount !== undefined
                  ? formatSoldCount(productRecommand.soldcount)
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
