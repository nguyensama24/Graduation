import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Images } from "../../assets/ts";
import { LoginFormGoogle } from "../../pages/login/Login";
// import { useGoogleLogin } from '@react-oauth/google';
type Props = {
  title: ReactNode;
  body: ReactNode;
  onSave: () => void;
  onClose: () => void;
  id: string;
};

export default function DialogLogin(props: Props) {
  const param = useParams();
  const { title, id, body, onClose, onSave } = props;


  const CustomGoogleLogin = () => {
    const callAPI = async (data: LoginFormGoogle) => {
      localStorage.setItem("user", JSON.stringify(data));
      const API = 'http://localhost:5000/buyzzle/oauth/'
      const API2 = 'http://localhost:5000/buyzzle/oauth/savecookies'
      try {
        const response = await axios.post(API, data)
       
        if (response.status == 200) {
          setTimeout(() => {
            callAPI2(data);
          }, 1000);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status == 400) {
            toast.warning("Email đã tồn tại vui lòng đăng nhập bằng tài khoản đã đăng kí", {
              position: "top-right",
              autoClose: 5000,
            });
          }
          else {
            toast.warning("Lỗi đăng nhập", {
              position: "top-right",
              autoClose: 5000,
            });
          }
        }
      }



      
      const callAPI2 = async (data: LoginFormGoogle) => {

        const response1 = axios.post(API2, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        })
       
      }
      const pathname = window.location.pathname;
      toast.loading("Đang tải vui lòng đợi", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        // className:"z-[10000000000]",
      })

      const loginByGG = true;
      localStorage.setItem("user", (JSON.stringify(data)));
      localStorage.setItem("LoginByGG", (JSON.stringify(loginByGG)))

      setTimeout(() => {
        window.location.href = `${pathname}`;
      }, 3000);


    }
    const handleSuccess = (credentialResponse: any) => {
      if (credentialResponse && credentialResponse.credential) {
        const decoded = jwtDecode<LoginFormGoogle>(credentialResponse.credential);

        const data = {
          email: decoded.email,
          name: decoded.name,
          username: (decoded.email).split('.')[0].trim(),
        }
       
        callAPI(data);

      } else {
        
      }
    };

    const handleError = () => {
      // Your custom error handling logic here
    };

    return (
      <div>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          width="400"
          size="large"
        // type="icon"
        />
      </div>
    );
  };
  return (
    <>
      <dialog id={id} className="modal">
        <ToastContainer></ToastContainer>
        <div className="flex flex-wrap content-center justify-center bg-gray-200 py-10 bg-white relative flex flex-col w-[1000px] p-[10px]  relative">
          <div className="flex shadow-md">
            <div className="flex flex-wrap content-center justify-center rounded-l-md bg-white">
              <div className="w-[455px] p-[20px]">
                <h1 className="text-3xl font-semibold">Đăng nhập</h1>
                <small className="text-gray-400">
                  Xin chào! Vui lòng nhập vào thông tin của bạn
                </small>
                {/* <div className="mt-5"></div> */}

                <div className="mt-4 ">
                  {body}
                  <div className="mb-3 flex flex-wrap content-center">
                    {/* <input id="remember" type="checkbox" className="mr-1 checked:bg-purple-700" /> <label className="mr-auto text-xs font-semibold">Remember for 30 days</label> */}
                    <a
                      href="/forgotpassword"
                      className="text-[#7088f2] hover:text-[#4255AA] text-xs"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>

                  <div className="mb-3">


                    <div className="grid grid-cols-5 gap-8">
                      <div className="col-span-3 ">
                        <div className="flex gap-3  ">
                          <div className="flex flex-col gap-5 max-lg:gap-2">
                            <button
                              className="mb-1.5 block w-[400px] text-center text-white bg-[#EA4B48] hover:bg-[#ab0a07] px-2 py-1.5 rounded-md"
                              onClick={() => onSave()}
                            >
                              Đăng Nhập
                            </button>
                          </div>

                        </div>
                        <div className="flex gap-3  ">
                          <div className="flex flex-col gap-5 max-lg:gap-2 mb-2">
                            <GoogleOAuthProvider clientId="447170837696-uqm2gp31ook1fqnas6rfnn2ne2med3la.apps.googleusercontent.com" >
                              <div><CustomGoogleLogin /></div>
                            </GoogleOAuthProvider>
                          </div>
                        </div>
                        <div className="flex gap-3  ">
                          <div className="flex flex-col gap-5 max-lg:gap-2">
                            <button
                              className="flex flex-wrap justify-center w-[400px] border border-gray-300 hover:border-gray-500 px-2 py-1.5 rounded-md"
                              onClick={() => onClose()}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>

                <div className="text-center">
                  <span className="text-xs text-gray-400 font-semibold">
                    Không có tài khoản?
                  </span>
                  <a
                    href="/register"
                    className="text-xs font-semibold text-[#EA4B48]"
                  >
                    {" "}
                    Đăng kí ngay
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap relative p-[15px]">
              <img src={Images.bgRegisterIcon} alt="bgRegisterIcon" />
              <div className="absolute inset-0 flex items-center ">
                <a className="absolute flex justify-center " href="/">
                  <img
                    src={Images.logoSlogan}
                    alt="logo"
                    width={"50%"}
                    height={"50%"}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
