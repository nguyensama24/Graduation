import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import useCartContext, { CartContext } from "../hooks/Cart/CartContextProvider";
import useNotificationContextUser, {
  NotificationContextUser,
} from "../hooks/Notification/NotificationContextUser";

interface Props {
  children?: React.ReactNode;
}
function MainLayout({ children }: Props) {
  const cartCtx = useCartContext();
  const notiContext = useNotificationContextUser();

  return (
    <CartContext.Provider value={cartCtx}>
      <NotificationContextUser.Provider value={notiContext}>
        <Header />
        {children}
        <Footer />
      </NotificationContextUser.Provider>
    </CartContext.Provider>
  );
}

export default MainLayout;
