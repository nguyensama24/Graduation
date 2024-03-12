import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoVoucher from "../../../../assets/TSX/LogoVoucher";
import VoucherManage from "../../../../assets/TSX/VoucherManage";
import VoucherManageItem from "../../../../assets/TSX/VoucherManageItem";
import { voucherControllers } from "../../../../controllers/VoucherControllers";
import { formatDate } from "../../../../helper/Format";
import { VoucherModel } from "../../../../model/VoucherModel";
import "./voucher.css";

export default function VoucherHomePage() {
  const [voucher, setVoucher] = useState<VoucherModel[]>([]);

  const getVoucher = async () => {
    await voucherControllers.getUser(1).then((res) => {
      setVoucher(res.data);
    });
  };
  useEffect(() => {
    getVoucher();
  }, []);

  return (
    <>
      <div>
        <div className="pt-2 pb-5 flex justify-center relative">
          <div className="flex gap-3 items-center border-b-[2px] border-b-[#F7755F] py-5 w-[70%] justify-center ">
            <div className="flex flex-col items-center">
              <p className="font-bold text-[18px] text-[#4C4C4C]">VOUCHER</p>
              <p className="font-bold text-[24px] text-[#4C4C4C]">BUYZZLE</p>
            </div>
            <div className="bg-[#F7755F] ">
              <VoucherManage />
            </div>
          </div>
          <Link to={"/voucher"}>
            <p className="group absolute bottom-[8%] right-0 text-[#F7755F] text-sm cursor-pointer hover:text-[#322322] duration-300 ">
              Xem tất cả
              <span className=" transform translate-x-full opacity-0 group-hover:opacity-100 group-hover:text-[#322322] px-1 group-hover:translate-x-0 transition-opacity duration-300">
                &#8594;
              </span>
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-5">
          {voucher.slice(0, 8).map((e) => {
            return (
              <>
                <Link to={"/voucher"}>
                  <div className="col-span-1 relative ">
                    <VoucherManageItem />
                    <div className="absolute left-[4%] top-[13%] flex flex-col gap-3 items-center w-[50%]">
                      <p className="font-bold text-xs text-[#F7755F]">
                        GIẢM {e.discount}%
                      </p>
                      <p className="text-[#4C4C4C] text-sm font-semibold bg-[#FFEAE9] w-[85%] text-center py-1">
                        #{e.code}
                      </p>

                      <p className="text-xs font-medium text-[#EA4B48]">
                        {formatDate(e.startDay)} - {formatDate(e.endDay)}
                      </p>
                    </div>

                    <div className="absolute right-[10%] top-[11%] flex flex-col items-center gap-1">
                      <p className="text-white font-bold text-sm">BUYZZLE</p>
                      <LogoVoucher />
                    </div>
                  </div>
                </Link>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}
