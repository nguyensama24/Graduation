import axios from "axios";
import { CartModel } from "../model/CartModel";

const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_CART_URL || "",
};

export interface ModelCart {
  // id?: number,
  productId: number;
  quantity: number;
}
export interface UpdateCart {
  productId: number;
  cartId: number;
}
class CartControllers {
  addCart = async (data: ModelCart): Promise<CartModel> => {
    return await axios.post(`${appConfig.apiUrl}`, data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    });
  };

  getCart = async (): Promise<CartModel> => {
    return await axios
      .get(`${appConfig.apiUrl}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      })
      .then((res) => {
        return res.data as CartModel;
      });
  };

  removeItemCart = async (id: number) => {
    return await axios.delete(`${appConfig.apiUrl}/${id}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    });
  };

  removeAllCart = async () => {
    return await axios.delete(`${appConfig.apiUrl}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    });
  };

  increaseCart = async (data: UpdateCart) => {
    return await axios
      .put(`${appConfig.apiUrl}/increase`, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      })
      .then((res) => res.data as CartModel);
  };
  decreaseCart = async (data: UpdateCart) => {
    return await axios
      .put(`${appConfig.apiUrl}/decrease`, data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      })
      .then((res) => res.data as CartModel);
  };
}

export const cartControllers = new CartControllers();
