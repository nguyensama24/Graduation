import { Link } from "react-router-dom";
import { Images } from "../../../assets/ts";
import {
  formatSoldCount,
  numberFormat,
  roundedNumber,
} from "../../../helper/Format";
import { MergedProducts } from "../../../model/ProductsSuggest";

export type Props = {
  product: MergedProducts;
};

export default function Productss(props: Props) {
  const { product } = props;
  // Tạo một mảng với đủ số lượng sao (5 sao) mà bạn muốn hiển thị
  const stars = Array(5).fill(0);
  return (
    <>
      <Link to={`/Detailproducts/${product.id}`}>
        <div
          className="w-[210px] h-[311px] flex-col cursor-pointer
       hover:shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] transition duration-200
       max-2xl:w-[230px] max-2xl:h-[351px] 
       max-lg:w-[310px] max-lg:h-[530px]
       "
        >
          <div className="relative figure ">
            {product.ProductImage.length == 0 ? (
              <>
                <p>No Images</p>
                <p className="absolute top-[5%] left-[3.5%] p-[5px] text-[12px] hidden text-white bg-[#ea4b48] rounded">
                  Giảm {product.discount}%
                </p>
              </>
            ) : (
              <>
                <img
                  className="h-[207px] w-[100%] max-2xl:h-[247px]  max-lg:h-[347px] "
                  alt=""
                  src={product.ProductImage[0].url}
                />
                <p className="absolute top-[5%] left-[3.5%] p-[5px] text-[12px] text-white bg-[#ea4b48] rounded">
                  Giảm {product.discount}%
                </p>
              </>
            )}
          </div>

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
              {product.name}
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
                Giảm {numberFormat(product.price * (product.discount / 100))}k
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
                {numberFormat(product.price)}
              </p>
              <p
                className="text-[16px] text-[#865546] col-span-2 font-bold 
          max-2xl:text-sm
          max-lg:text-2xl
            "
              >
                {numberFormat(
                  product.price - product.price * (product.discount / 100)
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
                    {/* Sử dụng index để xác định xem sao này có phải sao màu vàng hay không */}
                    <img
                      src={index < product.rate! ? Images.star1 : Images.star2}
                      alt=""
                    />
                  </button>
                ))}
                <span className="text-[12px] mr-[30px] ml-[4px] max-lg:text-base">
                  {roundedNumber(product.rate!)}.0
                </span>
              </div>

              <p
                className="text-[12px] text-[#4c4c4c] font-medium
            max-2xl:text-[10px]
            max-lg:text-base
            "
              >
                Đã bán{" "}
                {product.soldcount == 0
                  ? "0"
                  : product.soldcount !== undefined
                  ? formatSoldCount(product.soldcount)
                  : "0"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
