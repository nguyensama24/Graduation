import moment from "moment";
import { useState } from "react";
import Check from "../../assets/TSX/Check";
import { useNotificationShipping } from "../../hooks/Notification/NotificationContextShipping";
import BuyzzleAvt from "../../layout/asset/TSX/BuyzzleAvt";
import NewOrder from "../../layout/asset/TSX/NewOrder";
import { handleSeenNoti } from "./components/SeenNoti";

export default function NotificationShipping() {
  const { notificationShipping, handleSeenAllNoti } = useNotificationShipping();
  const [isRead, setIsRead] = useState(false);

  const handleMarkAsRead = () => {
    setIsRead(true);
    setTimeout(() => {
      setIsRead(false);
    }, 2000);
    handleSeenAllNoti();
  };

  return (
    <div className="header-view top-full absolute w-[355px] invisible z-20 overflow-y-auto h-[600px] scroll-smooth">
      <div
        className="bg-white p-4
    shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
      >
        <div className="flex justify-between items-end">
          <p className="font-extrabold text-xl text-[#EA4B48]">Thông báo</p>
          <p
            className="text-xs cursor-pointer flex gap-2"
            onClick={handleMarkAsRead}
          >
            Đánh dấu tất cả là đã đọc {isRead && <Check />}
          </p>
        </div>
        <div className=" border-b-[1px] mt-2"></div>
        <div className="flex flex-col gap-3">
          {/* map Noti */}
          {notificationShipping?.length > 0 ? (
            notificationShipping.map((notiItems) => {
              return (
                <a
                  href={`/shipping/detail/${notiItems.orderId}`}
                  onClick={() => handleSeenNoti(notiItems.id)}
                >
                  <>
                    <div className="flex gap-2 hover:bg-slate-200 hover:rounded-md hover:duration-500 cursor-default">
                      <div className="items-center flex gap-3">
                        <div className="p-1 relative">
                          <div
                            className={`${
                              notiItems.seen === false ? "" : "opacity-70"
                            }`}
                          >
                            <BuyzzleAvt />
                          </div>
                          <div
                            className={`${
                              notiItems.seen === false ? "" : "opacity-80"
                            }`}
                          >
                            <NewOrder />
                          </div>
                        </div>
                        <div>
                          <div
                            className={`${
                              notiItems.seen === false
                                ? "text-sm font-semibold text-black"
                                : "text-sm font-semibold text-black opacity-70"
                            }`}
                          >
                            Buyzzle thông báo
                          </div>
                          <p
                            className={`${
                              notiItems.seen === false
                                ? "text-[#739072] text-xs font-semibold"
                                : "text-[#739072] text-xs font-semibold opacity-70"
                            }`}
                          >
                            Có đơn hàng mới từ Buyzzle
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 my-2">
                        <span
                          className={`${
                            notiItems.seen === false
                              ? "text-slate-500 text-xs inline-flex items-center rounded"
                              : "text-slate-500 text-xs inline-flex items-center rounded opacity-70"
                          }`}
                        >
                          {notiItems.status === 1 ? (
                            <svg
                              className="w-2 h-2 me-1.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-2 h-2 me-1.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                            </svg>
                          )}
                          {moment(notiItems.date).locale("vi").fromNow()}
                        </span>
                        {notiItems.seen == false ? (
                          <div className="rounded-full border-[5px] w-0 border-[#2E89FF] justify-end"></div>
                        ) : (
                          <div className="invisible"></div>
                        )}
                      </div>
                    </div>
                  </>
                </a>
              );
            })
          ) : (
            <>
              <p className="mt-2 text-[#808080]">Chưa có thông báo</p>
            </>
          )}
          {/* end map Noti */}
        </div>
      </div>
    </div>
  );
}
