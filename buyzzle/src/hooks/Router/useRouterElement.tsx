import { Navigate, useRoutes } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import Register from "../../pages/register/Register";
import RegisterLoginLayout from "../../layout/RegisterLoginLayout";
import Login from "../../pages/login/Login";
import HomePage from "../../pages/home/User/HomePage";
import ProductsPage from "../../pages/home/User/ProductsPage";
// import Addproducts from "../pages/home/Admin/Addproducts";
// import Detailproducts from "../pages/home/Admin/Detailproducts";
import UserProfile from "../../pages/home/User/UserProfile/UserProfile";
import AdminLayout from "../../layout/AdminLayout";
import ConfirmAccount from "../../pages/confirmAccount/ConfirmAccount";
import Forgotpassword from "../../pages/forgotpassword/Forgotpassword";
import ChangePassword from "../../pages/forgotpassword/Resetpassword";
import path from "../../contants/path";

import VoucherUserPage from "../../pages/home/User/voucherPage/VoucherPage";
import VoucherHomePage from "../../components/home/components/Voucher/Voucher";
import ShippingPage from "../../pages/home/Shipping/ShippingPage";
import ShippingDetail from "../../pages/home/Shipping/ShippingDetail";
import ShippingLayout from "../../layout/ShippingLayout";

import Addproducts from "../../pages/home/admin/Addproduct/Addproducts";
import AdminProfile from "../../pages/home/admin/AdminProfile/AdminProfile";
import Editproducts from "../../pages/home/admin/EditProduct/Editproducts";
import ListproductsAdmin from "../../pages/home/admin/ListProduct/Listproducts";
import Category from "../../pages/home/admin/Management/Category/Category";
import VoucherPage from "../../pages/home/admin/Management/Voucher/VoucherPage";
import DetailUser from "../../pages/home/admin/DetailUser/DetailUser";
import DetailShipper from "../../pages/home/admin/DetailShipper/DetailShipper";
import OrderManagement from "../../pages/home/admin/Management/Order/OrderManagement";
import DetailOrderManagement from "../../pages/home/admin/Management/Order/DetailOrderManagement";
import User from "../../pages/home/admin/Management/User/User";
import Shipper from "../../pages/home/admin/Management/Shipper/Shipper";
import StatisticsPage from "../../pages/home/admin/Statistics/StatisticsPage";
import Admin from "../../pages/home/admin/Management/Admin/Admin";
import Logoes from "../../pages/home/admin/Management/Logo/Logoes";
import Banner from "../../pages/home/admin/Management/Banner/Banner";
import BannerHome from "../../pages/home/admin/Management/Banner/BannerHome";
import VouchersPage from "../../components/home/components/Voucher/VouchersPage";
import LogoHome1 from "../../pages/home/admin/Management/Logo/LogoHome1";
import LogoDetail from "../../pages/home/admin/Management/Logo/LogoDetail";
import LoginAdmin from "../../pages/home/admin/LoginAdmin/AdminLogin";
import LogoHome from "../../pages/home/admin/Management/Logo/LogoHome";
import DieuKhoan from "../../pages/clause/Clause";
import FiltersPage from "../../pages/home/User/filterPage/FiltersPage";
import DetailsProduct from "../../pages/home/User/DetailProduct/detailProductPage/DetailsProduct";
import Cart from "../../pages/home/User/cartPage/Cart";
import OrderHistory from "../../pages/home/User/OrderHistoryPage/OrderHistory";
import CheckOut from "../../pages/home/User/checkoutPage/CheckOut";
import OrderDetailPage from "../../pages/home/User/orderDetail/OrderDetailPage";
import RegisterShipper from "../../pages/home/Shipping/registerShipper/RegisterShipper";
import LoginShipper from "../../pages/home/Shipping/loginShipper/LoginShipper";
import InvoicesPage from "../../pages/home/User/invoicesPage/InvoicesPage";
import FavoritePage from "../../pages/home/User/favoriteProducts/FavoritePage";

