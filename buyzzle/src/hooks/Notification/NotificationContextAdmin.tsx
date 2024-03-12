import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { notificationControllers } from "../../controllers/NotificationController";
import CustomToast from "../../helper/Toast/CustomToast";
import CancelOrder from "../../layout/asset/TSX/CancelOrder";
import NewOrder from "../../layout/asset/TSX/NewOrder";
import { AllNotification, NotificationModel } from "../../model/Notification";
import AvtDefautl from "./assets/AvtDefautl";

export default function useNotificationContextAdmin() {
  const [countNotificationAdmin, setCountNotificationAdmin] =
    useState<NotificationModel>({} as NotificationModel);

  const [notificationAdmin, setNotificationAdmin] = useState<AllNotification[]>(
    []
  );
  useEffect(() => {
    getCountNoti();
  }, []);
  const getCountNoti = async () => {
    await notificationControllers.getAllNotificationAdmin().then((res) => {
     
      setCountNotificationAdmin(res);
    });
  };

  //   ================================================ SOCKET IO NOTIFICATION ADMIN ================================================
  useEffect(() => {
    getAllNotiAdmin();
  }, []);
  const getAllNotiAdmin = async () => {
    await notificationControllers
      .getAllNotificationAdmin()
      .then((res) => {
        
        setNotificationAdmin(res.allNotification);
      })
      
  };

  const [deletedOrder, setDeletedOrder] = useState(null);
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("requestdelete", (requestdelete) => {
      
      const urlTaker = requestdelete.User.UserImage;

      toast(
        <a href={`/admin/ordermanagement/${requestdelete.id}`}>
          <CustomToast
            image={
              <>
                {urlTaker?.length > 0 ? (
                  <img
                    className="w-12 h-12 rounded-full"
                    src={`${urlTaker[0]?.url}`}
                    alt="avatar_admin"
                  />
                ) : (
                  <AvtDefautl />
                )}
              </>
            }
            iconSVG={<CancelOrder />}
            name={
              <p className="text-sm font-semibold text-gray-900 ">
                {requestdelete.name}
              </p>
            }
            content={
              <p className="text-sm font-normal text-red-700">
                Đã gửi yêu cầu hủy hàng
              </p>
            }
          />
        </a>,
        {
          position: "bottom-left",
          autoClose: 100000,
          closeButton: true,
        }
      );

      setCountNotificationAdmin((prevState) => ({
        ...prevState,
        countNotification: prevState.countNotification + 1,
      }));
      getAllNotiAdmin();
      setDeletedOrder(requestdelete);
    });
    socket.on("newOrder", (newOrder) => {
    
      const urlTaker = newOrder.user.UserImage;

      toast(
        <a href={`/admin/ordermanagement/${newOrder.id}`}>
          <CustomToast
            image={
              <>
                {urlTaker?.length > 0 ? (
                  <img
                    className="w-12 h-12 rounded-full"
                    src={`${urlTaker[0]?.url}`}
                    alt="avatar_admin"
                  />
                ) : (
                  <AvtDefautl />
                )}
              </>
            }
            iconSVG={<NewOrder />}
            name={
              <p className="text-sm font-semibold text-gray-900 ">
                {newOrder.name}
              </p>
            }
            content={
              <p className="text-sm font-normal text-[#739072]">
                Có 1 đơn hàng mới
              </p>
            }
          />
        </a>,
        {
          position: "bottom-left",
          autoClose: 10000,
          closeButton: true,
        }
      );

      setCountNotificationAdmin((prevState) => ({
        ...prevState,
        countNotification: prevState.countNotification + 1,
      }));
      getAllNotiAdmin();
      setDeletedOrder(newOrder);
    });
    socket.on("disconnect", () => {
      
    });
  }, [deletedOrder]);

  const handleSeenAllNoti = () => {
    notificationControllers
      .seenAllNotiAdmin()
      .then((res: any) => {
     
        setCountNotificationAdmin(res.count);
      })
      .catch((err) => {
       
        return {};
      });
  };

  return {
    handleSeenAllNoti,
    setNotification: setNotificationAdmin,
    // admin
    notificationAdmin,
    countNotificationAdmin,
    // ImgUser,
    getAllNotiAdmin,
  };
}
type NotificationContextType = ReturnType<typeof useNotificationContextAdmin>;

export const NotificationContextAdmin = createContext<NotificationContextType>(
  {} as NotificationContextType
);

export const useNotificationAdmin = () => useContext(NotificationContextAdmin);
