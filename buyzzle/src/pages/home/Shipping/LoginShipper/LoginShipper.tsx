import { Images } from "../../../../assets/TS/index";

// import { localStorage } from 'localStorage';
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import LogoApple from "../../../../assets/PNG/lgApple.png";
import LogoFace from "../../../../assets/PNG/lgFace.png";
import LogoGoogle from "../../../../assets/PNG/lgG.png";
import { shipperController } from "../../../../controllers/ShipperController";
import "./Login.css";
import { useState } from "react";
export interface FormLoginValues {
  username: string;
  password: string;
}
function LoginShipper() {
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<FormLoginValues>({
    mode: "all",
    // defaultValues: UserData1
  });
  const onSubmit = async (formData: FormLoginValues) => {
    setIsButtonDisabled(true);
    setLoading(true);
    shipperController
      .loginShipper(formData)
      .then((res) => {
        setLoading(false);
        setIsButtonDisabled(true);
        toast.success("Đăng nhập thành công !");
     
        // localStorage.removeItem("user");
        const jsonString: string = JSON.stringify(res);
        const jsonObject = JSON.parse(jsonString);
        const username = jsonObject.username;
   
       
        const UserData = { username };
        // const Token = {accessToken};
        secureLocalStorage.setItem("shippername", JSON.stringify(UserData));
        // .setItem('admin', UserData);
        setTimeout(() => {
          window.location.href = "/shipping/management";
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        setIsButtonDisabled(false);
        toast.error("Đăng nhập thất bại !");
      });
  };

  return (
    <body className="login-bg flex">
      <div className="h-1083px w-963px p-4 relative">
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
      <div className="w-1/2 flex justify-center items-center min-h-screen bg-white">
        <div className="w-[424px]">
          <form className="registration-form">
            <h1 className="login123-a">ĐƠN VỊ VẬN CHUYỂN</h1>
            <div className="grid grid-cols-5 gap-8">
              <div className="col-span-3 ">
                <div className="flex gap-3 ">
                  <div className="flex flex-col gap-5 max-lg:gap-2">
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
                          // maxLength: {
                          //   value: ,
                          //   message:
                          //     "Nhiều nhất 25 kí tự",
                          // },
                          // validate: { // Kiểm tra email có đúng định dạng không
                          //    validEmail: (value) => /^[A-Z0-9._%±]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(value) || "Email không hợp lệ",

                          // },
                        }}
                        render={({ field }) => (
                          <>
                            <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                              Tên đăng nhập
                            </label>
                            <input
                              className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                              placeholder="Tên tài khoản"
                              value={field.value}
                              onChange={(e) => {
                                const reg = /[!#$%^&]/;
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
                              placeholder="Mật khẩu"
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
              </div>
            </div>

            <div className="mb-4 text-right">
              {/* <a
                  href="/forgotpassword"
                  className="text-[#7088f2] hover:text-[#4255AA] "
                >
                  Quên mật khẩu?
                </a> */}
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
                <div>Đăng nhập</div>
              )}
            </button>
            {/* <button
              onClick={handleSubmit((formData: any) => {
                onSubmit(formData);
              })}
              type="submit"
              className="w-[424px] h-[49.44px] bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-300 mt-[25px]"
            >
              Đăng Nhập
            </button> */}
            {/* <div className="flex items-center my-4">
              <div className="grow h-px bg-slate-300"></div>
              <div className="mx-2 text-white-500">Hoặc</div>
              <div className="grow h-px bg-slate-300"></div>
            </div> */}
            {/* <div className="flex justify-center space-x-3">
              <button className="flex items-center justify-center w-12 h-12 text-white rounded-full border-2">
                <img src={LogoGoogle} alt="Google" className="w-6 h-6" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 text-white rounded-full border-2">
                <img src={LogoApple} alt="Apple" className="w-6 h-6" />
              </button>
              <button className="flex items-center justify-center w-12 h-12 text-white rounded-full border-2">
                <img src={LogoFace} alt="Facebook" className="w-6 h-6" />
              </button>
            </div> */}
            {/* <div className="mt-6 text-center">
              <span className="text-gray-600">
                Bạn chưa có tài khoản Buyzzle?{" "}
              </span>
              <a
                href="/register"
                className="text-black-500 hover:underline font-bold"
              >
                Đăng ký
              </a>
            </div> */}
          </form>
        </div>
      </div>
    </body>
  );
}

export default LoginShipper;
