import { LogoDetailModel } from './../model/LogoDetailModel';
import axios from "axios";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_LOGODETAIL_URL || "",
};




class LogoDetailController {
    add = async (data:LogoDetailModel): Promise<LogoDetailModel> => {
      return await axios.post(
        `${appConfig.apiUrl}/addlogodetail`,data
      ).then((res)=>{
        return res.data as LogoDetailModel;
      });
    };

    getAll = async (): Promise<LogoDetailModel> =>{
      return await axios.get(
        `${appConfig.apiUrl}/alllogodetail`).then((res) => {
          return res.data as LogoDetailModel;
        })   
    };

    remove = async (id: number) => {
      return await axios.delete(`${appConfig.apiUrl}/deletelogodetail/${id}`);
    };
    
    update = async (id: number, data: LogoDetailModel) => {
      return await axios.put(`${appConfig.apiUrl}/updatelogodetail/${id}`, data);
    };
    
    
  }
export const logodetailController = new LogoDetailController();