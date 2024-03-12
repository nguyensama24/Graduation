import { useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { Link } from "react-router-dom";

import Search from "../../../assets/TSX/Search";
import {
  orderControllers,
  orderModelController,
} from "../../../controllers/OrderControllers";
import { numberFormat } from "../../../helper/Format";
import { OrderPanigation } from "../../../model/OrderModel";
import Container from "../../../components/container/Container";
import useDebounce from "../../../useDebounceHook/useDebounce";
import Calendar from "../admin/assets/TSX/calendar";
import Excel from "../admin/assets/TSX/excel";
import {
  dateOrder,
  timeOrder,
} from "../admin/Management/Order/OrderManagement";
import useThrottle from "@rooks/use-throttle";
import secureLocalStorage from "react-secure-storage";
import { getStatusOrder } from "../User/OrderHistoryPage/OrderHistory";

export default function ShippingPage() {
  const [order, setOrder] = useState<OrderPanigation>({} as OrderPanigation);
  const [orderAPI, setOrderAPI] = useState<orderModelController>({
    pageSize: 4,
  });

  const debouncedInputValueSearch = useDebounce(orderAPI.keyword, 1000); // Debounce for 300 milliseconds

  const [changeButton, setChangeButton] = useState([
    {
      id: -1,
      text: "Tất cả",
      active: true, // Thêm trường active
    },
    {
      id: 4,
      text: "Đã nhận hàng",
      active: false, // Thêm trường active
    },
    {
      id: 5,
      text: "Đang Giao Hàng",
      active: false, // Thêm trường active
    },
    {
      id: 6,
      text: "Giao Hàng Thành công",
      active: false, // Thêm trường active
    },
  ]);

  const handleClick = (id: number) => {
    const updatedButtons = changeButton.map((btn) => {
      if (btn.id === id) {
        return { ...btn, active: true };
      } else {
        return { ...btn, active: false };
      }
    });
    setChangeButton(updatedButtons);
    const selectedButton = updatedButtons.find((btn) => btn.id === id);

    if (selectedButton && selectedButton.id !== -1) {
   
      setOrderAPI({ ...orderAPI, status: selectedButton.id, keyword: "" });
    } else {
      setOrderAPI({ ...orderAPI, status: null, keyword: "" });
    }
  };
  const [btnFiterThrottle] = useThrottle(handleClick, 700);

  function getBorderColor(id: number) {
    switch (id) {
      case -1:
        return "#570DF8";
      case 4:
        return "#FBC132";
      case 5:
        return "#F43FCA";
      case 6:
        return "#21CEBD";
      default:
        return "#ccc";
    }
  }
  useEffect(() => {
    let user = secureLocalStorage.getItem("shippername");
    if (user == null) {
     
      window.location.href = "/shipping/loginShipper";
    }
  }, []);
  const getOrder = async () => {
    await orderControllers.getOrderOfShipping(orderAPI).then((res) => {
      setOrder(res);
    
    });
  };

  useEffect(() => {
    getOrder();
  }, [orderAPI.page, debouncedInputValueSearch, changeButton]);

  const handlePageChange = (page: number) => {
    setOrderAPI({ ...orderAPI, page: page });
  };
  const handleSearchInput = (value: string) => {
    setOrderAPI({ ...orderAPI, keyword: value });
  };
  return (
    <Container>
      <div className="grid grid-cols-5 pb-10">
        <div className="content-right-filter mt-[34px] col-span-5 max-2xl:col-span-5 ">
          {/* h2 */}
          <div>
            <h2 className="txt-filter font-bold text-[#1A1A1A] text-3xl max-2xl:text-2xl">
              VẬN CHUYỂN ĐƠN HÀNG
            </h2>
          </div>
          {/* end h2 */}
          {/* button */}
          <div className="flex mt-[45px] gap-5">
            {changeButton.map((btnItems) => {
              return (
                <button
                  className={`bg-white btn `}
                  style={{
                    backgroundColor: "white ",
                    borderColor: btnItems.active
                      ? getBorderColor(btnItems.id)
                      : "",
                    borderWidth: btnItems.active ? "1px" : "",
                  }}
                  onClick={() => btnFiterThrottle(btnItems.id)}
                >
                  {btnItems.text}
                  {btnItems.id == -1 && (
                    <div className="badge badge-xs badge-primary badge-outline py-2">
                      {order?.totalOrderShipping}
                    </div>
                  )}
                  {btnItems.id == 4 && (
                    <div className="badge badge-xs badge-warning badge-outline py-2">
                      {order?.statusCounts?.orderStatus4}
                    </div>
                  )}
                  {btnItems.id == 5 && (
                    <div className="badge badge-xs badge-secondary badge-outline py-2">
                      {order?.statusCounts?.orderStatus5}
                    </div>
                  )}
                  {btnItems.id == 6 && (
                    <div className="badge badge-xs badge-accent badge-outline py-2">
                      {order?.statusCounts?.orderStatus6}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {/* end button */}
          {/* card search */}
          <div
            className="mt-3 py-7 px-5 
          shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
          >
            <div className="flex gap-[24px]">
              <div
                className="Search-input-headerCenter items-center flex 
                                        py-[3px] px-[6px] border-[1px] border-[#FFAAAF] rounded-md"
              >
                <div className="mb-2">
                  <Search />
                </div>
                <input
                  className=" rounded-lg focus:outline-none text-lg relative pr-7 flex-1 pl-3 max-xl:text-sm max-lg:text-sm"
                  placeholder="Tìm kiếm..."
                  value={orderAPI.keyword}
                  onChange={(e) => handleSearchInput(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* end card search */}
          {/* checkBox and Printf */}
          <div className="grid grid-cols-2 items-center py-4 px-10">
            <div className="col-span-2 flex items-center gap-4 justify-end">
              <div className="hidden border-[#107C41] border-[1px] p-3 rounded-md hover:bg-[#d7fee1] cursor-pointer transition-all duration-150">
                <Excel />
              </div>
            </div>
          </div>
          {/* end checkBox and Printf*/}
          <div className="flex flex-col space-y-4">
            {order?.data?.length > 0 ? (
              order?.data?.map((e) => {
                return (
                  <>
                    {/* card */}
                    <div
                      className="p-10 group relative 
shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                    >
                      <div className="justify-between flex ">
                        <div className="col-span-2 flex items-center">
                          <div className="flex items-center gap-1">
                            <p className="text-[#4C4C4C] font-bold text-base">
                              Đơn hàng:{" "}
                            </p>
                            <p className="text-[#1A1A1A] font-bold text-base mr-3">
                              #00{e.id}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 border-l-2 border-[#4C4C4C] pl-2">
                            <p className="text-[#4C4C4C] font-bold text-base">
                              Khách Hàng:{" "}
                            </p>
                            <p className="text-[#1A1A1A] font-bold text-base mr-3">
                              {e.name}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[#EA4B48] text-2xl font-bold">
                            {numberFormat(e.amountTotal)}
                          </p>
                        </div>
                      </div>
                      <div className="">
                        <div className="my-2 flex justify-between items-center gap-2">
                          <div className="flex items-center">
                            {/* calendarIcon */}
                            <div>
                              <Calendar />
                            </div>
                            {/* end calendarIcon */}
                            <div className="flex">
                              <p className="text-[#4C4C4C] font-bold text-sm">
                                {dateOrder(e.createdAt)} lúc{" "}
                                {timeOrder(e.createdAt)}
                              </p>
                              <div className=" border-r-2 border-[#4C4C4C] mx-2"></div>
                              {e.paymentMethod == "Thẻ tín dụng" ||
                              getStatusOrder(e.status)._paymentStatus ? (
                                <div className="badge badge-xs badge-accent text-center py-2 px-3">
                                  <p className="font-bold text-xs text-white">
                                    Đã thanh toán
                                  </p>
                                </div>
                              ) : (
                                <div className="badge badge-xs badge-error text-center py-2 px-3">
                                  <p className="font-bold text-xs text-white">
                                    Chưa thanh toán
                                  </p>
                                </div>
                              )}

                              {/* <div className=" border-r-2 border-[#4C4C4C] mx-2"></div>
                                             <div className="flex items-center gap-2">
                                                <p className="text-[#4C4C4C] font-bold text-sm">
                                                   Mã vận đơn:
                                                </p>
                                                <p className="text-[#EA4B48] font-bold text-sm">
                                                   SPXR24
                                                </p>
                                             </div> */}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-5 gap-5">
                          <div className="max-w-max">
                            <div className="border-[1px] border-[#E0E0E0] rounded-md px-6 py-2 relative mx-3 w-[196px]">
                              <p>{getStatusOrder(e.status)._statusOrder}</p>
                              <p className="bg-white text-xs top-[-8px] absolute w-[60px] ">
                                Trạng thái
                              </p>
                            </div>
                          </div>
                          {/* end Select box  */}
                          {/* <div className="badge badge-xs badge-error py-3 px-5">
                          <p className="font-bold text-xs text-white ">Mới</p>
                        </div> */}
                        </div>
                        <div className="grid grid-cols-2 mt-4 ">
                          {e.OrderDetail.map((items) => {
                            return (
                              <>
                                {/* San pham */}
                                <div
                                  className="py-[16px] items-center"
                                  key={items.name}
                                >
                                  <div className="col-span-2 text-sm flex gap-4 items-center">
                                    {items.image && (
                                      <img
                                        className="w-[50px] h-[50px] object-contain"
                                        src={items.image}
                                        alt=""
                                      />
                                    )}
                                    <div>
                                      <p className="text-sm font-bold text-[#393939] max-[870px]:text-[13px]">
                                        {items.name}
                                      </p>
                                      <p className="text-xs text-[#1A1A1A] max-[870px]:text-[13px]">
                                        SL:{" "}
                                        <span className="text-[#4C4C4C]">
                                          x{items.quantity}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* end San pham */}
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div className="group-hover:opacity-100 flex absolute top-[50%] transform -translate-y-1/2 right-0 space-x-2 p-4 opacity-0 transition-opacity duration-500 ease-in-out">
                        <Link to={`/shipping/detail/${e.id}`}>
                          <button className="btn btn-outline hover:bg-[#E0E0E0] hover:text-[#4C4C4C] px-4 py-1 flex">
                            <p>Xem chi tiết</p>
                          </button>
                        </Link>
                      </div>
                    </div>
                    {/* end card */}
                  </>
                );
              })
            ) : (
              <>
                <div className="flex justify-center p-20">
                  <p className="text-2xl">Trống</p>
                </div>
              </>
            )}
            <ResponsivePagination
              current={orderAPI.page!}
              total={order.totalPage}
              onPageChange={handlePageChange}
              maxWidth={500}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
