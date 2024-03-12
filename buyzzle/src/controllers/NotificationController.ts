import axios from "axios";
import { NotificationModel } from "../model/Notification";

const appConfig = {
  apiShipping: import.meta.env.VITE_BACKEND_SHIPPING_URL || "",
};

class NotificationControllers {
  // Admin Notification
  getAllNotificationAdmin = async (): Promise<NotificationModel> => {
    return await axios
      .get(`${appConfig.apiShipping}/notificationadmin`)
      .then((res) => {
        return res.data as NotificationModel;
      });
  };
  getFilterNotification = async (
    status: number
  ): Promise<NotificationModel> => {
    return await axios
      .post(`${appConfig.apiShipping}/filter`, { status: status })
      .then((res) => {
        return res.data as NotificationModel;
      });
  };
  getSeenNotification = async (id: number): Promise<NotificationModel> => {
    return await axios
      .put(`${appConfig.apiShipping}/markasread`, { id: id })
      .then((res) => {
        return res.data as NotificationModel;
      });
  };
  // User Notification
  getAllNotificationUser = async (): Promise<NotificationModel> => {
    return await axios
      .get(`${appConfig.apiShipping}/notificationforuser`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      })
      .then((res) => {
        return res.data as NotificationModel;
      });
  };
  // Shipping Notification
  getAllNotificationShipping = async (): Promise<NotificationModel> => {
    return await axios
      .get(`${appConfig.apiShipping}/notificationdelivery`)
      .then((res) => {
        return res.data as NotificationModel;
      });
  };

  seenAllNotiUser = async (): Promise<NotificationModel> => {
    return await axios
      .put(`${appConfig.apiShipping}/markasreaduser`)
      .then((res) => {
        return res.data as NotificationModel;
      });
  };
  seenAllNotiAdmin = async (): Promise<NotificationModel> => {
    return await axios
      .put(`${appConfig.apiShipping}/markasreadadmin`)
      .then((res) => {
        return res.data as NotificationModel;
      });
  };
  seenAllNotiShipping = async (): Promise<NotificationModel> => {
    return await axios
      .put(`${appConfig.apiShipping}/markasreaddelivery`)
      .then((res) => {
        return res.data as NotificationModel;
      });
  };
}
export const notificationControllers = new NotificationControllers();
