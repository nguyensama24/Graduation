import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BlueMedium from "../../../../assets/SVG/LetterPayment/BlueMedium";
import BlueMediumSmall from "../../../../assets/SVG/LetterPayment/BlueMediumSmall";
import BlueRight from "../../../../assets/SVG/LetterPayment/BlueRight";
import PinkMedium from "../../../../assets/SVG/LetterPayment/PinkMedium";
import PinkMediumSmall from "../../../../assets/SVG/LetterPayment/PinkMediumSmall";
import PinkRight from "../../../../assets/SVG/LetterPayment/PinkRight";
import { Images } from "../../../../assets/ts";
import Location from "../../../../assets/TSX/Location";
import Voucher from "../../../../assets/TSX/Voucher";
import { userController } from "../../../../controllers/UserController";
import DialogAddress from "../../../../helper/Dialog/DialogAddress";
import { numberFormat } from "../../../../helper/Format";
import { CartItem } from "../../../../model/CartModel";
import { VoucherModel } from "../../../../model/VoucherModel";
import Container from "../../../../components/container/Container";

import { voucherControllers } from "../../../../controllers/VoucherControllers";
import PaymentBtn from "./PaymentBtn";

type FormValues = {
  name: string;
  address: string;
  addresstype: string;
  specificaddress: string;
  phonenumber: string;
};

export type PaymentMethod = "stripe" | "cash";

