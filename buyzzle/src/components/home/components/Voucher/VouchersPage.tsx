import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import LogoVoucher from "../../../../assets/TSX/LogoVoucher";
import VoucherManage from "../../../../assets/TSX/VoucherManage";
import VoucherManageItem from "../../../../assets/TSX/VoucherManageItem";
import { userController } from "../../../../controllers/UserController";
import { voucherControllers } from "../../../../controllers/VoucherControllers";
import DialogLogin from "../../../../helper/Dialog/DialogLogin";
import { formatDate } from "../../../../helper/Format";
import { toastWarn } from "../../../../helper/Toast/Warning";
import { VoucherModel } from "../../../../model/VoucherModel";
import { LoginForm } from "../../../../pages/home/User/DetailProduct/detailProductPage/DetailsProduct";
import Container from "../../../container/Container";
export default function VouchersPage() {
  const [voucher, setVoucher] = useState<VoucherModel[]>([]);
  const [Logined, setLogined] = useState<boolean>();
  const getVoucher = async () => {
    await voucherControllers.getUser(1).then((res) => {
      setVoucher(res.data);
    });
  };
  useEffect(() => {
    getVoucher();
  }, []);

  const savedVoucher = (id: number) => {
    voucherControllers
      .userSavedVoucher(id)
      .then((_) => {
        getVoucher();  // if ((await response).status === 200) {
      
        toast.success("Lưu voucher thành công", {
          position: "top-right",
          autoClose: 5000,
        });
        // }
      })
      .catch((err) => {
        toastWarn(err.response?.data);
      });
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user != null) {
      setLogined(true);
    } else {
      setLogined(false);
    }
  }, []);
  const CheckLogin = async () => {
    if (Logined == false) {
      openModal(idAddAdmin);
    } else {
      setLogined(true);
    }
  };
  const {
    control,
    handleSubmit, 
    reset,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "all",
  });
  const idAddAdmin = "AddAdmin";
  const Login = async (data: LoginForm) => {
   
    userController.Login(data).then((res) => {
     
      const username = res.username;
      const accessToken = res.accessToken;
     
      const UserData = { username };
      const Token = { accessToken };
      localStorage.setItem("idUser", JSON.stringify(res.id));
      localStorage.setItem("user", JSON.stringify(UserData));
      localStorage.setItem("accessToken", JSON.stringify(Token));
      // const id = param.id;
      setTimeout(() => {
        window.location.href = `/voucher`;
      }, 2000);
    });
  };
  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  const closeModal2 = async (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };
  const saveModal = (id: string, data: LoginForm) => {
    Login(data);
    reset({
      email: "",
      password: "",
    });
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  return (
    <Container>
      <div className="pt-2 pb-5 flex justify-center relative">
        <div className="flex gap-3 items-center border-b-[2px] border-b-[#F7755F] py-5 w-[70%] justify-center ">
          <div className="flex flex-col items-center">
            <p className="font-bold text-[18px] text-[#4C4C4C]">VOUCHER</p>
            <p className="font-bold text-[24px] text-[#4C4C4C]">BUYZZLE</p>
          </div>
          <div className="bg-[#F7755F] ">
            <VoucherManage />
          </div>
        </div>
      </div>
      <div>
        <DialogLogin
          id={idAddAdmin}
          onClose={() => closeModal2(idAddAdmin)}
          onSave={handleSubmit((data: any) => {
            saveModal(idAddAdmin, data);
          })}
          title="Đăng Nhập"
          body={
            <>
              <div className="grid grid-cols-5 gap-8">
                <div className="col-span-3 ">
                  <div className="flex gap-3  ">
                    <div className="flex flex-col gap-5 max-lg:gap-2">
                      <div className="h-[90px] w-[400px]">
                        <Controller
                          name="email"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: "Không để trống",
                            },
                            minLength: {
                              value: 4,
                              message: "Ít nhất 4 ký tự",
                            },
                            // maxLength: {
                            //   value: ,
                            //   message:
                            //     "Nhiều nhất 25 kí tự",
                            // },
                            validate: {
                              // Kiểm tra email có đúng định dạng không
                              validEmail: (value) =>
                                /^[A-Z0-9._%±]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(
                                  value
                                ) || "Email không hợp lệ",
                            },
                          }}
                          render={({ field }) => (
                            <>
                              <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                                Email
                              </label>
                              <input
                                className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                                placeholder="Nhập vào email của bạn"
                                value={field.value}
                                onChange={(e) => {
                                  const reg = /[!#$%^&]/;
                                  const value = e.target.value;
                                  field.onChange(
                                    value.replace(reg, "")
                                  );
                                }}
                                name="email"
                              />
                              {errors.email && (
                                <p className="text-[11px] text-red-700 mt-0">
                                  {errors.email.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3  ">
                    <div className="flex flex-col gap-5 max-lg:gap-2">
                      <div className="h-[90px] w-[400px]">
                        <Controller
                          name="password"
                          control={control}
                          rules={{
                            required: {
                              value: true,
                              message: "Không để trống",
                            },
                            minLength: {
                              value: 4,
                              message: "Ít nhất 4 ký tự",
                            },
                            maxLength: {
                              value: 25,
                              message: "Nhiều nhất 25 kí tự",
                            },
                          }}
                          render={({ field }) => (
                            <>
                              <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                                Mật khẩu
                              </label>
                              <input
                                className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                                type="password"
                                placeholder="Nhập vào mật khẩu"
                                value={field.value}
                                onChange={(e) => {
                                  const reg = /[!@#$%^&]/;
                                  const value = e.target.value;
                                  field.onChange(
                                    value.replace(reg, "")
                                  );
                                }}
                                name="password"
                              />
                              {errors.password && (
                                <p className="text-[11px] text-red-700 mt-0">
                                  {errors.password.message}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        />
      </div>
      <div className="grid grid-cols-4 gap-5">
        {voucher.map((e) => {
          let isSave: boolean = e.savedBy?.length! > 0;
          return (
            <>
              <div className="col-span-1 relative ">
                <VoucherManageItem />
                <div className="absolute left-[4%] top-[11%] flex flex-col gap-3 items-center">
                  <p className="font-bold text-xs text-[#F7755F]">
                    GIẢM {e.discount}%
                  </p>
                  <p className="text-[#4C4C4C] text-sm font-semibold bg-[#FFEAE9] w-[85%] text-center py-1">
                    #{e.code}
                  </p>
                  <div
                    className={`flex items-center ml-3 ${isSave ? `gap-2` : `gap-3`
                      }`}
                  >
                    {
                      Logined == true ? (
                        <button
                          onClick={() => !isSave && savedVoucher(e.id)}
                          className={`${isSave
                            ? `cursor-not-allowed bg-white border-[1px] border-[#F7755F] text-[#F7755F] px-3`
                            : `bg-[#F7755F] text-white hover:bg-[#ec8f7f] px-3`
                            } py-1 rounded  font-semibold text-xs`}
                        >
                          {isSave
                            ? e.savedBy![0].used
                              ? "Đã dùng"
                              : "Đã lưu"
                            : "Lưu"}
                        </button>
                      ) : (
                        <button
                          onClick={CheckLogin}
                          className={`${isSave
                            ? `cursor-not-allowed bg-white border-[1px] border-[#F7755F] text-[#F7755F] px-3`
                            : `bg-[#F7755F] text-white hover:bg-[#ec8f7f] px-3`
                            } py-1 rounded  font-semibold text-xs`}
                        >
                          {isSave
                            ? e.savedBy![0].used
                              ? "Đã dùng"
                              : "Đã lưu"
                            : "Lưu"}
                        </button>
                      )
                    }
                    <p className="text-xs font-medium text-[#EA4B48]">
                      {formatDate(e.startDay)} - {formatDate(e.endDay)}
                    </p>
                  </div>
                </div>

                <div className="absolute right-[10%] top-[11%] flex flex-col items-center gap-1">
                  <p className="text-white font-bold text-sm">BUYZZLE</p>
                  <LogoVoucher />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </Container>
  );
}
