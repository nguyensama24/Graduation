import axios from "axios";
import { Rate, Ratee, Rating } from "../model/ProductModel";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_URL || "",
};
export interface RepComment {
  ratingId?: number; // rep
  repComment?: string; // rep
  page?: number;
  perPage?: number;
}
class RatingAndComment {
  postRatingAndComment = async (data: any) => {
    return await axios
      .post(`${appConfig.apiUrl}/rating`, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      })
      .then((res) => {
        return res.data;
      });
  };
  getRatingAndComment = async (
    id: number,
    page?: number,
    perPage?: number
  ): Promise<Rate> => {
    return await axios
      .get(
        `${appConfig.apiUrl}/ratingcomment/${id}?page=${page}&perPage=${perPage}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        return res.data as Rate;
      });
  };
  // http://localhost:5000/buyzzle/product/updateimagecomment/27
  EditRatingAndComment = async (id: number, data: Rating) => {
    return await axios.put(
      `${appConfig.apiUrl}/updateratingcomment/${id}`,
      data,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      }
    );
  };
  removeImagesComment = async (id: number) => {
    return await axios.delete(`${appConfig.apiUrl}/deleteimagecomment/${id}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    });
  };
  RemoveRatingAndComment = async (id: number) => {
    return await axios.delete(`${appConfig.apiUrl}/deleteratingcomment/${id}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    });
  };
  addImagesComment = async (url: string, id: number) => {
    const urlImages = {
      url: url,
      idcomment: id,
    };
    return await axios.post(`${appConfig.apiUrl}/addimagecomment`, urlImages, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    });
  };
  getCommentWhereRating = async (
    idproduct?: number,
    rating?: number,
    page?: number,
    perPage?: number
  ): Promise<Ratee> => {
    return await axios
      .get(
        `${appConfig.apiUrl}/ratingcomment/${idproduct}?selectedRatingValue=${rating}&page=${page}&perPage=${perPage}`
      )
      .then((res) => {
        return res.data as Ratee;
      });
  };

  // rep comments
  repCommentsFromAdminToUser = async (data: RepComment) => {
    return await axios.put(`${appConfig.apiUrl}/repComment`, data);
  };
}

export const ratingAndCommentController = new RatingAndComment();
