import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Images } from "../../assets/ts/index";
import "./Register.css";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
export interface FormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
  phonenumber: string;
}
function Register() {
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      name: "",
      confirmpassword: "",
      email: "",
      password: "",
      phonenumber: "",
      username: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const API = "http://localhost:5000/buyzzle/auth/register";
  const onSubmit = handleSubmit(async (data) => {
    setIsButtonDisabled(true);
    setLoading(true);
    try {
      const response = await axios.post(API, data);
      setLoading(false);
      setIsButtonDisabled(true);
      if (response.status === 200) {
        // setLoading(false);
        toast.success(
          "Đăng ký thành công - kiểm tra email của bạn để xác minh tài khoản",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        reset({});
      } else {
        setLoading(true);
        toast.warning("Đăng ký thất bại!", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      setLoading(false);
      setIsButtonDisabled(false);
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        if (responseData.error) {
          const errorMessageUsername = responseData.error.username;
          const errorMessageEmail = responseData.error.email;
          const errorMessagePhoneNumber = responseData.error.phonenumber;
          if (errorMessageUsername == "Tên tài khoản đã tồn tại!") {
            toast.warning("Tên tài khoản đã tồn tại!", {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (errorMessageEmail == "Email đã tồn tại") {
            toast.warning("Email đã tồn tại", {
              position: "top-right",
              autoClose: 5000,
            });
          } else if(errorMessagePhoneNumber == "Số điện thoại không đúng định dạng!") {
            toast.warning("Số điện thoại không đúng định dạng!", {
              position: "top-right",
              autoClose: 5000,
            });
          }else if(errorMessagePhoneNumber == "Số điện thoại đã được sử dụng!") {
            toast.warning("Số điện thoại đã được sử dụng!", {
              position: "top-right",
              autoClose: 5000,
            });
          }
        } else {
          console.log("Lỗi không xác định từ server");
        }
      } else {
        console.error("Lỗi gửi yêu cầu không thành công", error);
      }
    }
  });

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
            <h2>ĐĂNG KÝ</h2>
            <div className="grid grid-cols-5 gap-8">
              <div className="col-span-3 ">
                <div className="flex gap-3 ">
                  <div className="flex flex-col  max-lg:gap-2">
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
                            message: "Ít nhất 6 ký tự",
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
                              placeholder="Nhập vào tên của bạn"
                              value={field.value}
                              type="text"
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
                              Tên tài khoản
                            </label>
                            <input
                              className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                              placeholder="Nhập vào tên tài khoản"
                              value={field.value}
                              type="text"
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
                            value: 6,
                            message: "Ít nhất 6 ký tự",
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

                    <div className="h-[90px] w-[424px]">
                      <Controller
                        name="confirmpassword"
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
                            value: 25,
                            message: "Nhiều nhất 25 kí tự",
                          },
                          validate: (value) =>
                            value === getValues("password") ||
                            "Mật khẩu không khớp",
                        }}
                        render={({ field }) => (
                          <>
                            <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                              Lặp lại mật khẩu
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
                              name="confirmpassword"
                            />
                            {errors.confirmpassword && (
                              <p className="text-[11px] text-red-700 mt-0">
                                {errors.confirmpassword.message}
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
                <div className="flex gap-3 ">
                  <div className="flex flex-col gap-5 max-lg:gap-2">
                    <div className="h-[90px] w-[424px]">
                      <Controller
                        name="phonenumber"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: "Không để trống",
                          },
                          minLength: {
                            value: 10,
                            message: "Ít nhất 10 ký tự",
                          },
                          maxLength: {
                            value: 10,
                            message: "Số điện thoại nhiều nhất 10 kí tự",
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
                Tôi đã đọc và đồng ý với{" "}
                <a className="text-red-600" href="/clause">
                  Điều Khoản
                </a>
              </label>
            </div>
            <button
              type="submit"
              onClick={handleSubmit((formData: any) => {
                onSubmit(formData);
              })}
              disabled={isButtonDisabled}
              className={`w-[424px] h-[49.44px] text-white py-2
              rounded-md transition duration-300 mt-[25px]
              ${!isButtonDisabled ? "bg-[#EA4B48]" : "bg-gray-400"}`}
            >
              {loading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div>Đăng kí</div>
              )}
            </button>
            <div className="mt-6 text-center">
              <span className="text-gray-600">
                Bạn đã có tài khoản Buyzzle?{" "}
              </span>
              <Link
                to={`/login`}
                className="text-[#7088f2] hover:text-[#4255AA] font-semibold items-start"
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

export default Register;