export default function useRouterEmelent() {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      ),
    },
    {
      path: "/userprofilepage/:username",
      element: (
        <MainLayout>
          <UserProfile />
        </MainLayout>
      ),
    },

    {
      path: "/products",
      element: (
        <MainLayout>
          <ProductsPage />
        </MainLayout>
      ),
    },
    {
      path: "/FiltersPage",
      element: (
        <MainLayout>
          <FiltersPage />
        </MainLayout>
      ),
    },

    {
      path: "/register",
      element: (
        <RegisterLoginLayout>
          <Register />
        </RegisterLoginLayout>
      ),
    },

    {
      path: "/clause",
      element: (
        <RegisterLoginLayout>
          <DieuKhoan />
        </RegisterLoginLayout>
      ),
    },

    {
      path: "/login",
      element: (
        <RegisterLoginLayout>
          <Login />
        </RegisterLoginLayout>
      ),
    },

    {
      path: "/forgotpassword",
      element: (
        <RegisterLoginLayout>
          <Forgotpassword />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "detailproducts/:id",
      element: (
        <MainLayout>
          <DetailsProduct />
        </MainLayout>
      ),
    },
    {
      path: "Cart",
      element: (
        <MainLayout>
          <Cart />
        </MainLayout>
      ),
    },
    {
      path: "orderhistory",
      element: (
        <MainLayout>
          <OrderHistory />
        </MainLayout>
      ),
    },
    {
      path: "checkout",
      element: (
        <MainLayout>
          <CheckOut />
        </MainLayout>
      ),
    },

    {
      path: path.confirmAccount,
      element: (
        <RegisterLoginLayout>
          <ConfirmAccount />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "/userprofilepage/:username",
      element: (
        <MainLayout>
          <UserProfile />
        </MainLayout>
      ),
    },
    {
      path: "/forgotpassword",
      element: (
        <RegisterLoginLayout>
          <Forgotpassword />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "detailproducts/:id",
      element: (
        <MainLayout>
          <DetailsProduct />
        </MainLayout>
      ),
    },
    {
      path: "cart",
      element: (
        <MainLayout>
          <Cart />
        </MainLayout>
      ),
    },
    // {
    //   path: "voucher",
    //   element: (
    //     <MainLayout>
    //       <VoucherUserPage />
    //     </MainLayout>
    //   ),
    // },
    {
      path: "orderhistory",
      element: (
        <MainLayout>
          <OrderHistory />
        </MainLayout>
      ),
    },
    {
      path: "checkout",
      element: (
        <MainLayout>
          <CheckOut />
        </MainLayout>
      ),
    },
    {
      path: "orderdetail/:id",
      element: (
        <MainLayout>
          <OrderDetailPage />
        </MainLayout>
      ),
    },
    {
      path: path.confirmAccount,
      element: (
        <RegisterLoginLayout>
          <ConfirmAccount />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "/userprofilepage/:username",
      element: (
        <MainLayout>
          <UserProfile />
        </MainLayout>
      ),
    },
    {
      path: "/forgotpassword",
      element: (
        <RegisterLoginLayout>
          <Forgotpassword />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "detailproducts/:id",
      element: (
        <MainLayout>
          <DetailsProduct />
        </MainLayout>
      ),
    },
    {
      path: "Cart",
      element: (
        <MainLayout>
          <Cart />
        </MainLayout>
      ),
    },
    {
      path: "voucher",
      element: (
        <MainLayout>
          <VouchersPage />
        </MainLayout>
      ),
    },
    {
      path: "uservoucherstorage",
      element: (
        <MainLayout>
          <VoucherUserPage />
        </MainLayout>
      ),
    },
    {
      path: "orderhistory",
      element: (
        <MainLayout>
          <OrderHistory />
        </MainLayout>
      ),
    },
    {
      path: "checkout",
      element: (
        <MainLayout>
          <CheckOut />
        </MainLayout>
      ),
    },

    {
      path: path.confirmAccount,
      element: (
        <RegisterLoginLayout>
          <ConfirmAccount />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "/userprofilepage/:username",
      element: (
        <MainLayout>
          <UserProfile />
        </MainLayout>
      ),
    },
    {
      path: "/forgotpassword",
      element: (
        <RegisterLoginLayout>
          <Forgotpassword />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "detailproducts/:id",
      element: (
        <MainLayout>
          <DetailsProduct />
        </MainLayout>
      ),
    },
    {
      path: "Cart",
      element: (
        <MainLayout>
          <Cart />
        </MainLayout>
      ),
    },
    {
      path: "voucher",
      element: (
        <MainLayout>
          <VoucherHomePage />
        </MainLayout>
      ),
    },
    {
      path: "uservoucherstorage",
      element: (
        <MainLayout>
          <VoucherUserPage />
        </MainLayout>
      ),
    },
    {
      path: "orderhistory",
      element: (
        <MainLayout>
          <OrderHistory />
        </MainLayout>
      ),
    },
    {
      path: "checkout",
      element: (
        <MainLayout>
          <CheckOut />
        </MainLayout>
      ),
    },

    {
      path: path.confirmAccount,
      element: (
        <RegisterLoginLayout>
          <ConfirmAccount />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "/userprofilepage/:username",
      element: (
        <MainLayout>
          <UserProfile />
        </MainLayout>
      ),
    },
    {
      path: "/forgotpassword",
      element: (
        <RegisterLoginLayout>
          <Forgotpassword />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "detailproducts/:id",
      element: (
        <MainLayout>
          <DetailsProduct />
        </MainLayout>
      ),
    },
    {
      path: "Cart",
      element: (
        <MainLayout>
          <Cart />
        </MainLayout>
      ),
    },
    {
      path: "orderhistory",
      element: (
        <MainLayout>
          <OrderHistory />
        </MainLayout>
      ),
    },
    {
      path: "checkout",
      element: (
        <MainLayout>
          <CheckOut />
        </MainLayout>
      ),
    },

    {
      path: path.confirmAccount,
      element: (
        <RegisterLoginLayout>
          <ConfirmAccount />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "/userprofilepage/:username",
      element: (
        <MainLayout>
          <UserProfile />
        </MainLayout>
      ),
    },
    {
      path: "/forgotpassword",
      element: (
        <RegisterLoginLayout>
          <Forgotpassword />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "detailproducts/:id",
      element: (
        <MainLayout>
          <DetailsProduct />
        </MainLayout>
      ),
    },
    {
      path: "cart",
      element: (
        <MainLayout>
          <Cart />
        </MainLayout>
      ),
    },
    // {
    //   path: "voucher",
    //   element: (
    //     <MainLayout>
    //       <VoucherUserPage />
    //     </MainLayout>
    //   ),
    // },
    {
      path: "orderhistory",
      element: (
        <MainLayout>
          <OrderHistory />
        </MainLayout>
      ),
    },
    {
      path: "checkout",
      element: (
        <MainLayout>
          <CheckOut />
        </MainLayout>
      ),
    },

    {
      path: "favorite",
      element: (
        <MainLayout>
          <FavoritePage />
        </MainLayout>
      ),
    },
    {
      path: path.confirmAccount,
      element: (
        <RegisterLoginLayout>
          <ConfirmAccount />
        </RegisterLoginLayout>
      ),
    },
    {
      path: "/userprofilepage/:username",
      element: (
        <MainLayout>
          <UserProfile />
        </MainLayout>
      ),
    },

    // AdminPages
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={"Addproductspage"} />,
        },
        {
          path: "Addproductspage",
          element: <Addproducts />,
        },
        {
          path: "adminprofile/:username",
          element: <AdminProfile />,
        },

        {
          path: "updateproduct/:id",
          element: <Editproducts />,
        },
        {
          path: "ListproductsAdmin",
          element: <ListproductsAdmin />,
        },

        {
          path: "Detailproducts/:id",
          element: <DetailsProduct />,
        },
        {
          path: "category",
          element: <Category />,
        },
        {
          path: "voucher",
          element: <VoucherPage />,
        },
        {
          path: "detailuser/:username",
          element: <DetailUser />,
        },
        {
          path: "detailshipper/:username",
          element: <DetailShipper />,
        },
        {
          path: "ordermanagement",
          element: <OrderManagement />,
        },
        {
          path: "ordermanagement/:id",
          element: <DetailOrderManagement />,
        },
        {
          path: "usersmanager",
          element: <User />,
        },
        {
          path: "shippermanager",
          element: <Shipper />,
        },
        {
          path: "statisticspage",
          element: <StatisticsPage />,
        },
        {
          path: "invoice/:id",
          element: <InvoicesPage />,
        },
        {
          path: "adminmanager",
          element: <Admin />,
        },

        {
          path: "logo",
          element: <Logoes />,
        },

        {
          path: "logohome",
          element: <LogoHome />,
        },

        {
          path: "logohome1",
          element: <LogoHome1 />,
        },

        {
          path: "logodetail",
          element: <LogoDetail />,
        },

        {
          path: "banner",
          element: <Banner />,
        },

        {
          path: "bannerhome",
          element: <BannerHome />,
        },
      ],
    },
    {
      path: "/admin",
      children: [
        {
          path: "loginadmin",
          element: (
            <RegisterLoginLayout>
              <LoginAdmin />
            </RegisterLoginLayout>
          ),
        },
      ],
    },
    {
      path: "/shipping",
      element: <ShippingLayout />,
      children: [
        {
          path: "management",
          element: <ShippingPage />,
        },
        {
          path: "detail/:id",
          element: <ShippingDetail />,
        },
      ],
    },
    {
      path: "/shipping",
      children: [
        {
          path: "registerShipper",
          element: (
            <RegisterLoginLayout>
              <RegisterShipper />
            </RegisterLoginLayout>
          ),
        },
        {
          path: "loginShipper",
          element: (
            <RegisterLoginLayout>
              <LoginShipper />
            </RegisterLoginLayout>
          ),
        },
      ],
    },
    {
      path: path.resetpassword,
      element: (
        <RegisterLoginLayout>
          <ChangePassword />
          {/* <ConfirmAccount /> */}
        </RegisterLoginLayout>
      ),
    },
  ]);
  return routes;
}
