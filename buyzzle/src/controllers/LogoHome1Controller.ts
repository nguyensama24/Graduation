import { LogoHome1Model } from '../model/LogoHome1Model';
import axios from "axios";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_LOGOHOME1_URL || "",
};




class LogoHome1Controller {
    add = async (data:LogoHome1Model): Promise<LogoHome1Model> => {
      return await axios.post(
        `${appConfig.apiUrl}/addlogohome1`,data
      ).then((res)=>{
        return res.data as LogoHome1Model;
      });
    };

    getAlll = async (): Promise<LogoHome1Model> =>{
      return await axios.get(
        `${appConfig.apiUrl}/alllogohome1`).then((res) => {
          return res.data as LogoHome1Model;
        })   
    };

    remove = async (id: number) => {
      return await axios.delete(`${appConfig.apiUrl}/deletelogohome1/${id}`);
    };
    
    update = async (id: number, data: LogoHome1Model) => {
      return await axios.put(`${appConfig.apiUrl}/updatelogohome1/${id}`, data);
    };
    
    
  }
export const logohome1Controller = new LogoHome1Controller();