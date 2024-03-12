import { BannerHomeModel } from '../model/BannerHomeModel';
import axios from "axios";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_BANNERHOME_URL || "",
};




class BannerHomeController {
    add = async (data:BannerHomeModel): Promise<BannerHomeModel> => {
      return await axios.post(
        `${appConfig.apiUrl}/addbannerhome`,data
      ).then((res)=>{
        return res.data as BannerHomeModel;
      });
    };

    getAll = async (): Promise<BannerHomeModel> =>{
      return await axios.get(
        `${appConfig.apiUrl}/allbannerhome`).then((res) => {
          return res.data as BannerHomeModel;
        })   
    };

    remove = async (id: number) => {
      return await axios.delete(`${appConfig.apiUrl}/deletebannerhome/${id}`);
    };
    
    update = async (id: number, data: BannerHomeModel) => {
      return await axios.put(`${appConfig.apiUrl}/updatebannerhome/${id}`, data);
    };
    
    
  }
export const bannerhomeController = new BannerHomeController();