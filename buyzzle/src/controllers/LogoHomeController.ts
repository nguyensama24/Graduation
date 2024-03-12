import { LogoHomeModel } from '../model/LogoHomeModel';
import axios from "axios";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_LOGOHOME_URL || "",
};




class LogoHomeController {
    add = async (data:LogoHomeModel): Promise<LogoHomeModel> => {
      return await axios.post(
        `${appConfig.apiUrl}/addlogohome`,data
      ).then((res)=>{
        return res.data as LogoHomeModel;
      });
    };

    getAll = async (): Promise<LogoHomeModel> =>{
      return await axios.get(
        `${appConfig.apiUrl}/alllogohome`).then((res) => {
          return res.data as LogoHomeModel;
        })   
    };

    remove = async (id: number) => {
      return await axios.delete(`${appConfig.apiUrl}/deletelogohome/${id}`);
    };
    
    update = async (id: number, data: LogoHomeModel) => {
      return await axios.put(`${appConfig.apiUrl}/updatelogohome/${id}`, data);
    };
    
    
  }
export const logohomeController = new LogoHomeController();