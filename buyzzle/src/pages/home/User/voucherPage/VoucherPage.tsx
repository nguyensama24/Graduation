import { useEffect, useState } from "react";
import { voucherControllers } from "../../../../controllers/VoucherControllers";
import EmptyPage from "../../../../helper/Empty/EmptyPage";
import { formatDate } from "../../../../helper/Format";
import { VoucherModel } from "../../../../model/VoucherModel";
import Container from "../../../../components/container/Container";
import Sitebar from "../UserProfile/sitebar/Sitebar";

export default function VoucherUserPage() {
  const [getVoucher, setGetVoucher] = useState<VoucherModel[]>([]);

  const getVoucherUser = async () => {
    await voucherControllers.GetUserSavedVoucher().then((res) => {
      setGetVoucher(res);
    });
  };

  useEffect(() => {
    getVoucherUser();
  }, []);

  return (
    <>
      <Container>
        <div className="body-filter container mx-auto">
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 max-2xl:hidden">
              <Sitebar />
            </div>
            <div className="mt-9 col-span-3 max-2xl:col-span-5">
              <h1 className="text-[32px] font-bold mb-4 max-lg:text-[28px] max-[870px]:text-2xl max-[769px]:text-xl">
                Voucher
              </h1>
              <div className="grid grid-cols-6 pb-7">
                <div className="col-span-2 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm">
                  <p>Mã Voucher</p>
                </div>
                <div className="col-span-2 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm">
                  <p>Giảm Giá</p>
                </div>
                <div className="col-span-2 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm">
                  <p>Thời Gian</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {getVoucher.length > 0 ? (
                  getVoucher.map((e) => {
                    return (
                      <>
                        <div className="grid grid-cols-6 py-4 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                          <div className="col-span-2 text-base text-[#4C4C4C] mx-auto">
                            <p
                              className="font-medium text-base text-[#EA4B48]
                                       max-[940px]:text-xs "
                            >
                              {e.code}
                            </p>
                          </div>
                          <div className="col-span-2 text-base text-[#4C4C4C] mx-auto">
                            <p
                              className="font-medium text-base text-[#1A1A1A] 
                                          max-[940px]:text-xs "
                            >
                              {e.discount ?? "FREE SHIP"}%
                            </p>
                          </div>
                          <div className="col-span-2 text-base text-[#4C4C4C] mx-auto">
                            <p
                              className="font-medium text-base text-[#1A1A1A]
                                      max-[940px]:text-xs "
                            >
                              {formatDate(e.startDay)} - {formatDate(e.endDay)}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <>
                    <EmptyPage title="Mã Voucher của bạn hiện đang trống !" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
