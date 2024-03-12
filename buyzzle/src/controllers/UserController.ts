import axios from "axios";
// import { Products } from "../pages/home/User/FilterPage/FiltersPage"
import { users } from "../pages/home/admin/Management/User/User";
import { LoginForm } from "../pages/home/User/DetailProduct/detailProductPage/DetailsProduct";
import { toast } from "react-toastify";
export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_USER_URL || "",
};
export const appConfigAuth = {
  apiUrl: import.meta.env.VITE_BACKEND_AUTH_URL || "",
};
export interface userModel {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

class UserController {
  Login = async (data: LoginForm) => {
    try {
      return await axios
        .post(`${appConfigAuth.apiUrl}/login`, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
           
            toast.success("Đăng nhập thành công", {
              position: "top-right",
              autoClose: 5000,
            });

          } else {
           
            toast.error("Đăng nhập thất bại", {
              position: "top-right",
              autoClose: 5000,
            });
          }
          return res.data;
        });
    } catch (error) {
      
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
      
        // Kiểm tra xem trong dữ liệu phản hồi có thuộc tính 'error' không
        if (responseData) {
          //   const errorMessage = responseData.error.password;
          if(responseData == "Sai mật khẩu"){
           
            toast.error("Sai mật khẩu", {
              position: "top-right",
              autoClose: 5000,
            });
          }
          if(responseData == "Sai email"){
           
            toast.error("Tài khoản không tồn tại", {
              position: "top-right",
              autoClose: 5000,
            });
          }
          
        } else {
        
          toast.error("Lỗi không xác định từ server", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } else {
        console.error("Lỗi gửi yêu cầu không thành công", error);
      }
    }

  }

  getUserWhereUsername = async (username: string | undefined) => {
    return await axios
      .get(`${appConfig.apiUrl}/chitietuser/${username}`)
      .then((res) => {
        return res.data;
      });
  };

  getUserWhereUsername2 = async (username: string | undefined) => {
    return await axios
      .get(`${appConfig.apiUrl}/getpaymentaddress/${username}`)
      .then((res) => {
        return res.data;
      });
  };

  getAllUser = async (data: userModel) => {
    return await axios.post(`${appConfig.apiUrl}/alluser`, data).then((res) => {
      return res.data as users[];
    });
  };
  deleteUser = async (id: number) => {
    return await axios
      .delete(`${appConfig.apiUrl}/deleteregister/${id}`)
      .then((res) => {
        return res.data;
      });
  };
  getStatusUser = async (username: string | undefined) => {
    return await axios
      .get(`${appConfig.apiUrl}/getaccountstatus/${username}`)
      .then((res) => {
        return res.data;
      });
  };
  CheckToken = async () => {
    const instance = axios.create({
      withCredentials: true,
    });

    return await instance
      .post(`${appConfigAuth.apiUrl}/1`)
      .then((res) => {
        return res.data;

      })
  };
  CheckRefreshToken = async () => {
    try {
      const instance = axios.create({
        withCredentials: true,
      });
    
      return await instance
        .post(`${appConfigAuth.apiUrl}/refresh`)
        .then((res) => {
          return res.data;
        })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 300) {
     
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("nameUser");
          localStorage.removeItem("idUser");
          localStorage.removeItem("avatarUser");
          alert("Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại để tiếp tục!");
          window.location.href = "/";
        }

      }
    }

  };
}

export const userController = new UserController();
