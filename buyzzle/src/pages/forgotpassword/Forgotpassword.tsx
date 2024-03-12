import { Images } from "../../assets/ts/index";

// import "./forgotpassword.css";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
function Forgotpassword() {
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsButtonDisabled(true);
    setLoading(true);
    try {
      await axios
        .post("http://localhost:5000/buyzzle/auth/forgotpassword", data)
        .then((_) => {
          toast.success("Kiểm tra email để xác minh tài khoản!", {
            position: "top-right",
            autoClose: 3000,
          });
          setLoading(false);
          setIsButtonDisabled(true);
        });
    } catch (error) {
      setLoading(false);
      setIsButtonDisabled(false);
      toast.warning("Gửi email thất bại", {
        position: "top-right",
        autoClose: 5000,
      });
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
            <h1 className=" login-a ">QUÊN MẬT KHẨU</h1>
            <div className="mb-4">
              <label htmlFor="email" className="login-a4 font-sans">
                Email
              </label>
              <input
                type="text"
                id="email"
                // value={formData.email}
                className="w-full h-[46px] p-2 font-sans login-a4 focus:outline-none focus:ring focus:ring-[#FFAAAF] login-input login-a4"
                placeholder="Email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
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
                <div>Gửi</div>
              )}
            </button>
            <div className="mt-6 text-center">
              <span className="text-gray-600">
                Bạn đã có tài khoản Buyzzle?{" "}
              </span>
              <a href="/login" className="text-black-500 hover:underline font-bold">
                Đăng nhập
              </a>
            </div>
          </form>
        </div>
      </div>
    </body>
  );
}

export default Forgotpassword;
