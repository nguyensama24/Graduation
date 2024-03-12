import { useEffect, useState } from "react";
// import LogoWeb from "../../Assets/TSX/LogoWeb";
// import { localStorage } from 'localStorage';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import "./AdminLogin.css";
// import { schema } from "../../utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as yup from "yup";
import { Images } from "../../../../assets/ts"
function LoginAdmin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Vui lòng nhập email"),

    password: yup.string().required("Vui lòng nhập mật khẩu"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    secureLocalStorage.removeItem("admin");
  }, []);

  const API = "http://localhost:5000/admin/login";

  const onSubmit = handleSubmit(async (data) => {
    setIsButtonDisabled(true);
      setLoading(true);
    try {
      const response = await axios.post(API, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Đăng nhập thành công", {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
        setIsButtonDisabled(true);
        // localStorage.removeItem("user");

        const UserData = {
          username: response.data.username,
          email: response.data.email,
          name: response.data.name,
          phonenumber: response.data.phonenumber,
          dateofbirth: response.data.dateofbirth,
          sex: response.data.sex,
        };

        secureLocalStorage.setItem("admin", UserData);

        setTimeout(() => {
          window.location.href = "/admin/ListproductsAdmin";
        }, 2000);
      } else {
        toast.warning("Đăng nhập thất bại vui lòng kiểm tra lại tài khoản hoặc mật khẩu", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      setLoading(false);
      setIsButtonDisabled(false);
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        // Kiểm tra xem trong dữ liệu phản hồi có thuộc tính 'error' không
        if (responseData) {
          //   const errorMessage = responseData.error.password;
          toast.warning("Đăng nhập thất bại vui lòng kiểm tra lại tài khoản hoặc mật khẩu", {
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
  });

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
          <form onSubmit={onSubmit} className="registration-form">
            <h1 className=" login-a text-[40px]">ĐĂNG NHẬP ADMIN</h1>
            <div className="mb-4">
              <label htmlFor="email" className="login-a4 font-sans">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                // value={formData.email}
                className="w-full h-[46px] p-2 font-sans login-a4 focus:outline-none focus:ring focus:ring-[#FFAAAF] login-input login-a4"
                placeholder="Tên đăng nhập"
                {...register("username")}
              />
              {errors.username && (
                <span className="text-red-500 text-sm">
                  {errors.username.message}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="login-a4 font-sans">
                Mật khẩu
              </label>
              <div className="relative flex ">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  // value={formData.password}
                  className="w-full h-[46px] p-2 font-sans login-a4 focus:outline-none focus:ring focus:ring-[#FFAAAF] login-input login-a4"
                  placeholder="Mật khẩu"
                  {...register("password")}
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 cursor-pointer"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 cursor-pointer"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
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
   
          </form>
        </div>
      </div>
    </body>
  );
}

export default LoginAdmin;
