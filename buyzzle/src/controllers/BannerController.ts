import { BannerModel } from './../model/BannerModel';
import axios from "axios";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_BANNER_URL || "",
};




class BannerController {
    add = async (data:BannerModel): Promise<BannerModel> => {
      return await axios.post(
        `${appConfig.apiUrl}/addbanner`,data
      ).then((res)=>{
        return res.data as BannerModel;
      });
    };

    getAll = async (): Promise<BannerModel> =>{
      return await axios.get(
        `${appConfig.apiUrl}/allbanner`).then((res) => {
          return res.data as BannerModel;
        })   
    };

    remove = async (id: number) => {
      return await axios.delete(`${appConfig.apiUrl}/deletebanner/${id}`);
    };
    
    update = async (id: number, data: BannerModel) => {
      return await axios.put(`${appConfig.apiUrl}/updatebanner/${id}`, data);
    };
    
    
  }
export const bannerController = new BannerController();