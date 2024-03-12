import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Images } from "../../../../assets/ts";
import "./Register.css";

import { Controller, useForm } from "react-hook-form";
import { shipperController } from "../../../../controllers/ShipperController";
export interface FormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  dateofbirth: string;
  phonenumber: string;
  sex: string;
  address: string;
  city: string;
}

function RegisterShipper() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors},
  } = useForm<FormValues>({
    mode: "all",
    // defaultValues: UserData1
  });
  const provinces = [
    "Tỉnh/Thành phố, Quận/Huyện, Phường/Xã",
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
  const [sex, setSex] = useState<boolean>();
  const handleSexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSex(JSON.parse(event.target.value));
  };
  const onSubmit = async (formData: FormValues) => {
    formData.sex = JSON.parse(formData.sex);
    console.log("Data Shipper:" + JSON.stringify(formData));
    shipperController
      .registerShipper(formData)
      .then((res) => {
        toast.success("Đăng kí thành công !");
        console.log("res:" + res);
      })
      .catch(() => {
        toast.error("Đăng kí thất bại !");
      });
  };

  return (
    <div className="register-bg flex max-xl:flex-wrap">
      <div className="relative p-4 max-w-[872px] max-xl:mx-auto max-xl:mb-[20px]">
        <img
          src={Images.bgRegisterIcon}
          alt="bgRegisterIcon"
          width={"924px"}
          height={"1083px"}
        />

        <div className="absolute inset-0 flex justify-center items-center ">
          <Link to="/">
            <img
              src={Images.logoSlogan}
              alt="logo"
              width={"90%"}
              height={"90%"}
            />
          </Link>
        </div>
      </div>

      <div className="w-1/2 flex justify-center items-center min-h-screen bg-white ">
        <div className="w-[424px]">
          <form className="registration-form">
            <h2>ĐĂNG KÝ SHIPPER</h2>
            <div className="grid grid-cols-5 gap-8">
              <div className="col-span-3 ">
                <div className="w-[424px] flex justify-between gap-5">
                  <div className="h-[90px] w-[424px]">
                    <Controller
                      name="name"
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
                            Tên
                          </label>
                          <input
                            className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                            placeholder="Nhập vào tên"
                            value={field.value}
                            onChange={(e) => {
                              const reg = /[!@#$%^&]/;
                              const value = e.target.value;
                              field.onChange(value.replace(reg, ""));
                            }}
                            name="name"
                          />
                          {errors.name && (
                            <p className="text-[11px] text-red-700 mt-0">
                              {errors.name.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="h-[90px] w-[424px]">
                    <Controller
                      name="username"
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: "Không để trống",
                        },
                        minLength: {
                          value: 6,
                          message: "Ít nhất 6 ký tự",
                        },
                        maxLength: {
                          value: 12,
                          message: "Nhiều nhất 12 kí tự",
                        },
                      }}
                      render={({ field }) => (
                        <>
                          <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                            Tên tài khoản
                          </label>
                          <input
                            className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                            placeholder="Tên tài khoản"
                            value={field.value}
                            onChange={(e) => {
                              const reg = /[!@#$%^&]/;
                              const value = e.target.value;
                              field.onChange(value.replace(reg, ""));
                            }}
                            name="username"
                          />
                          {errors.username && (
                            <p className="text-[11px] text-red-700 mt-0">
                              {errors.username.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-3 ">
                  <div className="flex flex-col gap-5 max-lg:gap-2">
                    <div className="h-[90px] w-[424px]">
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
                              placeholder="Nhập vào mật khẩu"
                              value={field.value}
                              type="password"
                              onChange={(e) => {
                                const reg = /[!@#$%^&]/;
                                const value = e.target.value;
                                field.onChange(value.replace(reg, ""));
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

                <div className="flex gap-3 ">
                  <div className="flex flex-col gap-5 max-lg:gap-2">
                    <div className="h-[90px] w-[424px]">
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
                              placeholder="Nhập vào Email"
                              value={field.value}
                              onChange={(e) => {
                                const reg = /[!#$%^&]/;
                                const value = e.target.value;
                                field.onChange(value.replace(reg, ""));
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
                <div className="w-[424px] flex justify-between gap-5">
                  <div className="h-[90px] w-[48%]">
                    <Controller
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <>
                          <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                            Thành phố vận chuyển
                          </label>
                          <div
                            className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48] 
                                            `}
                          >
                            <select
                              className="w-[100%] text-gray-500 bg-white outline-none rounded-[6px] dropdown-content"
                              value={field.value}
                              {...register("city")}
                              onChange={(e) => {
                                const value = e.target.value;
                                const reg = /[!@#$%^&*]/;
                                field.onChange(value.replace(reg, ""));
                              }}
                            >
                              {provinces.map((province, index) => (
                                <option key={index} value={province}>
                                  {province}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    />
                  </div>

                  <div className="h-[90px] w-[48%]">
                    <Controller
                      name="address"
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
                            Địa chỉ
                          </label>
                          <input
                            className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                            placeholder="Nhập vào địa chỉ"
                            value={field.value}
                            onChange={(e) => {
                              const reg = /[!@#$%^&]/;
                              const value = e.target.value;
                              field.onChange(value.replace(reg, ""));
                            }}
                            name="address"
                          />
                          {errors.address && (
                            <p className="text-[11px] text-red-700 mt-0">
                              {errors.address.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="w-[424px] flex justify-between">
                  <div className="w-[48%] mb-[15px]">
                    <label
                      htmlFor="name"
                      className="text-[#4C4C4C] text-sm font-medium"
                    >
                      Giới tính:
                    </label>
                    <div className="flex w-[100%] mt-3">
                      <div className="flex items-center w-[33%] gap-1">
                        <div>
                          <h3>Nam</h3>
                        </div>
                        <div className="flex items-center justify-start ">
                          <input
                            type="radio"
                            // name="colored-radio"
                            id="orange-radio1"
                            value="true"
                            {...register("sex")}
                            checked={sex === true}
                            onChange={handleSexChange}
                            className="appearance-none h-6 w-6 border border-[#CCCCCC] rounded-full 
                                        checked:bg-[#EA4B48] checked:scale-75 transition-all duration-200 peer "
                          />
                          <div
                            className="h-6 w-6 absolute rounded-full pointer-events-none
                                        peer-checked:border-[#EA4B48] peer-checked:border-2"
                          />
                        </div>
                      </div>
                      <div className="flex items-center w-[33%] ml-[30px] gap-1">
                        <div>
                          <h3>Nữ</h3>
                        </div>
                        <div className="flex items-center justify-start ">
                          <input
                            type="radio"
                            // name="colored-radio"
                            id="orange-radio2"
                            value="false"
                            {...register("sex")}
                            checked={sex === false}
                            onChange={handleSexChange}
                            className="appearance-none h-6 w-6 border border-[#CCCCCC] rounded-full
checked:bg-[#EA4B48] checked:scale-75 transition-all duration-200 peer "
                          />
                          <div
                            className="h-6 w-6 absolute rounded-full pointer-events-none
                                        peer-checked:border-[#EA4B48] peer-checked:border-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" h-[90px] w-[424px]">
                    <Controller
                      name="phonenumber"
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
                            Số điện thoại
                          </label>
                          <input
                            className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                            placeholder="Nhập vào số điện thoại"
                            value={field.value}
                            onChange={(e) => {
                              const reg = /[!#$%^&]/;
                              const value = e.target.value;
                              field.onChange(value.replace(reg, ""));
                            }}
                            name="phonenumber"
                          />
                          {errors.phonenumber && (
                            <p className="text-[11px] text-red-700 mt-0">
                              {errors.phonenumber.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="w-[424px] mb-3">
                  <Controller
                    control={control}
                    name="dateofbirth"
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
                          htmlFor="name"
                          className="text-[#4C4C4C] text-sm font-medium"
                        >
                          Ngày sinh
                        </label>
                        <input
                          className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                  rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                  max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]`}
                          type="date"
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            const reg = /[!@#$%^&*]/;
                            field.onChange(value.replace(reg, ""));
                          }}
                        />
                        {!!errors.dateofbirth && (
                          <p className="text-red-700 mt-2">
                            {errors.dateofbirth.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                name="termsAgreement"
                className="custom-checkbox"
                required
              />
              <label htmlFor="termsAgreement">
                Tôi đã đọc và đồng ý với <a href="#">Điều Khoản</a>
              </label>
            </div>
            <button
              onClick={handleSubmit((formData: any) => {
                onSubmit(formData);
              })}
              type="submit"
              className="w-[424px] bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 mt-[75px]"
            >
              Đăng ký
            </button>
            {/* <ToastContainer
              position="top-right"
              // Custom theme for the toast container
              theme="dark"
            /> */}
            <div className="flex items-center my-4">
              <div className="grow h-px bg-slate-300"></div>
              <div className="mx-2 text-white-500">Hoặc</div>
              <div className="grow h-px bg-slate-300"></div>
            </div>
            <div className="flex justify-center space-x-3">
              <button className="flex items-center justify-center w-12 h-12 text-white rounded-full border-2">
                <img src={Images.logoGoogle} alt="Google" className="w-6 h-6" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 text-white rounded-full border-2">
                <img src={Images.logoApple} alt="Apple" className="w-6 h-6" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 text-white rounded-full border-2">
                <img src={Images.logoFace} alt="Facebook" className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-6 text-center">
              <span className="text-gray-600">
                Bạn đã có tài khoản Buyzzle?{" "}
              </span>
              <Link
                to={`/login`}
                className="text-black font-semibold items-start"
              >
                Quay lại trang đăng nhập{" "}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterShipper;
