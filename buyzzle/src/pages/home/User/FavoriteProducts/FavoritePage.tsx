import { Images } from "../../../../assets/ts";
import { numberFormat } from "../../../../helper/Format";
import Container from "../../../../components/container/Container";

import Sitebar from "../UserProfile/sitebar/Sitebar";
import Cart from "../../admin/assets/TSX/Cart";
import Delete from "../../admin/assets/TSX/Delete";

export default function FavoritePage() {
  return (
    <>
      <Container>
        <div className="body-filter container mx-auto">
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 max-2xl:hidden">
              <Sitebar />
            </div>
            <div className="col-span-3 max-2xl:col-span-5 flex flex-col gap-6">
              <div
                className="bg-white py-7 mt-[40px] rounded-md items-center
                shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]
                grid grid-cols-8 px-10"
              >
                <div className="col-span-3">
                  <p className="text-[#1A1A1A] text-base font-medium">
                    Sản Phẩm
                  </p>
                </div>
                <div className="col-span-2 flex justify-evenly">
                  <p className="text-[#1A1A1A] text-base font-medium">
                    Đơn giá
                  </p>
                </div>
                <div className="col-span-3 flex justify-end">
                  <p className="text-[#1A1A1A] text-base font-medium">
                    Thao Tác
                  </p>
                </div>
              </div>

              <div
                className="bg-white h-auto rounded-md items-center py-[15px]
                              shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]
                                 grid grid-cols-8 px-10"
              >
                <div className="flex col-span-3 items-center">
                  <img
                    src={Images.cateAD}
                    className="w-[90px] h-[90px] object-contain"
                    alt="product"
                  />
                  <div>
                    {/* <Link
                                          to={`/Detailproducts/${e.productid}`}
                                       > */}
                    <p className="text-[#1A1A1A] text-sm font-medium mx-3">
                      Ly giữ nhiệt cao cấp Tyeso V2 900ml
                    </p>
                    {/* </Link> */}
                    <div className="bg-[#f9e9e9] rounded-[30px] max-w-max mx-3 mt-3">
                      <p className="text-[#EA4B48] text-[13px] px-[10px] py-1">
                        Giảm 47%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex gap-3 items-center justify-center">
                    <p className="text-[#7A828A] text-xs line-through leading-none	">
                      {numberFormat(60000)}
                    </p>{" "}
                    <p className="text-[#EA4B48] text-sm">
                      {numberFormat(36000)}
                    </p>
                  </div>
                </div>
                <div className="col-span-3 justify-end items-center flex gap-5">
                  <button
                    onClick={() => {
                      // addProduct(Number(id), quantity);
                    }}
                    className="flex items-center w-[190px] rounded-md h-[50px] hover:bg-[#FFEAE9] transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly cursor-pointer"
                  >
                    <Cart />
                    <p className="text-center text-[13px] font-bold text-[#4C4C4C] ">
                      Thêm Vào Giỏ Hàng
                    </p>
                  </button>
                  <button
                    // onClick={() => {
                    //     openModal(idItemCart);
                    //     setIdProduct(Number(e.productid));
                    // }}
                    className="p-3 rounded-full
                    shadow-[rgba(108,_108,_108,_0.25)_0px_0px_4px_0px]"
                  >
                    <Delete />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
