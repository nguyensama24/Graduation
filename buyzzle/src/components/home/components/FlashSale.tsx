import { FlashSaleList } from "../Index";
import { Images } from "../../../assets/ts";
import Progess from "./progess";

type FlashSale = {
  flashSaleItem: FlashSaleList;
};

export default function FlashSale(props: FlashSale) {
  var giaGiam = props.flashSaleItem.price * (props.flashSaleItem.giamGia / 100);
  var thanhTien = props.flashSaleItem.price - giaGiam;

  return (
    <>
      <div className="max-w-[310px] shadow shadow-[#ffaaaf]">
        <div className="relative figure">
          <img src={props.flashSaleItem.img} alt="" />
          <div className="absolute right-[0] top-[0] py-[13px] px-[8px] bgFlashSale">
            <p className="text-[16px] text-white text-center ">Giảm</p>
            <span className="text-[32px] text-[#efd22b]">
              {props.flashSaleItem.giamGia}%
            </span>
          </div>
        </div>

        <div className="p-[10px]">
          <p className="font-bold text-[16px] my-[3px] max-w-[268px]">
            {props.flashSaleItem.title}
          </p>
          <button>
            <img src={Images.star1} alt="" />
          </button>
          <button>
            <img src={Images.star1} alt="" />
          </button>
          <button>
            <img src={Images.star1} alt="" />
          </button>
          <button>
            <img src={Images.star1} alt="" />
          </button>
          <button>
            <img src={Images.star2} alt="" />
          </button>
          <span className="text-[12px]">{props.flashSaleItem.vote}</span>

          <div className="flex gap-[7px]">
            <div className="text-[7px] font-normal max-w-[61px] coupon text-white p-[3px]">
              <p>Giảm {giaGiam}k</p>
            </div>
            <div className="text-[7px] max-w-[61px] coupon text-white p-[3px]">
              <p>FREE SHIP</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[16px] text-[#865546] font-bold">
              {thanhTien} vnd
            </p>
          </div>
          <div className="max-w-[285px] mt-[20px] relative">
            <Progess />
            <img className="absolute top-[-80%]" src={Images.hot} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
