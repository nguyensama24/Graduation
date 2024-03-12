import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Map from "../../../assets/TSX/Map";
import NoteOrderAdmin from "../../../assets/TSX/NoteOrderAdmin";
import Container from "../../../components/container/Container";
import { orderControllers } from "../../../controllers/OrderControllers";
import { numberFormat } from "../../../helper/Format";
import StepperShipping from "../../../helper/Stepper/StepperShipping";
import { OrderModel, UpdateQuantityModal } from "../../../model/OrderModel";
import {
  dateOrder,
  timeOrder,
} from "../admin/Management/Order/OrderManagement";
import Back from "../admin/assets/TSX/Back";
import Paymethod from "../admin/assets/TSX/Paymethod";
import PhoneOrderAdmin from "../admin/assets/TSX/PhoneOrderAdmin";
import { getStatusOrder } from "../User/orderHistoryPage/OrderHistory";

export default function ShippingDetail() {
  const { id } = useParams();
  const idOrder = Number(id);

  const [order, setOrder] = useState<OrderModel>({} as OrderModel);

  const getOrder = async () => {
    await orderControllers.getDetails(idOrder).then((res) => {
      setOrder(res);
    });
  };

  useEffect(() => {
    getOrder();
  }, []);

  const setStatus = (status: number) => {
    let listProductQuantity: UpdateQuantityModal[] = [];
    order.OrderDetail.map((element) => {
      listProductQuantity.push({
        productId: element.productId!,
        quantity: element.quantity,
      });
    });

    orderControllers
      .setStatus(idOrder, status)
      .then(() => {
        getOrder();
        toast.success("Thành công");
      })
      .then(() => {
        if (status == 6) {
          orderControllers.updateSoldcount(listProductQuantity);
        }
      });
  };
  return (
    <>
      <Container>
        <div className="grid grid-cols-5 pb-10">
          <div className="content-right-filter mt-[34px] col-span-5 max-2xl:col-span-5 ">
            <div className="flex justify-between">
              <div className="flex gap-5 items-center text-center">
                <Link to={"/shipping/management"}>
                  <div className="back h-[57px]">
                    <div className="flex items-center">
                      <div className="border-[1px] border-[#EA4B48] rounded-md py-4 px-4 max-xl:p-3 max-lg:p-2">
                        <Back />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="content-center items-center">
                  <h2 className="txt-filter font-bold text-[#4C4C4C] text-3xl max-2xl:text-2xl">
                    ĐƠN HÀNG{" "}
                    <span className="text-[#1A1A1A]">#00{order.id}</span>
                  </h2>
                </div>
                <div className="flex flex-col gap-1">
                  {order.paymentMethod == "Thẻ tín dụng" ||
                  getStatusOrder(order.status)._paymentStatus ? (
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
                  <div>
                    <p className="text-[#4C4C4C] text-sm">
                      {dateOrder(order.createdAt)} lúc{" "}
                      {timeOrder(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 items-center"></div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-[34px] ">
              <div className="col-span-3 flex flex-col gap-8">
                <div className="flex flex-col gap-5 py-8 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                  <div className="px-5 text-xl font-semibold text-[#393939]">
                    <p>Chi Tiết Đơn Hàng</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-[#F2F2F2]">
                      <div className="grid grid-cols-4 py-[10px] px-4">
                        <h4 className="col-span-1 text-center font-normal text-[#1A1A1A] text-sm max-[870px]:text-xs">
                          SẢN PHẨM
                        </h4>
                        <div className="col-span-1"> </div>
                        <h4 className="col-span-1 font-normal text-[#1A1A1A] text-sm text-center max-[870px]:text-xs">
                          GIÁ
                        </h4>
                        <h4 className="col-span-1 items-center font-normal text-[#1A1A1A] text-sm text-center max-[870px]:text-xs">
                          TỔNG
                        </h4>
                      </div>
                    </div>

                    <div className="border-b-[1px] mx-4">
                      {order?.OrderDetail?.map((e) => {
                        return (
                          <>
                            <div className="grid grid-cols-4 pl-2 py-[16px] items-center bg-[#FFFFFF]">
                              <div className="col-span-2 text-sm flex gap-4 items-center">
                                <img
                                  className="w-[70px] h-[70px] object-contain"
                                  src={e.image}
                                  alt=""
                                />
                                <div>
                                  <p className="text-base font-medium text-[#393939] max-[870px]:text-[13px]">
                                    {e.name}
                                  </p>
                                  <p className="text-sm text-[#1A1A1A] font-medium max-[870px]:text-[13px]">
                                    SL:{" "}
                                    <span className="text-[#4C4C4C]">
                                      x{e.quantity}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="col-span-1 flex justify-center items-center">
                                <p className="font-medium text-[#1A1A1A] text-base max-[870px]:text-[13px]">
                                  {numberFormat(e.price)}
                                </p>
                              </div>
                              <div className="col-span-1">
                                <p className="font-medium text-[#EA4B48] text-base text-center max-[870px]:text-[13px]">
                                  {numberFormat(e.total)}
                                </p>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                    <div className="flex justify-end mt-6 px-16">
                      <div className="w-[270px] flex flex-col gap-3">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-[#393939] max-[870px]:text-[11px]">
                            Tổng Giá Sản Phẩm:{" "}
                          </p>
                          <p className="text-sm text-[#EA4B48] max-[870px]:text-[11px]">
                            {numberFormat(order.subtotal)}
                          </p>
                        </div>
                        <div className="flex justify-between border-t-[1px] pt-2">
                          <p className="text-sm font-medium text-[#393939] max-[870px]:text-[11px]">
                            Giảm:{" "}
                          </p>
                          <div className="flex gap-1">
                            <p className="text-sm text-[#FFAAAF] line-through max-[870px]:text-[11px]">
                              {numberFormat(order.discount)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between border-t-[1px] pt-2">
                          <p className="text-sm font-medium text-[#393939] max-[870px]:text-[11px]">
                            Phí Giao Hàng:{" "}
                          </p>
                          <div className="flex gap-1">
                            <p className="text-sm text-[#EA4B48] max-[870px]:text-[11px]">
                              {numberFormat(order.shipping)}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t-[1px] pt-2">
                          <p className="text-sm font-medium text-[#393939] max-[870px]:text-[11px]">
                            Tổng Thanh Toán:{" "}
                          </p>
                          <p className="text-xl text-[#EA4B48] font-semibold max-[870px]:text-sm">
                            {order?.paymentMethod == "Thẻ tín dụng"
                              ? "Đã thanh toán"
                              : numberFormat(order.amountTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-8 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                  <div className="px-5 text-xl font-semibold text-[#393939] pb-3 border-b-[1px]">
                    <p>Trạng Thái Đơn Hàng</p>
                  </div>
                  <div className="px-11 pt-4">
                    <StepperShipping
                      status={order.status}
                      comfirm={(status) => setStatus(status)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="flex flex-col gap-5 px-5 py-8 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                  <div className="text-xl font-semibold text-[#393939]">
                    <p>Thông Tin Khách hàng</p>
                  </div>

                  <div className="flex justify-between mb-8">
                    <div className="flex gap-1">
                      {order.User && order.User.UserImage?.[0]?.url ? (
                        <img
                          className="w-[40px] h-[40px] object-cover rounded-full"
                          src={order.User.UserImage?.[0].url}
                          alt=""
                        />
                      ) : (
                        <div className="w-[40px] h-[40px] object-cover rounded-full bg-red-500 pt-2 pb-2 ps-4 pe-4">
                          <p className="text-1xl text-stone-50">
                            {order?.name?.length > 0
                              ? (order?.name).substring(0, 1).toUpperCase()
                              : ""}{" "}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm">
                          {order?.name?.length > 0 ? order?.name : ""}{" "}
                        </p>

                        <p className="text-[#12b004] text-[10px]">
                          {order?.name?.length ? order?.phoneNumber : ""}{" "}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 mb-10">
                    <p className="text-xl font-semibold text-[#393939]">
                      Địa Chỉ Nhận Hàng
                    </p>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center text-[#4C4C4C] font-medium text-sm">
                          <PhoneOrderAdmin />
                          <p>Phone</p>
                        </div>
                        <p className="pl-2 border-l-[1px] border-[#FFAAAF] font-semibold text-[#5D5FEF] text-sm">
                          {order?.phoneNumber}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center text-[#4C4C4C] font-medium text-sm">
                          <Map />
                          <p>Địa Chỉ</p>
                        </div>
                        <div className="pl-2 border-l-[1px] border-[#FFAAAF] font-semibold">
                          <p className="text-[#1A1A1A] text-sm">
                            {order?.name}
                          </p>
                          <p className="text-[#4C4C4C] text-sm">
                            {order?.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center text-[#4C4C4C] font-medium text-sm">
                          <NoteOrderAdmin />
                          <p>Ghi chú</p>
                        </div>
                        <div className="pl-2 border-l-[1px] border-[#FFAAAF] font-semibold">
                          {order?.note == "" || order?.note == null ? (
                            <p className="text-[#1A1A1A] text-sm">Không có</p>
                          ) : (
                            <p className="text-[#1A1A1A] text-sm">
                              {order?.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <p className="text-xl font-semibold text-[#393939]">
                      Thanh Toán
                    </p>

                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center text-[#4C4C4C] font-medium text-sm">
                          <Paymethod />
                          <p>Phương thức thanh toán</p>
                        </div>
                        <p className="pl-2 border-l-[1px] border-[#FFAAAF] font-semibold text-[#5D5FEF] text-sm">
                          {order?.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
