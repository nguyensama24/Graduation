import { useNotificationAdmin } from "../../hooks/Notification/NotificationContextAdmin";
import NotificationAdmin from "../Notification/NotificationAdmin";
import HeaderTop from "./HeaderTop";

export default function HeaderTopAdmin() {
  const { countNotificationAdmin } = useNotificationAdmin();

  return (
    <>
      <HeaderTop
        countNoti={
          countNotificationAdmin ? countNotificationAdmin.countNotification : 0
        }
        noti={<NotificationAdmin />}
      />
    </>
  );
}