const provinces = [
  `An Giang`,
  "Bà Rịa - Vũng Tàu",
  "Bạc Liêu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bắc Ninh",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên-Huế",
  "Tiền Giang",
  "TP. HCM",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

const defaultVoucher: VoucherModel = {
  id: 0,
  discount: 0,
  code: "",
  endDay: new Date(),
  quantity: 0,
  startDay: new Date(),
};

interface PaymentModel {
  id: number;
  icon: string;
  title: string;
  type: PaymentMethod;
}

const paymentMethods: PaymentModel[] = [
  {
    id: 1,
    icon: Images.visa,
    title: "Thanh toán bằng thẻ tín dụng",
    type: "stripe",
  },
  {
    id: 2,
    icon: Images.nhanHang,
    title: "Thanh toán khi nhận hàng",
    type: "cash",
  },
];

export default function CheckOut() {
  const idModal = "checkout";
  const idModalUpdate = "my_modal_update";

  const [note, setNote] = useState("");
  const [invoice, setInvoice] = useState(false);

  const [idUpdateAddress, setIdUpdateAddress] = useState<string>("0");

  const [user, setUser] = useState<FormValues>({} as FormValues);
  const [itemVoucher, setItemVoucher] = useState<VoucherModel>(defaultVoucher);
  const [username, setUsername] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("stripe");

  const [getVoucher, setGetVoucher] = useState<VoucherModel[]>([]);

  const localCart = sessionStorage.getItem("cartBuyzzle");
  const listLocalCart: CartItem[] =
    localCart == null ? [] : JSON.parse(localCart);

  // const id = localStorage.getItem("idUser");
  const idUser = idUpdateAddress == null ? 0 : JSON.parse(idUpdateAddress);

  const {
    control,
    handleSubmit,
    clearErrors,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      address: "",
      specificaddress: "",
      addresstype: "",
      name: "",
      phonenumber: "",
    },
  });

  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  const closeModal = async (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      clearErrors();
      setNull();
      modal.close();
    }
  };
  const saveModal = async (formData: FormValues) => {
    try {
      const data = {
        id: idUser,
        name: formData.name,
        address: formData.address,
        specificaddress: formData.specificaddress,
        addresstype: formData.addresstype,
        phonenumber: formData.phonenumber,
      };
      sendToDatabase(data);

    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        if (responseData) {
         
          toast.warning(responseData, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          console.log("Lỗi không xác định từ server");
        }
      } else {
        console.error("Lỗi gửi yêu cầu không thành công", error);
      }
    }
  };
  const openUpadate = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      reset({
        address: user.address,
        name: user.name,
        addresstype: user.addresstype,
        specificaddress: user.specificaddress,
        phonenumber: user.phonenumber
      });
      modal.showModal();
    }
  };

  const getUserAddress = async () => {
    const user = localStorage.getItem("user");
    if (user != null) {
      const userData = JSON.parse(user);
      const username = userData.username;
      setUsername(username);
      await userController
        .getUserWhereUsername2(username)
        .then((res) => {
  
          return res;
        })
        .then((res) => {
          reset({
            name: res.username,
            addresstype: res.addresstype,
            address: res.address,
            specificaddress: res.specificaddress,
            phonenumber: res.phonenumber,
          });
          setUser(res);
          setIdUpdateAddress(res.id);
          if (res.specificaddress == null || res.phonenumber == null) {
            openModal(idModal);
          }
        })
        .catch((error) => {
          console.log(
            "🚀 ~ file: Detailproducts.tsx:27 ~ .then ~ error:",
            error
          );
        });
    } else {
      console.log("Error");
    }
  };

  const setNull = () => {
    reset({});
  };

  const calculatePrice = () => {
    let totalCart = 0;
    for (let i = 0; i < listLocalCart.length; i++) {
      const element = listLocalCart[i];
      totalCart += element.quantity * element.product.sellingPrice;
    }
    return totalCart;
  };

  const API = `http://localhost:5000/buyzzle/user/paymentaddress/${username}`;

  const sendToDatabase = async (formData: any) => {

    try {
      const response1 = await axios.put(API, formData).then(() => {
        getUserAddress();
        closeModal(idModalUpdate);
        closeModal(idModal);
      });
      return response1;
    } catch (error) {
      throw error;
    }
  };

  const getVoucherUser = async () => {
    await voucherControllers.GetUserSavedVoucher().then((res) => {
      setGetVoucher(res);
    });
  };

  useEffect(() => {
    getVoucherUser();
    getUserAddress();
  }, []);
  const CheckToken = async () => {
    userController.CheckToken().then((res) => {

    });
  }
  const CheckRefreshToken = async () => {
    userController.CheckRefreshToken().then((res) => {

    });
  }
  const muti = () => {
    CheckToken();

    CheckRefreshToken();
    
  }
  return (
    <>
      <Container>
        <div className="body-filter container mx-auto">
          <div className="grid grid-cols-5 gap-6">
            <div className="mt-9 col-span-5 max-2xl:col-span-5">
              <h1 className="text-[32px] font-bold mb-4 max-lg:text-[28px] max-[870px]:text-2xl max-[769px]:text-xl">
                Xác Nhận Thanh Toán
              </h1>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 flex flex-col gap-2">
                  <div className=" shadow">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((element) => {
                        return (
                          <div key={element} className="flex gap-3">
                            <PinkMediumSmall />
                            <BlueMediumSmall />
                          </div>
                        );
                      })}
                      <PinkMediumSmall />
                    </div>
                    <div className="flex flex-col gap-3 p-[26px]">
                      <div className="flex justify-between">
                        <div className="flex gap-1 items-center">
                          <Location />
                          <p className="text-[#EA4B48] font-medium text-sm max-[870px]:text-xs">
                            Địa chỉ nhận hàng
                          </p>
                        </div>
                        <button
                          onClick={() => openModal(idModal)}
                          className="text-[10px] text-[#5D5FEF] font-semibold max-[870px]:text-[8px]"
                        >
                          Thay đổi
                        </button>
                      </div>
                      <div>
                        <p className="text-sm font-normal text-[#1A1A1A] max-[870px]:text-xs">
                          <span className="font-bold">
                            {user.name}, {user.phonenumber}{" "}
                          </span>{" "}
                          {user.specificaddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((element) => {
                        return (
                          <div key={element} className="flex gap-3">
                            <PinkMedium />
                            <BlueMedium />
                          </div>
                        );
                      })}
                      <PinkMedium />
                    </div>
                  </div>
                  <div>
                    <DialogAddress
                      id={idModal}
                      title="Địa Chỉ Của Tôi"
                      onClose={() => closeModal(idModal)}
                      onSave={() => closeModal(idModal)}
                      body={
                        <>
                          <div className="border-b-[1px] pb-4 mb-4 flex gap-1">
                            {/* <div className="flex items-center mr-4 justify-start ">
                                             <input
                                                checked
                                                type="radio"
                                                name="colored-radio"
                                                id="orange-radio"
                                                className="appearance-none h-5 w-5 border border-[#CCCCCC] rounded-full 
                                                                checked:bg-[#EA4B48] checked:scale-75 transition-all duration-200 peer "
                                             />
                                             <div
                                                className="h-5 w-5 absolute rounded-full pointer-events-none
                                                                peer-checked:border-[#EA4B48] peer-checked:border-2"
                                             />
                                          </div> */}
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between w-full">
                                <div className="flex items-center gap-3">
                                  <p className="text-sm font-medium text-[#1A1A1A]">
                                    {user.name}
                                  </p>
                                  <p className="text-[10px] text-[#4C4C4C]">
                                    {user.phonenumber}
                                  </p>
                                </div>
                                <div className="">
                                  <button
                                    onClick={() => openUpadate(idModalUpdate)}
                                    className="text-[#5D5FEF] text-[10px]"
                                  >
                                    Cập nhật
                                  </button>
                                </div>
                              </div>
                              <div>
                                <p className="text-[13px] font-normal text-[#4C4C4C]">
                                  {user.specificaddress}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* <div className="border-b-[1px] pb-4 mb-4 flex gap-1 items-center justify-center">
                                          <button
                                             onClick={() =>
                                                openUpadate(idModalUpdate)
                                             }
                                             className="flex gap-1"
                                          >
                                             <Address />
                                             <p className="text-sm text-[#4C4C4C]">
                                                Thêm địa chỉ mới
                                             </p>
                                          </button>
                                       </div> */}
                        </>
                      }
                    />
                  </div>

                  <div>
                    <DialogAddress
                      id={idModalUpdate}
                      title="Cập Nhật Địa Chỉ"
                      onClose={() => closeModal(idModalUpdate)}
                      onSave={handleSubmit((data: any) => {
                        saveModal(data);
                      })}
                      body={
                        <>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-around gap-5">
                              <div className="w-[55%]">
                                <Controller
                                  control={control}
                                  name="name"
                                  rules={{
                                    required: {
                                      value: true,
                                      message:
                                        "Bạn phải nhập thông tin cho trường dữ liệu này!",
                                    },
                                  }}
                                  render={({ field }) => (
                                    <>
                                      <label
                                        htmlFor="username"
                                        className="text-[#4C4C4C] text-sm font-semibold"
                                      >
                                        Họ và tên
                                      </label>
                                      {/* input addNameProducts */}
                                      <input
                                        className={`focus:outline-none text-[#333333] text-base placeholder-[#7A828A]
                                                   rounded-[6px] px-[10px] py-[10.5px] w-[100%] mt-2
                                                  ${!!errors.name
                                            ? "border-[2px] border-red-900"
                                            : "border-[1px] border-[#FFAAAF]"
                                          }`}
                                        placeholder="Họ và tên"
                                        value={field.value}
                                      />
                                      {!!errors.name && (
                                        <p className="text-red-700 mt-2">
                                          {errors.name.message}
                                        </p>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                              <div className="w-[43%]">
                                <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px]">
                                  Loại đỉa chỉ*
                                </p>
                                <div className=" w-[100%] flex border-[1px] border-[#FFAAAF] rounded-[6px] items-center">
                                  <Controller
                                    name="addresstype"
                                    control={control}
                                    rules={{
                                      required: {
                                        value: true,
                                        message: "Vui lòng chọn",
                                      },
                                    }}
                                    render={({ field }) => (
                                      <select
                                        className="w-[100%] p-2.5 text-gray-500 bg-white py-[14px] outline-none rounded-[6px]"
                                        value={field.value}
                                        {...register("addresstype")}
                                      >
                                        <option value="Địa chỉ văn phòng">
                                          Địa chỉ văn phòng
                                        </option>
                                        <option value="Địa chỉ công ty">
                                          Địa chỉ công ty
                                        </option>
                                        <option value="Nhà riêng">
                                          Nhà riêng
                                        </option>
                                      </select>
                                    )}
                                  />
                                </div>
                                {!!errors.addresstype && (
                                  <p className="text-red-700 mt-2">
                                    {errors.addresstype.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="w-[100%] mt-2">
                              <Controller
                                control={control}
                                name="phonenumber"
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Hãy nhập số điện thoại",
                                  },
                                  maxLength: {
                                    value: 10,
                                    message: "Không quá 10 số",
                                  },
                                  minLength: {
                                    value: 10,
                                    message: "Số điện thoại phải là 10 số",
                                  }
                                }}
                                render={({ field }) => (
                                  <>
                                    <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px]">
                                      Số điện thoại*
                                    </p>
                                    <input
                                      className={`focus:outline-none text-[#333333] text-base placeholder-[#7A828A]
                                                   rounded-[6px] px-[10px] py-[12px] w-[100%]
                                                  ${!!errors.phonenumber
                                          ? "border-[2px] border-red-900"
                                          : "border-[1px] border-[#FFAAAF]"
                                        }`}
                                      placeholder="Số điện thoại"
                                      onChange={(e) => {
                                        const reg = /[a-zA-Z!@#$e]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                      value={field.value}
                                    />
                                    {!!errors.phonenumber && (
                                      <p className="text-red-700 mt-2">
                                        {errors.phonenumber.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>

                            <div className="w-[100%] mt-2">
                              <Controller
                                control={control}
                                name="address"
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Vui lòng chọn",
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px]">
                                      Địa chỉ*
                                    </p>
                                    <div className="w-[100%] flex border-[1px] border-[#FFAAAF] rounded-[6px] items-center">
                                      <select
                                        className="w-[100%] p-2.5 text-gray-500 bg-white py-[14px] outline-none rounded-[6px]"
                                        value={field.value}
                                        {...register("address")}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          const reg = /[!@#$%^&*]/;
                                          field.onChange(
                                            value.replace(reg, "")
                                          );
                                        }}
                                      >
                                        {provinces.map((province, index) => (
                                          <option key={index} value={province}>
                                            {province}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    {!!errors.address && (
                                      <p className="text-red-700 mt-2">
                                        {errors.address.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>

                            <div className="flex flex-col border-b-[1px] pb-4 my-2 gap-2">
                              <Controller
                                name="specificaddress"
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
                                    value: 200,
                                    message: "Nhiều nhất 200 ký tự",
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <p className="text-[#4C4C4C] text-sm font-semibold">
                                      Địa chỉ cụ thể*
                                    </p>
                                    <input
                                      className={`focus:outline-none text-[#333333] text-base placeholder-[#7A828A]
                                                   rounded-[6px] px-[10px] py-[12px] w-[100%]
                                                  ${!!errors.specificaddress
                                          ? "border-[2px] border-red-900"
                                          : "border-[1px] border-[#FFAAAF]"
                                        }`}
                                      placeholder="Địa chỉ cụ thể"
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        const reg = /[!@#$%^&*]/;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                      value={field.value}
                                    />
                                    {!!errors.specificaddress && (
                                      <p className="text-red-700 mt-2">
                                        {errors.specificaddress.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        </>
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-4 px-[26px] py-[10px] bg-[#F2F2F2]">
                      <h4 className="col-span-2 font-normal text-[#1A1A1A] text-sm max-[870px]:text-xs">
                        SẢN PHẨM
                      </h4>
                      <h4 className="col-span-1 font-normal text-[#1A1A1A] text-sm text-center max-[870px]:text-xs">
                        GIÁ
                      </h4>
                      <h4 className="col-span-1 font-normal text-[#1A1A1A] text-sm text-center max-[870px]:text-xs">
                        TỔNG
                      </h4>
                    </div>

                    {listLocalCart.map((e) => {
                      return (
                        <>
                          <div className="grid grid-cols-4 px-[26px] py-[16px] items-center bg-[#FFFFFF] shadow">
                            <div className="col-span-2 text-sm flex gap-4 items-center">
                              <img
                                className="w-[70px] h-[70px] object-contain"
                                src={e.product.ProductImage[0].url}
                                alt=""
                              />
                              <div>
                                <p className="text-base text-[#393939] max-[870px]:text-[13px]">
                                  {e.product.name}
                                </p>
                                <p className="text-sm text-[#1A1A1A] max-[870px]:text-[13px]">
                                  SL:{" "}
                                  <span className="text-[#4C4C4C]">
                                    x{e.quantity}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="col-span-1 flex gap-2 justify-around items-center">
                              <p className="font-medium text-[#7A828A] text-sm line-through max-[870px]:text-[13px]">
                                {numberFormat(e.product.price)}
                              </p>
                              <p className="font-medium text-[#1A1A1A] text-base max-[870px]:text-[13px]">
                                {numberFormat(e.product.sellingPrice)}
                              </p>
                            </div>
                            <div className="col-span-1">
                              <p className="font-medium text-[#EA4B48] text-base text-center max-[870px]:text-[13px]">
                                {numberFormat(
                                  e.quantity * e.product.sellingPrice
                                )}
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-1 flex flex-col gap-5 p-[20px] shadow">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[20px] font-bold max-lg:text-lg max-[870px]:text-base">
                      Thông tin đơn hàng
                    </h3>
                    <div className="flex gap-2">
                      <PinkRight />
                      <BlueRight />
                      <PinkRight />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-[#1A1A1A] max-[870px]:text-[13px]">
                        Ghi chú (
                        <span className="text-[#7A828A]">
                          Cho người bán hàng
                        </span>
                        ):{" "}
                      </p>
                      <textarea
                        className="w-full h-28 outline-0 border-[1px] border-[#FFAAAF] rounded-md p-3
                                                    max-lg:text-[10px]"
                        placeholder="Nhập ghi chú cho người bán hàng."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Voucher />
                    <select
                      onChange={(e) => {
                        setItemVoucher(JSON.parse(e.target.value));
                      }}
                      className="outline-none w-full text-[#EA4B48] items-center border-[#FFAAAF] bg-[#fff] border-[1px] py-[8px] rounded-md max-lg:py-[4px]"
                    >
                      <option value={JSON.stringify(defaultVoucher)}>
                        -- Chọn mã giảm giá --
                      </option>
                      {getVoucher.map((e) => {
                        return (
                          <>
                            <option value={JSON.stringify(e)}>
                              {e.code} - {e.discount}%
                            </option>
                          </>
                        );
                      })}
                    </select>
                  </div>

                  <div className="flex flex-col gap-[18px]">
                    <div className="flex justify-between">
                      <p className="text-sm text-[#393939] max-[870px]:text-[11px]">
                        Tổng Giá Sản Phẩm:{" "}
                      </p>
                      <p className="text-base text-[#EA4B48] max-[870px]:text-[11px]">
                        {numberFormat(calculatePrice())}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-[#393939] max-[870px]:text-[11px]">
                        Phí vận chuyển{" "}
                      </p>
                      <div className="flex gap-1">
                        <p className="text-sm text-[#EA4B48] max-[870px]:text-[12px]">
                          {numberFormat(30000)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-[#393939] max-[870px]:text-[11px]">
                        Giảm{" "}
                      </p>
                      <div className="flex gap-1">
                        <p className="text-sm text-[#EA4B48] max-[870px]:text-[11px]">
                          {
                            itemVoucher.discount == 0 ? (
                              numberFormat(
                                calculatePrice() * (itemVoucher.discount / 100)
                              )
                            ) : (
                              <p>
                                -{" "}
                                {numberFormat(
                                  calculatePrice() *
                                  (itemVoucher.discount / 100)
                                )}
                              </p>
                            )
                            //  ? numberFormat(
                            //      calculatePrice() * (itemVoucher.discount / 100)
                            //    )
                            //  : numberFormat(0)}
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-[#393939] max-[870px]:text-[11px]">
                        Tổng Thanh Toán:{" "}
                      </p>
                      <p className="text-xl text-[#EA4B48] max-[870px]:text-sm">
                        {itemVoucher.discount
                          ? numberFormat(
                            calculatePrice() -
                            calculatePrice() *
                            (itemVoucher.discount / 100) +
                            30000
                          )
                          : numberFormat(calculatePrice() + 30000)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-base text-[#4C4C4C] font-bold max-[870px]:text-[13px]">
                      Phương Thức Thanh Toán
                    </h4>
                    <div className="flex flex-col gap-[10px]">
                      {paymentMethods.map((element) => {
                        return (
                          <>
                            <div
                              key={element.id}
                              className="flex gap-3 items-center"
                            >
                              <input
                                className="max-lg:w-[10px] accent-[#EA4B48]"
                                name="choose"
                                type="radio"
                                value={element.type}
                                checked={selectedPaymentMethod === element.type}
                                onChange={() => {
                                  setSelectedPaymentMethod(element.type);
                                }}
                              />
                              <div className="w-6">
                                <img
                                  className="w-full h-full object-contain"
                                  src={element.icon}
                                  alt=""
                                />
                              </div>
                              <p
                                className={`max-lg:text-[10px] ${selectedPaymentMethod === element.type
                                  ? "inherit"
                                  : "text-[#9c9c9c]"
                                  } cursor-pointer`}
                                onClick={() => {
                                  setSelectedPaymentMethod(element.type);
                                }}
                              >
                                {element.title}
                              </p>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      className="w-[14px] h-[14px] accent-[#EA4B48]"
                      type="checkbox"
                      checked={invoice}
                      onChange={(e) => setInvoice(e.target.checked)}
                    />
                    <p
                      className={`text-[15px] max-[870px]:text-[13px] cursor-pointer ${invoice ? `inherit` : `text-[#9c9c9c]`
                        }`}
                      onClick={() => setInvoice(!invoice)}
                    >
                      Xuất hóa đơn
                    </p>
                  </div>
                  <a onClick={muti}>
                    <PaymentBtn
                      idUser={idUser}
                      cartItems={listLocalCart}
                      method={selectedPaymentMethod}
                      voucher={itemVoucher}
                      note={note}
                      invoice={invoice}
                      address={user.specificaddress}
                      name={user.name}
                      phoneNumber={user.phonenumber}
                    />
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
