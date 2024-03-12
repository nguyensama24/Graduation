import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import HeaderAdmin from "../components/Header/HeaderAdmin";
import useNotificationContextAdmin, {
  NotificationContextAdmin,
} from "../hooks/Notification/NotificationContextAdmin";

function AdminLayout() {
  // context
  const notiContext = useNotificationContextAdmin();

  return (
    <div>
      <NotificationContextAdmin.Provider value={notiContext}>
        <HeaderAdmin />
        <Outlet />
        <Footer />
      </NotificationContextAdmin.Provider>
    </div>
  );
}

export default AdminLayout;
