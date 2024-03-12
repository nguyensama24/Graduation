import axios from "axios";
import { FormLoginValues } from "../pages/home/Shipping/loginShipper/LoginShipper";
import { FormValues } from "../pages/home/Shipping/registerShipper/RegisterShipper";
import { AdminModel } from "./AdminControllder";
export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_SHIPPING_WITHOUT_BUYZZLE_URL || "",
};

class ShipperController {
  registerShipper = async (FormValues: FormValues) => {
    return await axios
      .post(`${appConfig.apiUrl}/management/register`, FormValues)
      .then((res) => {
        return res.data;
      });
  };
  loginShipper = async (FormValues: FormLoginValues) => {
    return await axios
      .post(`${appConfig.apiUrl}/management/login`, FormValues)
      .then((res) => {
        return res.data;
      });
  };
  getAllShipper = async (data: AdminModel) => {
    return await axios
      .post(`${appConfig.apiUrl}/management/allshipping`, data)
      .then((res) => {
        return res.data;
      });
  };
  getShipperWhereUsername = async (username: string | undefined) => {
    return await axios
      .get(`${appConfig.apiUrl}/management/getShipping/${username}`)
      .then((res) => {
        return res.data;
      });
  };

  deleteShipperWhereId = async (id: string | undefined) => {
    return await axios
      .delete(`${appConfig.apiUrl}/management/delete/${id}`)
      .then((res) => {
        return res.data;
      });
  };
}

export const shipperController = new ShipperController();
