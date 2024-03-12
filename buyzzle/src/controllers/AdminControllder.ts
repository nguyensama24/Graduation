import axios from "axios";
import { FormValues1 } from "../pages/home/admin/AdminProfile/Components/ChangePassword";
import { FormValues } from "../pages/home/admin/Management/Admin/Admin";
// import { Products } from "../pages/home/User/FilterPage/FiltersPage"
export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_ADMIN_URL || "",
};

export interface AdminModel {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

class AdminController {
  getAdminWhereUsername = async (username: string | undefined) => {
    return await axios
      .get(`${appConfig.apiUrl}/chitietadmin/${username}`)
      .then((res) => {
        return res.data;
      });
  };
  getAllAdmin = async (data: AdminModel) => {
    return await axios
      .post(`${appConfig.apiUrl}/getalladmin`, data)
      .then((res) => {
        return res.data;
      });
  };
  AddAdmin = async (data: FormValues) => {
    return await axios
      .post(`${appConfig.apiUrl}/addadmin`, data)
      .then((res) => {
        return res.data;
      });
  };
  DeleteAdmin = async (id: any) => {
    return await axios
      .delete(`${appConfig.apiUrl}/deleteadmin/${id}`)
      .then((res) => {
        return res.data;
      });
  };
  ChangePasswordAdmin = async (id: any, data: FormValues1) => {
    return await axios
      .post(`${appConfig.apiUrl}/changepassword/${id}`, data)
      .then((res) => {
        return res.data;
      });
  };
}

export const adminController = new AdminController();
