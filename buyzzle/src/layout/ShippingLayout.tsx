import { Outlet } from "react-router-dom";
import HeaderShipping from "../components/Header/HeaderShipping";
import useNotificationContextShippping, {
  NotificationContextShipping,
} from "../hooks/Notification/NotificationContextShipping";
function ShippingLayout() {
  const notiContext = useNotificationContextShippping();

  return (
    <div>
      <NotificationContextShipping.Provider value={notiContext}>
        <HeaderShipping />
        <Outlet />
      </NotificationContextShipping.Provider>
    </div>
  );
}

export default ShippingLayout;
