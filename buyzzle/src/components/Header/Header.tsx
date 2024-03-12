/* eslint-disable no-var */
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import LogoWeb from "../../assets/TSX/LogoWeb";
import Search from "../../assets/TSX/Search";
import { productController } from "../../controllers/ProductsController";
import { userController } from "../../controllers/UserController";
import { Top8product } from "../../model/ProductModel";
import { Products } from "../../pages/home/User/filterPage/FiltersPage";
import useDebounce from "../../useDebounceHook/useDebounce";
import CartCount from "../Context/CartCount/CartCount";
import HeaderTopUser from "../HeaderTop/HeaderTopUser";
import Container from "../container/Container";

export default function Header() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [Logined, setLogined] = useState<boolean>();
  const [productSearch, setProductSearch] = useState<Products[]>([]);
  const [topProduct, settopProduct] = useState<Top8product[]>([]);
  const [isSearch, setIsSearch] = useState(false);
  const [CheckAdmin, setCheckAdmin] = useState<boolean>();
  const [nameAdmin, setNameAdmin] = useState("");
  const user = localStorage.getItem("user");
  const [checkLogin, setCheckLogin] = useState<boolean>(false);

  // using UseSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  const searchValue = searchParams.get("keyword");

  const debouncedSearchParams = useDebounce(text, 500);
  // Slider Price SiteBarFilterPages
  const [sliderValues, setSliderValues] = useState<[number, number]>([
    0, 10000000,
  ]);
  const urlSliderValues = searchParams.get("sliderValues");
  useEffect(() => {
    // Kiểm tra nếu giá trị slider thay đổi thì mới cập nhật URL
    if (urlSliderValues) {
      const [min, max] = urlSliderValues.split(",").map(Number);
      setSliderValues([min, max]);
    }
  }, [urlSliderValues]);

  const getSearhvalue = async () => {
    await productController.getAllProductsSearch(text).then((res: any) => {
      setProductSearch(res.rows);
      settopProduct(res.top8products);
    });
  };

  useEffect(() => {
    getSearhvalue();
    if (text != "") {
      getSearhvalue();
      setSearchParams(
        createSearchParams({
          keyword: text,
          // min: sliderValues[0].toString(),
          // max: sliderValues[1].toString(),
        })
      );
    }
  }, [debouncedSearchParams]);
  var username;
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user != null) {
      setLogined(true);
      const userData = JSON.parse(user);
      const username = userData.username;
   
      userController.getUserWhereUsername(username).then((res) => {
       
        // setEditUser(res)
        setName(res.name);
        localStorage.setItem("nameUser", JSON.stringify(res.name));

        setCheckLogin(true);
        const UserImageArray = JSON.stringify(res.UserImage);
        const urlTaker = JSON.parse(UserImageArray);
        setImg(urlTaker[0].url);
       
        localStorage.setItem("avatarUser", JSON.stringify(urlTaker[0].url));
      });
    } else {
     
      setLogined(false);
    }
  }, []);

  if (user != null) {
    username = JSON.parse(user).username;
  } else {
    username = "Nah"
  }
  const href = `/userprofilepage/${username}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowSuggestions(true);
    setText(e.target.value);
  };
  // Function to hide suggestions
  const hideSuggestions = () => {
    setShowSuggestions(false);
  };
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      if (searchValue?.toString()! != undefined) {
        navigate({
          pathname: `/FiltersPage/`,
          search: createSearchParams({
            keyword: searchValue?.toString()!,
            minPrice: sliderValues[0].toString(),
            maxPrice: sliderValues[1].toString(),
          }).toString(),
        });
        setShowSuggestions(false);
      }
    }
  };
  const handleSearch = () => {
    if (searchValue?.toString()! != undefined) {
      navigate({
        pathname: `/FiltersPage/`,
        search: createSearchParams({
          keyword: searchValue?.toString()!,
          minPrice: sliderValues[0].toString(),
          maxPrice: sliderValues[1].toString(),
        }).toString(),
      });
      setShowSuggestions(false);
    }
  };
  const CheckToken = async () => {
    userController.CheckToken().then((res) => {

    });
  };
  const CheckRefreshToken = async () => {
    userController.CheckRefreshToken().then((res) => {
     
    });
  };
  const CheckLogin = async () => {
    if (Logined == false) {
      openModal(idAddAdmin);
    } else {
      CheckToken();
      CheckRefreshToken();
 
    }
  };
  const muti = () => {
    CheckToken();
    CheckRefreshToken();
  };
  const CheckLogin1 = () => {
    CheckLogin();
  };

  const idAddAdmin = "AddAdmin";

  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  useEffect(() => {
    let admin = secureLocalStorage.getItem("admin");
    if (admin != null) {
      checkAdminFunc(admin);
      getAdmin(admin);
    } else {
      setCheckAdmin(false);
     
    }

  }, []);
  function checkAdminFunc(admin: any) {
    if (admin != null) {
      setCheckAdmin(true);
    } else {
      setCheckAdmin(false);
    }
  }

  function getAdmin(adminData: any) {
  
    setNameAdmin(adminData.name);

  }


  return (
    <>
      <header className="Header">
        <Container>
          <div className="my-1">
            <HeaderTopUser />
          </div>
        </Container>
        <div className="border-2 border-[#E6E6E6]" />
        <Container>
          <div className="Header-center bg-white h-[91px]">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <div className="p-[10px]  max-[426px]:p-[1px]">
                  <a href="/" onClick={CheckToken}>
                    <LogoWeb />
                  </a>
                </div>
                {/* input */}
                <div className="items-center flex flex-1 max-w-[755px] max-2xl:ml-10 max-xl:max-w-[700px] max-xl:ml-5">
                  <div
                    className="Search-input-headerCenter items-center flex w-[90%]
                   py-[6px] px-[6px] border-[2px] border-[#FFAAAF] rounded-lg
                   max-xl:py-[1px]"
                  >
                    <div className="mb-2">
                      <Search />
                    </div>
                    <input
                      className=" rounded-lg focus:outline-none text-lg relative pr-7 flex-1 pl-3 max-xl:text-sm
                      max-[426px]:text-[6px]  max-[426px]:p-[0]"
                      placeholder="Tìm kiếm..."
                      onKeyDown={handleKeyPress}
                      onChange={(e) => handleChange(e)}
                      onBlur={() => (isSearch ? null : hideSuggestions())} // Hide suggestions when the input loses focus
                    />
                    {showSuggestions && (
                      <>
                        <div className="absolute w-[665px] z-50 bg-white border border-gray-300 rounded mt-2 p-2 top-28">
                          {/* // tên sản phẩm */}
                          <div>
                            <h1 className="text-base font-bold cursor-default p-1 pl-2">
                              Sản phẩm
                            </h1>
                            <div className="grid grid-cols-3 gap-4 py-3 border-dashed border-b-2 solid #E8E8EA w-[98%] mx-auto">
                              {productSearch.slice(0, 6).map((itemsSearch) => {
                                return (
                                  <>
                                    <div
                                      className="flex items-center gap-1 h-12
                                hover:rounded-md duration-200
                                hover:shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                                    >
                                      <div>
                                        <img
                                          src={itemsSearch.ProductImage[0].url}
                                          alt="ProductImage"
                                          className="w-14 h-12"
                                        />
                                      </div>
                                      <div
                                        className="text-base cursor-default p-1 pl-2  font-normal w-full"
                                        onClick={() => {
                                          setShowSuggestions(false);

                                          navigate(
                                            `/Detailproducts/${itemsSearch.id}`
                                          );
                                          hideSuggestions();
                                        }}
                                        onMouseOver={() => {
                                          setIsSearch(true);
                                        }}
                                        onMouseLeave={() => {
                                          setIsSearch(false);
                                        }}
                                      >
                                        <div className="text-[12px] ">
                                          {itemsSearch.name &&
                                            itemsSearch.name.length > 14 ? (
                                            `${itemsSearch.name.substring(
                                              0,
                                              14
                                            )}...`
                                          ) : itemsSearch.name ? (
                                            itemsSearch.name
                                          ) : (
                                            <p>Không có sản phẩm</p>
                                          )}
                                        </div>
                                        <p className="text-gray-600 text-xs">
                                          SL: {itemsSearch.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div>
                          {/* // danh mục */}
                          <div>
                            <h1 className="text-base font-bold cursor-default p-1 pl-2 mt-2 ">
                              Từ khóa
                            </h1>
                            <p className="text-base cursor-default p-1 pl-2 font-normal">
                              {text == "" ? "" : `"${text}"`}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex items-center" onClick={handleSearch}>
                      <button
                        className="btn-search bg-[#FFEAE9] p-[7px] rounded-lg font-bold text-[#1A1A1A] 
                      w-[135px] max-xl:max-w-[70px] max-xl:text-[11px] max-xl:p-[4px] border
                      max-[426px]:text-[6px] max-[426px]:max-w-[40px]  max-[426px]:hidden"
                      >
                        Tìm kiếm
                      </button>
                    </div>
                  </div>
                </div>

                <div className="items-center flex relative gap-2">
                  <a onClick={CheckLogin1}>{Logined ? <CartCount /> : <></>}</a>

                  <div className="items-center">
                    {
                      CheckAdmin == true ? (
                        <>
                          {/* {checkLogin ? ( */}
                          <div className=" flex gap-2">
                            <div className="font-medium flex items-center justify-center">
                              <p>Xin chào Admin:   <a href="/admin/ListproductsAdmin" className="text-[#f74b4b] hover:text-[#af4949] ">{nameAdmin}</a></p>
                            </div>

                          </div>

                        </>
                      ) : (
                        <>
                          {checkLogin ? (
                            <a className=" flex gap-2" href={href} onClick={muti}>
                              <div className="font-medium flex items-center justify-center">
                                {name}
                              </div>
                              {img ? (
                                <div className="relative">
                                  <img
                                    className="w-10 h-10 rounded-full "
                                    src={img}
                                    alt=""
                                  />
                                </div>
                              ) : (
                                <div className=" rounded-full pt-2 pb-2 ps-3.5 pe-3.5  bg-red-500">
                                  <p className="text-1xl text-stone-50">
                                    {name.substring(0, 1).toUpperCase()}
                                  </p>
                                </div>
                              )}
                            </a>
                          ) : (
                            <div className="flex text-[#1A1A1A] ml-[10px]">
                              <a href="/login">ĐĂNG NHẬP</a>
                              <div className="border-[1px] border-[#000000] mx-[20px] " />
                              <a href="/register">ĐĂNG KÍ</a>
                            </div>
                          )}
                        </>
                      )
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <div className="Header-bottom bg-[#FFEAE9] h-[40px]">
          <Container>
            <div className="container mx-auto">
              <ul className="flex gap-[3%] h-[40px] font-medium text-[#45474B] leading-15 items-center leading-[100%] max-[426px]:text-[9px]">
                {topProduct.map((items) => {
                  return (
                    <>
                      <Link to={`/Detailproducts/${items.id}`}>
                        <li className="hover:text-[#1F1717] text-xs">
                          {items.name.length > 20
                            ? `${items.name.substring(0, 20)}...`
                            : items.name}
                        </li>
                      </Link>
                    </>
                  );
                })}
              </ul>
            </div>
          </Container>
        </div>
      </header>
    </>
  );
}
