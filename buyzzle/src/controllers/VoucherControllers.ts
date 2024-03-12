import axios from "axios";
import { Voucher, VoucherModel } from "../model/VoucherModel";

const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_VOUCHER_URL || "",
};
export interface voucherModel {
  page?: number;
  pageSize?: number;
  keyword?: string;
}
class VoucherControllers {
  getAdmin = async (data: voucherModel): Promise<Voucher> => {
    return await axios
      .post(`${appConfig.apiUrl}/getVoucher`, data)
      .then((res) => {
        return res.data as Voucher;
      });
  };

  getUser = async (page: number): Promise<Voucher> => {
    return await axios
      .get(`${appConfig.apiUrl}/pageUser?page=${page}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      })
      .then((res) => {
        return res.data as Voucher;
      });
  };

  add = async (data: VoucherModel): Promise<VoucherModel> => {
    return await axios.post(`${appConfig.apiUrl}`, data).then((res) => {
      return res.data as VoucherModel;
    });
  };

  remove = async (id: number | undefined) => {
    return await axios.delete(`${appConfig.apiUrl}/${id}`);
  };

  update = async (id: number, data: VoucherModel): Promise<VoucherModel> => {
    return await axios.put(`${appConfig.apiUrl}/${id}`, data).then((res) => {
      return res.data as VoucherModel;
    });
  };
  userSavedVoucher = async (id: number): Promise<VoucherModel> => {
    return await axios
      .get(`${appConfig.apiUrl}/savevoucher/${id}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      })
      .then((res) => {
  
        return res.data as VoucherModel;
      });
  };
  GetUserSavedVoucher = async (): Promise<VoucherModel[]> => {
    return await axios
      .get(`${appConfig.apiUrl}/getSavedUser`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      })
      .then((res) => {
       
        return res.data as VoucherModel[];
      });
  };
  useVoucher = async (
    userId: number,
    voucherId: number
  ): Promise<VoucherModel> => {
    return await axios
      .post(`${appConfig.apiUrl}/usevoucher`, {
        userId: userId,
        voucherId: voucherId,
      })
      .then((res) => {
        return res.data as VoucherModel;
      });
  };
}
export const voucherControllers = new VoucherControllers();
