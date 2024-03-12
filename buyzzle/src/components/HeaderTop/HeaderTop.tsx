import { ReactNode } from "react";
import Bell from "../../assets/TSX/Bell";

interface HeaderTop {
  noti: ReactNode;
  countNoti: number;
}
export default function HeaderTop(props: HeaderTop) {
  const { countNoti, noti } = props;

  return (
    <header className="Header">
      <div className="Header-top bg-white">
        <div className="container mx-auto">
          <div className="Header-top-content flex justify-between">
            <div className="content-left flex py-2">
              {/* <Map />
              <span className="text-[#4C4C4C] pl-2">Buôn Ma Thuột ddddđ</span> */}
            </div>

            <div className="content-right flex items-center gap-2 ">
              <div className="content-left flex items-center">
                {/* <span className="text-[#4C4C4C] pl-2">Việt Nam</span> */}
              </div>
              <div className="content-left flex py-2 gap-2 ">
                {/* <div className="border-[1px] border-black " /> */}
                {/* Noti */}
                <div className="flex items-center relative">
                  <div className=" header-hover justify-start items-center flex gap-3">
                    {noti}
                    <span className=" inline-block">
                      <Bell />

                      <span
                        className={`absolute top-0 inline-flex items-center justify-center px-[5px] py-1 text-xs cursor-default
                        font-medium leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full 
                        `}
                      >
                        {countNoti}
                      </span>
                    </span>
                    <span className="text-[#4C4C4C] pl-2 cursor-default">
                      Thông báo
                    </span>
                  </div>
                </div>

                {/* end Noti */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
