import axios from "axios";
import { OrderModel, UpdateQuantityModal } from "../model/OrderModel";

const appConfig = {
  apiOrder: import.meta.env.VITE_BACKEND_ORDER_URL || "",
  apiShipping: import.meta.env.VITE_BACKEND_SHIPPING_URL || "",
};

export interface orderModelController {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: number | null;
}
class OrderControllers {
  create = async (data: any) => {
    return await axios.post(`${appConfig.apiOrder}`, { order: data });
  };

  getOrderOfUser = async (page: number, status: number) => {
    return await axios
      .post(
        `${appConfig.apiOrder}/userOrder`,
        { page: page, pageSize: 6, status: status },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        return res.data;
      });
  };

  getDetails = async (id: number): Promise<OrderModel> => {
    return await axios.get(`${appConfig.apiOrder}/${id}`).then((res) => {
      return res.data as OrderModel;
    });
  };

  putRatingAt = async (
    idOrder: number,
    productId: number,
    orderDetailId?: number
  ) => {
    return await axios.put(`${appConfig.apiOrder}/${idOrder}`, {
      productId: productId,
      orderDetailId: orderDetailId,
    });
  };

  setStatus = async (id: number, status: number) => {
    return await axios.post(
      `${appConfig.apiShipping}/setStatus`,
      {
        id: id,
        status: status,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      }
    );
  };

  abortOrder = async (id: number) => {
    return await axios.post(`${appConfig.apiShipping}/delete`, {
      orderId: id,
    });
  };

  getOrderOfShipping = async (data: orderModelController) => {
    return await axios.post(`${appConfig.apiShipping}`, data).then((res) => {
      return res.data;
    });
  };
  getOrderOfAdmin = async (data: orderModelController) => {
    return await axios
      .post(`${appConfig.apiShipping}/manager`, data)
      .then((res) => {
        return res.data;
      });
  };
  getConfirmCancelOrder = async (id: number) => {
    return await axios
      .post(
        `${appConfig.apiShipping}/confirmdelete`,
        { orderId: id },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        return res.data;
      });
  };

  updateQuantityCart = async (data: UpdateQuantityModal[]) => {
    return await axios.post(`${appConfig.apiOrder}/updateQuantityCart`, data);
  };

  quantityCreateOrder = async (data: UpdateQuantityModal[]) => {
    return await axios.post(`${appConfig.apiOrder}/quantityCreateOrder`, data);
  };

  quantityCancelOrder = async (data: UpdateQuantityModal[]) => {
    return await axios.post(`${appConfig.apiOrder}/quantityCancelOrder`, data);
  };

  updateSoldcount = async (data: UpdateQuantityModal[]) => {
    return await axios.post(`${appConfig.apiOrder}/updateSoldcount`, data);
  };
}

export const orderControllers = new OrderControllers();
