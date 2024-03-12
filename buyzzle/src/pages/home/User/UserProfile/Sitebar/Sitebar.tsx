import HistoryBought from "../../../../../assets/TSX/HistoryBought";
import User from "../../../../../assets/TSX/User";

import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Logout from "../../../../../assets/TSX/Logout";
import Voucher from "../../../../../assets/TSX/Voucher";
import Cart from "../../../admin/assets/TSX/Cart";

interface SitebarUser {
  icon: ReactNode;
  title: ReactNode;
  pathName: string;
}

const listSitebar: SitebarUser[] = [
  {
    icon: <User />,
    pathName: "/userprofilepage/username",
    title: "Tài khoản",
  },
  {
    icon: <HistoryBought />,
    pathName: "/orderhistory",
    title: <p>Đơn hàng</p>,
  },
  {
    icon: <Voucher />,
    pathName: "/uservoucherstorage",
    title: "Voucher",
  },
  {
    icon: <Cart />,
    pathName: "/cart",
    title: "Giỏ hàng",
  },
];
const instance = axios.create({
  withCredentials: true,
});
export default function Sitebar() {
  const { pathname } = useLocation();

  const API = "http://localhost:5000/buyzzle/auth/logout";
  async function LogOut() {
    try {
      await instance.post(API);
      localStorage.removeItem("user");
      localStorage.removeItem("LoginByGG");
      localStorage.removeItem("nameUser");
      googleLogout();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div
      className="mt-9 py-5 px-5 h-auto rounded-[6px] bg-white
    shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
    >
      {listSitebar.map((e) => {
        return (
          <>
            <Link to={e.pathName}>
              <div
                className={`w-[100%] flex justify-start items-center py-4 gap-3 transition duration-200
                        hover:rounded-[6px] cursor-pointer hover:bg-[#FFEAE9] text-[#7A828A] hover:text-[#EA4B48] pl-4
                         ${e.pathName == pathname
                    ? `bg-[#FFEAE9] rounded-md text-[#EA4B48]`
                    : `bg-white text-[#7A828A]`
                  }   `}
              >
                {e.icon}
                <span className="text-base font-normal ">{e.title}</span>
              </div>
            </Link>
          </>
        );
      })}

      <button
        onClick={LogOut}
        className=" w-[100%] flex justify-start items-center py-4 gap-3 transition duration-200
     hover:rounded-[6px] cursor-pointer hover:bg-[#FFEAE9] text-[#7A828A] hover:text-[#EA4B48] pl-4"
      >
        <Logout />

        <span className="text-base font-normal ">Đăng xuất</span>
      </button>
    </div>
  );
}
