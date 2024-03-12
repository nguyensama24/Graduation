import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ResponsivePagination from "react-responsive-pagination";
import Search from "../../../../../assets/TSX/Search";
import {
  voucherControllers,
  voucherModel,
} from "../../../../../controllers/VoucherControllers";
import DialogComfirm from "../../../../../helper/Dialog/DialogComfirm";
import DialogModal from "../../../../../helper/Dialog/DialogModal";
import { toastSuccess } from "../../../../../helper/Toast/Success";
// import { Voucher, VoucherModel } from "../../../../../Model/VoucherModel";
import { Voucher, VoucherModel } from "../../../../../model/VoucherModel";
import Container from "../../../../../components/container/Container";
import useDebounce from "../../../../../useDebounceHook/useDebounce";
import Edit from "../../assets/TSX/Edit";
import PlusSquare from "../../assets/TSX/PlusSquare";
import RemoveCate from "../../assets/TSX/RemoveCate";
import Handle from "../../assets/TSX/bacham";
import SitebarAdmin from "../../Sitebar/Sitebar";

type FormValues = {
  id: number;
  discount: string;
  startDate: string;
  endDate: string;
  quantity: string;
  voucherCode: string;
};

export default function VoucherPage() {
  const idModal = "voucher";
  const idRemove = "removeVoucher";

  const [vouchers, setVoucher] = useState<Voucher>({} as Voucher);
  const [voucherAPI, setVoucherAPI] = useState<voucherModel>({
    pageSize: 6,
  });
  const [idVoucher, setIdVoucher] = useState<number | undefined>(0);
  const debouncedInputValueSearch = useDebounce(voucherAPI.keyword, 500);

  const currentDate = (date: Date) => {
    return moment(date).format("L");
  };
  useEffect(() => {
    getVoucher();
  }, [voucherAPI.page, debouncedInputValueSearch]);

  const getVoucher = async () => {
    await voucherControllers.getAdmin(voucherAPI).then((res) => {
      setVoucher(res);
    });
  };
  const handlePageChange = (page: number) => {
    setVoucherAPI({ ...voucherAPI, page: page });
  };
  const handleSearchInput = (value: string) => {
    setVoucherAPI({ ...voucherAPI, keyword: value });
  };
  const onRemoveVoucher = async (id: number | undefined) => {
    await voucherControllers.remove(id);
    getVoucher();
    closeModal(idRemove);
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      id: 0,
      discount: "",
      quantity: "",
      voucherCode: "",
      startDate: "",
      endDate: "",
    },
  });

  const openModal = async (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  const closeModal = async (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      clearErrors();
      reset({});
      modal.close();
    }
  };

  const saveModal = (data: FormValues) => {
    const dataForm: VoucherModel = {
      id: Number(data.id),
      discount: Number(data.discount),
      quantity: Number(data.quantity),
      code: data.voucherCode,
      startDay: new Date(data.startDate),
      endDay: new Date(data.endDate),
    };

    closeModal(idModal);
    if (data.id == 0) {
      voucherControllers.add(dataForm).then(() => {
        getVoucher();
        toastSuccess("Thành Công");
      });
    } else {
      voucherControllers.update(dataForm.id, dataForm).then(() => {
        getVoucher();
        toastSuccess("Thành Công");
      });
    }

    reset({});
  };

  return (
    <>
      <Container>
        <div className="grid grid-cols-5">
          <div className="col-span-1 max-2xl:hidden">
            <SitebarAdmin />
          </div>

          <div className="content-right-filter col-span-4 flex flex-col gap-4 max-2xl:col-span-5">
            <div>
              <h2
                className="txt-filter font-bold text-[#1A1A1A] text-3xl
                                max-lg:text-xl"
              >
                QUẢN LÝ DANH SÁCH MÃ GIẢM GIÁ
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    openModal(idModal), reset({ id: 0 });
                  }}
                  className="flex gap-3 items-center bg-[#EA4B48] border-[#FFAAAF] border-[1px] px-4 rounded-md h-[46px]"
                >
                  <PlusSquare />
                  <p className="cursor-pointer text-white text-base font-bold max-[940px]:text-sm ">
                    Thêm Voucher
                  </p>
                </button>
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
                      value={voucherAPI.keyword}
                      onChange={(e) => handleSearchInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7">
                <div>
                  <DialogModal
                    body={
                      <>
                        <div className="grid grid-cols-4 mb-5 gap-5 max-[940px]:gap-2">
                          <div className="col-span-2">
                            <div className="flex flex-col gap-1">
                              <Controller
                                name="voucherCode"
                                control={control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Không để trống",
                                  },
                                  maxLength: {
                                    value: 20,
                                    message: "Nhiều nhất 20 ký tự",
                                  },
                                  minLength: {
                                    value: 4,
                                    message: "Ít nhất 4 ký tự",
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <label className="text-sm text-[#4C4C4C] max-xl:text-xs max-lg:text-[10px]">
                                      Mã Voucher*
                                    </label>

                                    <input
                                      className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2
                                             max-xl:text-xs max-lg:text-[10px]
                                            `}
                                      placeholder="Nhập mã voucher"
                                      name="name"
                                      value={field.value}
                                      onChange={(e) => {
                                        const reg = /[!@#$%^& ]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                    />
                                    {errors.voucherCode && (
                                      <p className="text-[11px] text-red-700">
                                        {errors.voucherCode.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="flex flex-col gap-1">
                              <Controller
                                name="startDate"
                                control={control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Hãy chọn ngày",
                                  },
                                  validate: (date: string) => {
                                    const valid = moment(date).isBefore(
                                      moment().subtract(1, "days").toDate()
                                    );
                                    return valid == true
                                      ? "Thời gian không hợp lệ"
                                      : undefined;
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <label className="text-sm text-[#4C4C4C] max-xl:text-xs max-lg:text-[10px]">
                                      Thời Gian Bắt Đầu
                                    </label>

                                    <input
                                      className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2
                                             max-xl:text-xs max-lg:text-[10px]
                                            `}
                                      name="name"
                                      type="date"
                                      value={field.value}
                                      onChange={(e) => {
                                        const reg = /[!]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                    />
                                    {errors.startDate && (
                                      <p className="text-[11px] text-red-700">
                                        {errors.startDate.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="flex flex-col gap-1">
                              <Controller
                                control={control}
                                name="endDate"
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Hãy chọn ngày",
                                  },
                                  validate: (date: string) => {
                                    const valid = moment(date).isBefore(
                                      watch("startDate")
                                    );
                                    return valid == true
                                      ? "Thời gian không hợp lệ"
                                      : undefined;
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <label className="text-sm text-[#4C4C4C] max-xl:text-xs max-lg:text-[10px]">
                                      Thời Gian Kết Thúc
                                    </label>

                                    <input
                                      className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2
                                             max-xl:text-xs max-lg:text-[10px]
                                            `}
                                      name="name"
                                      type="date"
                                      value={field.value}
                                      onChange={(e) => {
                                        const reg = /[!@#$%^&]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                    />
                                    {errors.endDate && (
                                      <p className="text-[11px] text-red-700">
                                        {errors.endDate.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-5 max-[940px]:gap-2">
                          <div className="col-span-2">
                            <div className="flex flex-col gap-1">
                              <Controller
                                control={control}
                                name="discount"
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Hãy nhập số",
                                  },
                                  maxLength: {
                                    value: 2,
                                    message: "Nhỏ hơn 100%",
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <label className="text-sm text-[#4C4C4C] max-xl:text-xs max-lg:text-[10px]">
                                      Giảm Giá (%)*
                                    </label>
                                    <input
                                      className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%]
                                             max-xl:text-xs max-lg:text-[10px]
                                            `}
                                      placeholder="Nhập % giảm giá"
                                      type="number"
                                      name="name"
                                      value={field.value}
                                      onChange={(e) => {
                                        const reg = /[a-zA-Z!@#$e]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                    />

                                    {errors.discount && (
                                      <p className="text-[11px] text-red-700">
                                        {errors.discount.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="flex flex-col gap-1">
                              <Controller
                                name="quantity"
                                control={control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Hãy nhập số",
                                  },
                                  maxLength: {
                                    value: 4,
                                    message: "Nhỏ hơn 10000",
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <label className="text-sm text-[#4C4C4C] max-xl:text-xs max-lg:text-[10px]">
                                      Số Lượng Voucher
                                    </label>

                                    <input
                                      className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%]
                                             max-xl:text-xs max-lg:text-[10px]
                                            `}
                                      placeholder="Nhập số lượng voucher"
                                      type="number"
                                      name="name"
                                      value={field.value}
                                      onChange={(e) => {
                                        const reg = /[a-zA-Z!@#$e]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                    />
                                    {errors.quantity && (
                                      <p className="text-[11px] text-red-700">
                                        {errors.quantity.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    }
                    id={idModal}
                    title="Mã Voucher"
                    onClose={() => closeModal(idModal)}
                    onSave={handleSubmit((data: any) => {
                      saveModal(data);
                    })}
                  />
                </div>
              </div>

              <div className="">
                <div className="grid grid-cols-8 pb-7">
                  <div className="col-span-2 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm">
                    <p>Mã Voucher</p>
                  </div>
                  <div className="col-span-1 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm">
                    <p>Giảm Giá</p>
                  </div>
                  <div className="col-span-2 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm">
                    <p>Thời Gian</p>
                  </div>
                  <div className="col-span-1 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm">
                    <p>Đã Dùng</p>
                  </div>
                  <div className="col-span-1 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm">
                    <p>Còn Lại</p>
                  </div>
                  <div className="col-span-1 text-base text-[#4C4C4C] mx-auto max-[940px]:text-sm"></div>
                </div>

                <div className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
                  {vouchers.data?.map((e) => {
                    return (
                      <>
                        <div className="grid grid-cols-8 border-t-[1px] py-4">
                          <div className="col-span-2 text-base text-[#4C4C4C] mx-auto">
                            <p
                              className="font-medium text-base text-[#EA4B48]
                                 max-[940px]:text-xs "
                            >
                              {e.code}
                            </p>
                          </div>
                          <div className="col-span-1 text-base text-[#4C4C4C] mx-auto">
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
                              {currentDate(e.startDay)} -{" "}
                              {currentDate(e.endDay)}
                            </p>
                          </div>
                          <div className="col-span-1 text-base text-[#4C4C4C] mx-auto">
                            <p
                              className="font-medium text-base text-[#1A1A1A]
                                 max-[940px]:text-xs "
                            >
                              {e.used!}
                            </p>
                          </div>
                          <div className="col-span-1 text-base text-[#4C4C4C] mx-auto">
                            <p
                              className="font-medium text-base text-[#1A1A1A]
                                 max-[940px]:text-xs "
                            >
                              {e.quantity}
                            </p>
                          </div>
                          <div className="col-span-1 flex justify-center mr-5">
                            <div className="dropdown dropdown-right">
                              <label tabIndex={0}>
                                <Handle />
                              </label>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-white rounded-box w-52
                                                shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]
                                                max-2xl:right-[100%] max-2xl:origin-left max-[940px]:w-32 max-[940px]:h-[88px] max-[940px]:rounded"
                              >
                                <li>
                                  <button
                                    onClick={() => {
                                      openModal(idModal);
                                      reset({
                                        id: e.id,
                                        discount: e.discount.toString(),
                                        startDate: moment(e.startDay).format(
                                          "YYYY-MM-DD"
                                        ),
                                        endDate: moment(e.endDay).format(
                                          "YYYY-MM-DD"
                                        ),
                                        quantity: e.quantity.toString(),
                                        voucherCode: e.code,
                                      });
                                    }}
                                    className="flex items-center gap-4"
                                  >
                                    <Edit />
                                    <p
                                      className="text-[#EA4B48] text-sm font-medium
                                            max-[940px]:text-xs "
                                    >
                                      Sửa
                                    </p>
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      openModal(idRemove);
                                      setIdVoucher(e.id);
                                    }}
                                    className="flex items-center gap-4"
                                  >
                                    <RemoveCate />
                                    <p
                                      className="text-[#EA4B48] text-sm font-medium
                                             max-[940px]:text-xs "
                                    >
                                      Xóa
                                    </p>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                </div>
                <div className="mt-10">
                  <ResponsivePagination
                    current={voucherAPI.page!}
                    total={vouchers.totalPage}
                    onPageChange={handlePageChange}
                    maxWidth={500}
                  />
                </div>

                <DialogComfirm
                  desc="voucher"
                  onClose={() => closeModal(idRemove)}
                  title="Xóa voucher này"
                  onSave={() => onRemoveVoucher(idVoucher)}
                  id={idRemove}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
