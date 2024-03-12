import { LogoModel } from './../model/LogoModel';
import axios from "axios";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_LOGO_URL || "",
};




class LogoController {
    add = async (data:LogoModel): Promise<LogoModel> => {
      return await axios.post(
        `${appConfig.apiUrl}/addlogo`,data
      ).then((res)=>{
        return res.data as LogoModel;
      });
    };

    getAll = async (): Promise<LogoModel> =>{
      return await axios.get(
        `${appConfig.apiUrl}/alllogo`).then((res) => {
          return res.data as LogoModel;
        })   
    };

    remove = async (id: number) => {
      return await axios.delete(`${appConfig.apiUrl}/deletelogo/${id}`);
    };
    
    update = async (id: number, data: LogoModel) => {
      return await axios.put(`${appConfig.apiUrl}/updatelogo/${id}`, data);
    };
    
    
  }
export const logoesController = new LogoController();