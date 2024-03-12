import { useEffect, useRef, useState } from "react";
import LogoWeb from "../../../../assets/TSX/LogoWeb";
import Container from "../../../../components/container/Container";
import { formatDateYYYY, numberFormat } from "../../../../helper/Format";
import { useParams } from "react-router-dom";
import { orderControllers } from "../../../../controllers/OrderControllers";
import { OrderModel } from "../../../../model/OrderModel";
import { useReactToPrint } from "react-to-print";
import PrintOrder from "../../admin/assets/TSX/PrintOrder";

export default function InvoicesPage() {
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { id } = useParams();
  const idOrder = Number(id);
  const componentRef: any = useRef();

  const [invoice, setInvoice] = useState<OrderModel>({} as OrderModel);

  useEffect(() => {
    getInvoice();
  }, []);

  const getInvoice = async () => {
    await orderControllers.getDetails(idOrder).then((res) => {
      setInvoice(res);
    });
  };

  return (
    <>
      <Container>
        <div
          className="max-w-3xl mx-auto p-6 bg-white rounded border-[1px] shadow-sm my-6"
          ref={componentRef}
        >
          <div className="grid grid-cols-2 items-center">
            <div>
              <LogoWeb />
            </div>
            <div className="text-right">
              <p>Buyzzle Inc.</p>
              <p className="text-gray-500 text-sm">sales@buyzzle.com</p>
              <p className="text-gray-500 text-sm mt-1">+84-123456789</p>
              {/* <p className="text-gray-500 text-sm mt-1">
                        VAT: 8657671212
                     </p> */}
            </div>
          </div>
          <div className="grid grid-cols-2 items-center mt-8">
            <div>
              <p className="font-bold text-gray-800">Gửi đến:</p>
              <p className="text-gray-500">{invoice?.address}</p>
            </div>
            <div className="text-right">
              <p className="">
                Khách hàng:{" "}
                <span className="text-gray-500">{invoice?.name}</span>
              </p>
              <p>
                SĐT:{" "}
                <span className="text-gray-500">{invoice?.phoneNumber}</span>
                <br />
                Ngày đặt:{" "}
                <span className="text-gray-500">
                  {formatDateYYYY(invoice.createdAt)}
                </span>
              </p>
            </div>
          </div>
          <div className="-mx-4 mt-8 flow-root sm:mx-0">
            <table className="min-w-full">
              <colgroup>
                <col className="w-full sm:w-1/2" />
                <col className="sm:w-1/6" />
                <col className="sm:w-1/6" />
                <col className="sm:w-1/6" />
              </colgroup>
              <thead className="border-b border-gray-300 text-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Mặt hàng
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Số lượng
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Giá
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0"
                  >
                    Tổng
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice?.OrderDetail?.map((e) => {
                  return (
                    <>
                      <tr className="border-b border-gray-200">
                        <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="font-medium text-gray-900">
                            {e.name}
                          </div>
                          <div className="mt-1 truncate text-gray-500">{}</div>
                        </td>
                        <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                          {e.quantity}
                        </td>
                        <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">
                          {numberFormat(e.price)}
                        </td>
                        <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">
                          {numberFormat(e.total)}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                  >
                    Tổng tiền hàng
                  </th>
                  <th
                    scope="row"
                    className="pl-6 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden"
                  >
                    Tổng tiền hàng
                  </th>
                  <td className="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0">
                    {numberFormat(invoice.subtotal)}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                  >
                    Giảm giá
                  </th>
                  <th
                    scope="row"
                    className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
                  >
                    Giảm giá
                  </th>
                  <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                    -{numberFormat(invoice.discount)}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
                  >
                    Phí giao hàng
                  </th>
                  <th
                    scope="row"
                    className="pl-6 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden"
                  >
                    Phí giao hàng
                  </th>
                  <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">
                    {numberFormat(invoice.shipping)}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
                  >
                    Tổng thanh toán
                  </th>
                  <th
                    scope="row"
                    className="pl-6 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden"
                  >
                    Tổng thanh toán
                  </th>
                  <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
                    {numberFormat(invoice.amountTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {/*  Footer  */}
          <div className="border-t-2 pt-4 text-base text-gray-500 text-center mt-16">
            Cảm ơn bạn đã mua hàng
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handlePrint}
            className="justify-center gap-3 items-center text-sm font-bold text-[#4C4C4C]
                                 rounded-md py-[8px] px-3 flex
                                 transition duration-150 cursor-pointer border-[#E0E0E0] border-[1px]
                                 max-[1105px]:px-[80px] max-lg:px-[60px] max-lg:text-sm max-[850px]:px-[45px] max-[850px]:text-xs"
          >
            <PrintOrder />
            <p>In Ngay</p>
          </button>
        </div>
      </Container>
    </>
  );
}
