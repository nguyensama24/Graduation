import { ReactNode, useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import Logout from "../../../../assets/TSX/Logout";
import { adminController } from "../../../../controllers/AdminControllder";
import CategoryIcon from "../assets/Icon/CategoryIcon";
import Members from "../assets/Icon/Members";
import ProductIcon from "../assets/Icon/ProductIcon";
import Statistical from "../assets/Icon/Statistical";
import VouchersIcon from "../assets/Icon/VouchersIcon";
import Oder from "../assets/Icon/Oder";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import Logo from "../assets/Icon/Logo";
export interface SitebarAdmin {
  title?: ReactNode;
  icon: ReactNode;
  pathName?: string;
  MenuBanner?: MenuBanner[];
  MenuRole?: MenuRole[];
}
export interface MenuBanner {
  title: ReactNode;
  icon: ReactNode;
  pathName: string;
}
export interface MenuRole {
  title: ReactNode;
  icon: ReactNode;
  pathName: string;
}

export default function SitebarAdmin() {
  // const listSitebar: SitebarAdmin[] = [];
  const { pathname } = useLocation();
  const [href, setHref] = useState<string>();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [image, setImage] = useState<string>();
  const loadBorder = (index: number) => {
    if ((index + 1) % 2 == 0) {
      return (
        <p className="border-dashed border-t-2 solid #E8E8EA w-[100%]"></p>
      );
    }
  };
  // function ImageLoad() {

  // }
  useEffect(() => {
    let user = secureLocalStorage.getItem("admin");
    if (user == null) {
      window.location.href = "/admin/loginadmin";
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      // const user = secureLocalStorage.getItem("admin");
      let user = JSON.stringify(secureLocalStorage.getItem("admin"));
      try {
        if (user != null) {
          let UserData = JSON.parse(user);
          // UserData = JSON.parse(user);
          const username = UserData.username;
          await adminController.getAdminWhereUsername(username).then((res) => {
            const name = res.adminWithImage.name;

            const email = res.adminWithImage.email;
            // const pathName = `/admin/adminprofile/${username}`
            setHref(`/admin/adminprofile/${username}`);
            setName(name);
            setEmail(email);
            if (res.adminWithImage.AdminImage != undefined) {
              const Image = res.adminWithImage.AdminImage[0].url;
              setImage(Image);
            } else {
              console.log("Error");
            }
            return res;
          });
        } else {
          console.log("Error");
        }
      } catch (error) {
        if (user != null) {
          let UserData = JSON.parse(user);
          // UserData = JSON.parse(UserData);
          const username = UserData.name;
          setName(username);
          setEmail(UserData.email);
        }

        console.log("ERROR", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const listSitebar: SitebarAdmin[] = [
    {
      title: "Sản Phẩm",
      icon: <ProductIcon />,
      pathName: "/admin/ListproductsAdmin",
    },
    {
      title: "Thống Kê",
      icon: <Statistical />,
      pathName: "/admin/statisticsPage",
    },
    {
      title: "Danh mục",
      icon: <CategoryIcon />,
      pathName: "/admin/category",
    },

    {
      title: "Logo & Banner",
      icon: <Logo />,
      MenuBanner: [
        {
          title: "LogoFilter",
          icon: <Logo />,
          pathName: "/admin/logo",
        },

        {
          title: "LogoHome",
          icon: <Logo />,
          pathName: "/admin/logohome",
        },

        {
          title: "LogoHome1",
          icon: <Logo />,
          pathName: "/admin/logohome1",
        },

        {
          title: "LogoDetail",
          icon: <Logo />,
          pathName: "/admin/logodetail",
        },

        {
          title: "BannerFilter",
          icon: <Logo />,
          pathName: "/admin/banner",
        },

        {
          title: "BannerHome",
          icon: <Logo />,
          pathName: "/admin/bannerhome",
        },
      ],
    },
    {
      title: "Quyền",
      icon: <Members />,
      MenuRole: [
        {
          title: "Người dùng",
          icon: <Members />,
          pathName: "/admin/usersmanager",
        },
        {
          title: "Shipper",
          icon: <Members />,
          pathName: "/admin/shippermanager",
        },
        {
          title: "Admin",
          icon: <Members />,
          pathName: "/admin/adminmanager",
        },
      ],
    },
    {
      title: "Mã Giảm Giá",
      icon: <VouchersIcon />,
      pathName: "/admin/voucher",
    },
    {
      title: "Đơn Hàng",
      icon: <Oder />,
      pathName: "/admin/ordermanagement",
    },
    {
      title: "Đăng xuất",
      icon: <Logout />,
      pathName: "/admin/loginadmin",
    },
  ];

  return (
    <div
      className=" py-8 px-5 w-56 rounded-[6px] mb-5 bg-white 
      shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]
      "
    >
      {listSitebar.map((element, index) => {
        return (
          <>
            <div
              className={`w-[100%] flex justify-start py-2 gap-6 transition duration-200
                     hover:rounded-[6px] cursor-pointer  hover:text-[#EA4B48]
                     ${
                       element.pathName == pathname
                         ? `bg-[#FFEAE9] rounded-[6px] text-[#EA4B48]`
                         : `bg-white text-[#7A828A]`
                     }  `}
            >
              {element.icon}
              <span className="text-sm font-normal ">
                <Link to={element.pathName!}>
                  {element.title == "Logo & Banner" ? (
                    <>
                      <Accordion allowMultiple>
                        <AccordionItem>
                          <h2>
                            <AccordionButton className="flex justify-between">
                              <span>Logo & Banner</span>
                              <AccordionIcon className="ml-7 !text-navy-900 dark:!text-[#1A1A1A]" />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4} pl={0}>
                            <div className="rate flex">
                              <div className="mt-3">
                                {element.MenuBanner?.map((element) => {
                                  return (
                                    <div
                                      className={`w-[100%] flex justify-start items-center py-2 gap-3 transition duration-200
                       hover:rounded-[6px] cursor-pointer  hover:text-[#EA4B48] 
                       ${
                         element.pathName == pathname
                           ? `bg-[#FFEAE9] rounded-[6px] text-[#EA4B48]`
                           : `bg-white text-[#7A828A]`
                       }  `}
                                    >
                                      {element.icon}
                                      <span className="text-sm font-normal ">
                                        <Link to={element.pathName!}>
                                          {element.title}
                                        </Link>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </>
                  ) : element.title == "Quyền" ? (
                    <>
                      <Accordion allowMultiple>
                        <AccordionItem>
                          <h2>
                            <AccordionButton className="justify-between">
                              <span>Quyền</span>
                              <AccordionIcon className="ml-[82px] !text-navy-900 dark:!text-[#1A1A1A]" />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4} pl={0}>
                            <div className="rate flex">
                              <div className="mt-3">
                                {element.MenuRole?.map((element) => {
                                  return (
                                    <div
                                      className={`w-[100%] flex justify-start items-center py-2 gap-3 transition duration-200
  hover:rounded-[6px] cursor-pointer  hover:text-[#EA4B48] 
  ${
    element.pathName == pathname
      ? `bg-[#FFEAE9] rounded-[6px] text-[#EA4B48]`
      : `bg-white text-[#7A828A]`
  }  `}
                                    >
                                      {element.icon}
                                      <span className="text-sm font-normal ">
                                        <Link to={element.pathName!}>
                                          {element.title}
                                        </Link>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </>
                  ) : (
                    <>{element.title}</>
                  )}
                </Link>
              </span>
            </div>
            {loadBorder(index)}
          </>
        );
      })}
      <a className="flex gap-2" href={href}>
        {image ? (
          <div className=" mt-[15px] relative">
            <img
              className="rounded-2xl border-4 w-20 h-10"
              src={image}
              alt=""
            />
          </div>
        ) : (
          <div className="mt-[15px] rounded-2xl border-4 pt-2 pb-2 ps-3.5 pe-3.5  bg-red-500">
            <p className="text-1xl text-stone-50">
              {name?.substring(0, 1).toUpperCase()}
            </p>
          </div>
        )}
        <div>
          <div className="mt-[17px] font-medium flex items-center justify-left">
            {name}
          </div>
          <div className="font-small flex items-center justify-left">
            <p className="text-[10px]">{email}</p>
          </div>
        </div>
      </a>
      {/* <button>Đăng xuất</button> */}
    </div>
  );
}
