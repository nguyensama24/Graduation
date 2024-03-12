import { useNotificationShipping } from "../../hooks/Notification/NotificationContextShipping";
import NotificationShipping from "../Notification/NotificationShipping";
import HeaderTop from "./HeaderTop";

export default function HeaderTopShipping() {
  const { countNotificationShipping } = useNotificationShipping();

  return (
    <>
      <HeaderTop
        countNoti={
          countNotificationShipping
            ? countNotificationShipping.countNotification
            : 0
        }
        noti={<NotificationShipping />}
      />
    </>
  );
}
