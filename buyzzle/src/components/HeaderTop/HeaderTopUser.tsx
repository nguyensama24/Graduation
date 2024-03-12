import { useNotificationUser } from "../../hooks/Notification/NotificationContextUser";
import NotificationUser from "../Notification/NotificationUser";
import HeaderTop from "./HeaderTop";

export default function HeaderTopUser() {
  const { countNotificationUser } = useNotificationUser();
  const user = localStorage.getItem("user");

  return (
    <>
      <HeaderTop
        countNoti={
          !countNotificationUser || user == null
            ? 0
            : countNotificationUser.countNotification
        }
        noti={<NotificationUser />}
      />
    </>
  );
}
