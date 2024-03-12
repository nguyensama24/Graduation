import axios from "axios";
import copy from "copy-to-clipboard";
import { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { useParams } from "react-router-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { toast } from "react-toastify";
import { Images } from "../../../../../assets/ts";
import Minus from "../../../../../assets/TSX/Minus";
import Plus from "../../../../../assets/TSX/Plus";
import SuccessIcon from "../../../../../assets/TSX/SuccessIcon";
import RateDetailCMT from "../../../../../components/Sitebar/Rate/RateDetailCMT";
import Container from "../../../../../components/container/Container";
import { appConfig } from "../../../../../configsEnv";
import { productController } from "../../../../../controllers/ProductsController";
import { ratingAndCommentController } from "../../../../../controllers/Rating&Comment";
import WarningQuantityCart from "../../../../../helper/Dialog/WarningQuantityCart";
import { numberFormat, roundedNumber } from "../../../../../helper/Format";
import { stars } from "../../../../../helper/StarRating/Star";
import { useCart } from "../../../../../hooks/Cart/CartContextProvider";
import { useScroll } from "../../../../../hooks/Scroll/useScrollPages";
import { Rate, Ratee, Rating, Row } from "../../../../../model/ProductModel";

// import ZoomableImage from "../../../../../components/ZoomImage/ZoomableImage";

import DetailRecommandProduct from "./DetailRecommandProduct";
import { userController } from "../../../../../controllers/UserController";

import DialogLogin from "../../../../../helper/Dialog/DialogLogin";
import { Controller, useForm } from "react-hook-form";
import Cart from "../../../admin/assets/TSX/Cart";
import ImageMagnifier from "../../../../../hooks/ImageMagnifier/ImageMagnifier";
import SaveLink from "../../../admin/assets/TSX/SaveLink";
import Breadcrumb from "../../../../../helper/Breadcrumb/BreadcrumbProps";
import { LogoDetailModel } from "../../../../../model/LogoDetailModel";
import { logodetailController } from "../../../../../controllers/LogoDetailController";
import RatingMap from "../ratingAndComments/RatingMap";
export interface ImgOfProduct {
  url: string;
}
[];

export type LoginForm = {
  email: string;
  password: string;
};
export type FormValues = {
  idproduct: number;
  name: string;
  price: number;
  description: string;
  discount: number;
  quantity: number;
  count: number;
  ProductImage: ImgOfProduct[];
  id: number;
  iduser: number;
  ratingValue: number;
  comment: string;
  createdAt: Date;
  product: {
    quantity: number;
  };
  user: {
    username: string;
  };
};
export type Product = {
  id: number;
  imgSrc: string;
  title: string;
  price: number;
  discount: number;
  soldCount: number;
};
export interface RatingStarDetail {
  checked: boolean;
  rating: number;
  onChangeFilter?(rating: number): void;
}
const arrRating: RatingStarDetail[] = [
  { checked: false, rating: 5 },
  { checked: false, rating: 4 },
  { checked: false, rating: 3 },
  { checked: false, rating: 2 },
  { checked: false, rating: 1 },
];
export interface EditImage {
  url: string;
  id: number;
}
export default function DetailsProduct() {
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const { addProduct, warning, closeModal } = useCart();
  const idWarningQuantity = "idWarningQuantity";

  const [first, setfirst] = useState<Rate | undefined>(undefined);
  const [selectedRating, setSelectedRating] = useState(0);
  const [rateAndcomment, setRateAndcomment] = useState<Ratee>({
    perPage: 2,
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("descriptions"); // Mặc định là tab "App"
  const [Logined, setLogined] = useState<boolean>();
  const [category, setCategory] = useState<String>("");
  const [productName, setProductName] = useState<String>("");
  const [logo, setLogo] = useState<LogoDetailModel[]>([]);

  const getAllLogo = async () => {
    await logodetailController.getAll().then((res: any) => {
      setLogo(res);
    });
  };

  useEffect(() => {
    getAllLogo();
  }, []);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const breadcrumbItems = [
    { text: "Buyzzle", link: "/" },
    {
      text: "" + category,
      link: `/FiltersPage/?nameCate=${category}&minPrice=0&maxPrice=10000000`,
    },
    { text: "" + productName },
  ];

  // Điều này giả định rằng bạn có một hàm hoặc cách nào đó để lấy giá trị `averageRating` từ `first`
  useEffect(() => {
    if (first) {
      setSelectedImageIndex(0);
      setSelectedRating(roundedNumber(first.averageRating));
    }
  }, [first]);
  const [quantity, setQuantity] = useState(1);
  const [recommandProduct, setRecommandProduct] = useState<Row[]>([]);

  const { id } = useParams();

  const getDetailProduct = async () => {
    await axios
      .get(`${appConfig.apiUrl}/chitietproduct/${id}`)
      .then((detail) => {
        return detail;
      })
      .then((detail) => {
        // setEditImages(detail.data);
        setCategory(detail.data.productDetail.fK_category.name);
        setProductName(detail.data.productDetail.name);
        setfirst(detail.data);
      
      })
      .catch((error) => {
        ("🚀 ~ file: Detailproducts.tsx:63 ~ .then ~ error:", error);
      });
  };

  useEffect(() => {
    useScroll();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    getCommentWhereRating(
      id,
      1,
      rateAndcomment.currentPage,
      rateAndcomment.perPage
    );
    getDetailProduct();
    RecommandProductDetailPage(Number(id));
  }, [rateAndcomment.currentPage, id]);

  const plusQuantity = () => {
    if (quantity < first?.productDetail?.quantity!) {
      setQuantity(quantity + 1);
    }
  };
  const minusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const getCommentWhereRating = (
    idproduct?: any,
    rating?: number,
    page?: number,
    perPage?: number
  ) => {
    ratingAndCommentController
      .getCommentWhereRating(idproduct, rating, page, perPage)
      .then((res) => {
        setRateAndcomment(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const HandleGetCommentWhereRating = (rating: any) => {
    const idproduct = id;
    getCommentWhereRating(idproduct, rating);
  };

  const RecommandProductDetailPage = (id: number) => {
    productController
      .getProductSuggest(id)
      .then((res: any) => {
        setRecommandProduct(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Sửa đánh giá
  const handleEditProductRating = async (
    id: string,
    data: Rating,
    idRating: number
  ) => {
    await ratingAndCommentController
      .EditRatingAndComment(idRating, data)
      .then(async (res) => {
        toast.success("Đánh giá thành công !");
        const _rateAndComment = rateAndcomment?.Rating?.map((item) => {
          if (item.id === res.data?.id) {
            return {
              ...item,
              comment: res.data?.comment,
              ratingValue: res.data?.ratingValue,
            };
          }
          return item;
        });
        setRateAndcomment((prevRateAndcomment: any) => {
          const newRateAndcomment = {
            ...prevRateAndcomment,
            Rating: _rateAndComment,
          };
          return newRateAndcomment;
        });
        getDetailProduct();
      })
      .catch(() => {
        toast.error("Đánh giá thất bại !");
      });

  };
  useEffect(() => {
    document.title = `${first?.productDetail.name}`;
    handleRemoveRating(Number(id));
  }, [first]);
  //Xóa comment
  const handleRemoveRating = (id: number) => {
    ratingAndCommentController.RemoveRatingAndComment(id).then((_) => {
      if (rateAndcomment) {
        const removedRatings = rateAndcomment.Rating?.filter(
          (rating) => rating.id !== id
        );
        setRateAndcomment({
          ...rateAndcomment,
          Rating: removedRatings,
        });
        getDetailProduct();
      }
    });
    RecommandProductDetailPage(id);
  };
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const coppyLink = (link: string) => {
    copy(link, {
      debug: true,
      message: "Press #{key} to copy",
    });
    setCopied(true);
    setMessage("Đã sao chép!");

    // Sau một khoảng thời gian, đặt lại trạng thái để ẩn thông báo
    setTimeout(() => {
      setCopied(false);
      setMessage("");
    }, 2000);
  };
  const handlePageChange = (page: number) => {
    setRateAndcomment({ ...rateAndcomment, currentPage: page });
  };

  const isSoldOut = first?.productDetail?.quantity == 0;
  const CheckToken = async () => {
    userController.CheckToken().then((res) => {

    });
  };
  const CheckRefreshToken = async () => {
    userController.CheckRefreshToken().then((res) => {
    });
  };
  const CheckLogin = async () => {
    // const user = localStorage.getItem("user");
    if (Logined == false) {
      // setLogined(false);
      openModal(idAddAdmin);
    } else {
      // setLogined(true);
      CheckToken();
      CheckRefreshToken();

    }
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user != null) {
      setLogined(true);
    } else {
      setLogined(false);
    }
  }, []);

  const muti = () => {
    CheckLogin();
  };
  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    register,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "all",
  });

  const param = useParams();
  const idAddAdmin = "AddAdmin";
  const Login = async (data: LoginForm) => {

    // try {
      userController.Login(data).then((res) => {
       
        const username = res.username;
        const accessToken = res.accessToken;
   
        const UserData = { username };
        const Token = { accessToken };
        localStorage.setItem("idUser", JSON.stringify(res.id));
        localStorage.setItem("user", JSON.stringify(UserData));
        localStorage.setItem("accessToken", JSON.stringify(Token));
        // const id = param.id;
        setTimeout(() => {
          window.location.href = `/Detailproducts/${param.id}`;
        }, 2000);
      });
    // } catch (error) {
      
    // }
    
  };
  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  const closeModal2 = async (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };
  const saveModal = (id: string, data: LoginForm) => {
    try {
      Login(data);
      reset({
        email: "",
        password: "",
      });
      // const modal = document.getElementById(id) as HTMLDialogElement | null;
      //   if (modal) {
      //     modal.close();
      //   }
      //   console.log("Data:" + JSON.stringify(data));
    } catch (error) {
      console.log("Error:" + JSON.stringify(data));
    }
  
  };
  return (
    <>
      <Container>
        <body className="body-detail container mx-auto">
          <Breadcrumb items={breadcrumbItems} />
          <div className="grid gap-4 grid-cols-10 mt-10 h-full">
            <div className="col-span-4 z-10">
              {/* {first?.productDetail && (
                <div>
                  <img
                    className="w-[600px] h-[430px] object-contain"
                    src={
                      first?.productDetail?.ProductImage?.[selectedImageIndex]
                        ?.url
                    }
                    alt=""
                  />
                </div>
              )} */}
              {first?.productDetail && (
                <div>
                  <ImageMagnifier
                    width="500px"
                    height="430px"
                    src={
                      first?.productDetail?.ProductImage?.[selectedImageIndex]
                        ?.url
                    }
                  />
                </div>
              )}
            </div>
            <div className="my-auto">
              <div className="col-span-1 grid gap-3">
                {first?.productDetail &&
                  first.productDetail.ProductImage &&
                  first.productDetail.ProductImage.slice(0, 5).map(
                    (e, index) => {
                      return (
                        <img
                          key={index}
                          className={`h-[75px] w-[75px] ${
                            selectedImageIndex === index
                              ? "border-2 border-blue-500"
                              : ""
                          }`}
                          src={e.url}
                          alt=""
                          onClick={() => handleImageClick(index)}
                        />
                      );
                    }
                  )}
              </div>
            </div>
            <div className="col-span-5">
              <p className="text-[32px] text-[#393939] font-medium leading-9">
                {first?.productDetail ? (
                  <p className="text-[32px] text-[#393939] font-medium leading-9">
                    {first.productDetail.name}
                  </p>
                ) : null}
              </p>
              {/* Thống kê */}
              <div className="grid grid-cols-4 mt-8">
                <div className="flex col-span-1 gap-4">
                  {/* rating  */}
                  <div>
                    <div className="flex items-center justify-start gap-2 ">
                      <div className="rating rating-xs">
                        {stars.map((_, index) => (
                          <button key={index}>
                            {/* Sử dụng index để xác định xem sao này có phải sao màu vàng hay không */}
                            <img
                              src={
                                index < selectedRating
                                  ? Images.star1
                                  : Images.star2
                              }
                              alt=""
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-[#EA4B48] text-sm">
                        {roundedNumber(selectedRating)}.0
                      </p>
                    </div>
                  </div>
                  <div className="border-r-2 border-[#E0E0E0]"></div>
                </div>
                <div className="flex ml-1 gap-2">
                  <div>
                    <p className="text-[#1A1A1A] text-base">
                      {/* {first?.Rating.length} */}
                      {first?.Rating ? (
                        <p className="text-[#1A1A1A] text-base">
                          {first.Rating.length}
                        </p>
                      ) : null}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#4C4C4C] text-sm mt-[2px] mr-1">
                      Đánh giá
                    </p>
                  </div>
                  <div className="border-r-2 border-[#E0E0E0]"></div>
                </div>

                {first?.productDetail ? (
                  <div className="flex col-span-1 ml-[-38px] gap-2 items-center">
                    {first.productDetail.soldcount > 0 ? (
                      <>
                        <div>
                          <p className="text-[#1A1A1A] text-base">
                            {first.productDetail.soldcount}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#4C4C4C] text-sm">Đã bán</p>
                        </div>
                      </>
                    ) : (
                      <p>0 Đã bán</p>
                    )}
                  </div>
                ) : null}
              </div>
              {/* end Thống kê */}
              {/* bachground price */}
              <div className="w-[100%] bg-[#F8F8F8] rounded-md mt-6 px-6 py-[14px]">
                <div className="flex justify-between">
                  <div>
                    {first?.productDetail ? (
                      <div className="items-center flex">
                        <p className="text-[36px] text-[#EA4B48] font-medium ">
                          {numberFormat(
                            first?.productDetail.price! -
                              first?.productDetail.price! *
                                (first?.productDetail.discount! / 100)
                          )}
                        </p>
                        <p className="text-sm font-normal ml-3 text-[#7A828A] line-through">
                          {numberFormat(first.productDetail.price)}
                        </p>
                      </div>
                    ) : null}

                    {first?.productDetail ? (
                      <div className="bg-[#f9e9e9] rounded-[30px] max-w-max mt-[5px]">
                        <p className="text-[#EA4B48] px-[10px] py-1">
                          Giảm {first.productDetail.discount}%
                        </p>
                      </div>
                    ) : null}
                  </div>
                  {/* Tăng giảm số lượng */}
                  <div className="flex flex-col my-3 justify-between">
                    <div className="flex">
                      {/* Giảm số lượng */}
                      <div
                        className="border-[2px] border-[#FFAAAF] rounded-md bg-white px-[5px] py-[3px]"
                        onClick={minusQuantity}
                      >
                        <Minus />
                      </div>
                      {/* end Giảm số lượng */}
                      {/* Số lượng */}
                      <div>
                        <p className="text-base mx-2 font-medium">{quantity}</p>
                      </div>
                      {/* end Số lượng */}
                      {/* Tăng số lượng */}
                      <div
                        className="border-[2px] border-[#FFAAAF] rounded-md bg-white px-[5px] py-[3px]"
                        onClick={plusQuantity}
                      >
                        <Plus />
                      </div>
                      {/* end Tăng số lượng */}
                    </div>
                    <div className="flex justify-start gap-2 text-[#7A828A]">
                      Còn {first?.productDetail.quantity} sản phẩm
                    </div>
                  </div>
                  {/* end Tăng giảm số lượng */}
                </div>
              </div>{" "}
              {/* bachground price */}
              {/* icon */}
              <div className="w-[100%] flex mt-9 px-5 items-center justify-between bg-[#F8F8F8] rounded-md py-[14px]">
                <div className="flex gap-2">
                  <FacebookShareButton
                    children={<FacebookIcon size={40} round={true} />}
                    url={`https://bd24-14-241-150-19.ngrok-free.app/Detailproducts/${first?.productDetail.id}`}
                    about={first?.productDetail?.name}
                    hashtag={first?.productDetail?.name}
                  />
                  {/* <FacebookMessengerShareButton
                    appId="331551886287174"
                    children={<FacebookMessengerIcon size={40} round={true} />}
                    url={`https://bd24-14-241-150-19.ngrok-free.app/Detailproducts/${first?.productDetail.id}`}
                  /> */}
                  <WhatsappShareButton
                    children={<WhatsappIcon size={40} round={true} />}
                    url={`https://bd24-14-241-150-19.ngrok-free.app/Detailproducts/${first?.productDetail.id}`}
                  />

                  <TwitterShareButton
                    children={<TwitterIcon size={40} round={true} />}
                    url={`https://bd24-14-241-150-19.ngrok-free.app/Detailproducts/${first?.productDetail.id}`}
                  />
                  <TelegramShareButton
                    children={<TelegramIcon size={40} round={true} />}
                    url={`https://bd24-14-241-150-19.ngrok-free.app/Detailproducts/${first?.productDetail.id}`}
                  />
                </div>
                <div
                  className="relative "
                  onClick={() =>
                    coppyLink(
                      `https://bd24-14-241-150-19.ngrok-free.app/Detailproducts/${first?.productDetail.id}`
                    )
                  }
                >
                  <SaveLink />
                  {copied && (
                    <div className="absolute w-[135px] pl-3 bg-green-500 text-white rounded right-1 flex py-1 gap-2 items-center">
                      <p className="text-center">{message}</p>
                      <SuccessIcon />
                    </div>
                  )}
                </div>
              </div>
              {/* end icon */}
              {/* Mua ngay */}
              <div
                className={`w-[100%] flex ${
                  isSoldOut ? `justify-start` : `justify-end`
                } mt-9 items-center gap-6`}
              >
                {/* <div>
                  <LoveProduct />
                </div> */}

                {isSoldOut ? (
                  <>
                    <div
                      className={`flex items-center w-[268px] bg-[#EA4B48] rounded-md h-[58px] transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly`}
                    >
                      <p className="text-center text-base font-bold text-white">
                        Hết hàng
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <a onClick={muti}>
                      {Logined ? (
                        <div
                          className={`cursor-pointer flex items-center w-[268px] rounded-md h-[58px] hover:bg-[#FFEAE9] transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly`}
                          onClick={() =>
                            !isSoldOut &&
                            addProduct(Number(id), quantity, false)
                          }
                        >
                          <div className="text-center text-base font-bold text-[#4C4C4C]">
                            Thêm Vào Giỏ Hàng
                          </div>
                          <Cart />
                        </div>
                      ) : (
                        <div
                          className={`cursor-pointer flex items-center w-[268px] rounded-md h-[58px] hover:bg-[#FFEAE9] transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly`}
                          onClick={() => openModal}
                          
                        >
                          <div className="text-center text-base font-bold text-[#4C4C4C]">
                            Thêm Vào Giỏ Hàng
                          </div>
                          <Cart />
                        </div>
                      )}
                    </a>
                    <a onClick={muti}>
                      {Logined ? (
                        <div
                          className={`cursor-pointer flex items-center w-[268px] rounded-md h-[58px] hover:bg-[#ff6d65]
   transition duration-150 bg-[#EA4B48] justify-evenly`}
                          onClick={() => {
                            if (isSoldOut) return;
                            return addProduct(Number(id), quantity, true);
                          }}
                        >
                          <p className="text-center text-base font-bold text-white ">
                            Mua ngay
                          </p>
                        </div>
                      ) : (
                        <div
                          className={`cursor-pointer flex items-center w-[268px] rounded-md h-[58px] hover:bg-[#ff6d65]
   transition duration-150 bg-[#EA4B48] justify-evenly`}
                          onClick={() => {
                            openModal;
                          }}
                        >
                          <p className="text-center text-base font-bold text-white ">
                            Mua ngay
                          </p>
                        </div>
                      )}
                    </a>
                    <div>
                      <DialogLogin
                        id={idAddAdmin}
                        onClose={() => closeModal2(idAddAdmin)}
                        onSave={handleSubmit((data: any) => {
                          saveModal(idAddAdmin, data);
                        })}
                        title="Đăng Nhập"
                        body={
                          <>
                            <div className="grid grid-cols-5 gap-8">
                              <div className="col-span-3 ">
                                <div className="flex gap-3  ">
                                  <div className="flex flex-col gap-5 max-lg:gap-2">
                                    <div className="h-[90px] w-[400px]">
                                      <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                          required: {
                                            value: true,
                                            message: "Không để trống",
                                          },
                                          minLength: {
                                            value: 4,
                                            message: "Ít nhất 4 ký tự",
                                          },
                                          // maxLength: {
                                          //   value: ,
                                          //   message:
                                          //     "Nhiều nhất 25 kí tự",
                                          // },
                                          validate: {
                                            // Kiểm tra email có đúng định dạng không
                                            validEmail: (value) =>
                                              /^[A-Z0-9._%±]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(
                                                value
                                              ) || "Email không hợp lệ",
                                          },
                                        }}
                                        render={({ field }) => (
                                          <>
                                            <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                                              Email
                                            </label>
                                            <input
                                              className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                                              placeholder="Nhập vào email của bạn"
                                              value={field.value}
                                              onChange={(e) => {
                                                const reg = /[!#$%^&]/;
                                                const value = e.target.value;
                                                field.onChange(
                                                  value.replace(reg, "")
                                                );
                                              }}
                                              name="email"
                                            />
                                            {errors.email && (
                                              <p className="text-[11px] text-red-700 mt-0">
                                                {errors.email.message}
                                              </p>
                                            )}
                                          </>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-3  ">
                                  <div className="flex flex-col gap-5 max-lg:gap-2">
                                    <div className="h-[90px] w-[400px]">
                                      <Controller
                                        name="password"
                                        control={control}
                                        rules={{
                                          required: {
                                            value: true,
                                            message: "Không để trống",
                                          },
                                          minLength: {
                                            value: 4,
                                            message: "Ít nhất 4 ký tự",
                                          },
                                          maxLength: {
                                            value: 25,
                                            message: "Nhiều nhất 25 kí tự",
                                          },
                                        }}
                                        render={({ field }) => (
                                          <>
                                            <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                                              Mật khẩu
                                            </label>
                                            <input
                                              className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                                              type="password"
                                              placeholder="Nhập vào mật khẩu"
                                              value={field.value}
                                              onChange={(e) => {
                                                const reg = /[!@#$%^&]/;
                                                const value = e.target.value;
                                                field.onChange(
                                                  value.replace(reg, "")
                                                );
                                              }}
                                              name="password"
                                            />
                                            {errors.password && (
                                              <p className="text-[11px] text-red-700 mt-0">
                                                {errors.password.message}
                                              </p>
                                            )}
                                          </>
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              {/* end Mua ngay */}
            </div>
          </div>

          <WarningQuantityCart
            id={idWarningQuantity}
            title={warning}
            onClose={() => closeModal(idWarningQuantity)}
          />

          {/* Sản phẩm của shop */}
          <div className="grid grid-cols-3 mt-24">
            <div className="col-span-1">
              <p className="text-[#4C4C4C] text-xl font-semibold mb-4">
                SẢN PHẨM CỦA SHOP
              </p>
              <div className="flex flex-col space-y-4">
                {logo?.map((items, index) => (
                  <a
                    key={index}
                    href={`${items.linkgoogle}`}
                    className="flex items-center"
                    style={{
                      width: "100%",
                      height: "680px",
                    }}
                  >
                    <img
                      className="object-cover w-full h-full"
                      src={items.image}
                      alt=""
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-11 col-span-2 ">
              <div className="flex flex-wrap gap-3 ">
                {recommandProduct.slice(0, 8).map((items) => {
                  return (
                    <>
                      <DetailRecommandProduct productRecommand={items} />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          {/* end Sản phẩm của shop */}
        </body>
      </Container>
      {/* <div className="border-[1px] border-[#E0E0E0] mt-[-2px]"></div> */}
      <Container>
        {/* chi tiết sản phẩm */}

        <div className="p-5">
          <div className=" shadow-gray-200 rounded-md mt-10 p-10">
            <div className="justify-start gap-6 flex">
              <div>
                <a className="active cursor-pointer font-semibold border-[#1A1A1A] text-2xl">
                  <span className="ml-1">CHI TIẾT SẢN PHẨM</span>
                </a>
              </div>
            </div>
            <div id="descriptions" role="tabpanel">
              <div
                className="pl-[43px] text-[19px] leading-10 break-all shadow-gray-50 rounded-md py-4 bg-white"
                dangerouslySetInnerHTML={{
                  __html: first?.productDetail?.description as any,
                }}
                // style={{ color: 'blue', textDecoration: 'underline' }}
              ></div>
            </div>
          </div>

          <div
            // className={` ${activeTab === "Rating" ? "visible" : "hidden"}`}
            id="Rating"
            role="tabpanel"
          >
            {/* <Rating /> */}
            <div className="mt-10 ">
              <div className=" shadow-gray-100 rounded-md p-10 ">
                <div>
                  <a
                    className="active cursor-pointer font-semibold  border-[#1A1A1A] text-2xl"
                    // onClick={() => handleTabClick("Rating")}
                    // role="tab"
                    aria-selected={activeTab === "Rating" ? "true" : "false"}
                    aria-controls="Rating"
                  >
                    <span className="ml-1">ĐÁNH GIÁ</span>
                  </a>
                </div>
                <div className="grid gap-4 grid-cols-3">
                  {/* Left Comment */}
                  <div className="col-span-2 ">
                    <div>
                      <RatingMap
                        getCommentWhereRating={getCommentWhereRating}
                        setRateAndcomment={setRateAndcomment}
                        handleEditProductRating={handleEditProductRating}
                        rateAndcomment={rateAndcomment!}
                        handleRemoveRating={handleRemoveRating}
                      />
                    </div>
                    {}
                    <div className="mt-10">
                      <ResponsivePagination
                        current={rateAndcomment.currentPage!}
                        total={rateAndcomment.totalRatings!}
                        onPageChange={handlePageChange}
                        maxWidth={500}
                      />
                    </div>
                    {/* ///////////////////////////////////////////////////// */}
                  </div>
                  {/* end Left Comment */}
                  {/* Right rating */}
                  <div>
                    <div
                      className="col-span-1 w-[312px] h-auto p-4 float-right bg-white rounded-md
                        shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                    >
                      <div className="py-5">
                        <p className="text-[#1A1A1A] text-xl text-center font-medium">
                          Tìm Kiếm
                        </p>
                        <div className="rate flex justify-center mt-3">
                          <div className="mt-3">
                            {arrRating.map((item, index) => {
                              return (
                                <RateDetailCMT
                                  key={index}
                                  checked={item.checked}
                                  rating={item.rating}
                                  onChangeFilter={(rating: any) => {
                               
                                    HandleGetCommentWhereRating(rating);
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end Right rating */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-[2px] mt-[70px] border-[#EA4B48]"></div>
      <Container>
        <div className="container my-[60px]">
          <h1 className="text-2xl font-bold mb-[15px]">Gợi ý sản phẩm: </h1>
          <div className="mt-11 col-span-2 ">
            <div className="flex flex-wrap gap-3 ">
              {recommandProduct.map((items) => {
                return (
                  <>
                    <DetailRecommandProduct productRecommand={items} />
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
