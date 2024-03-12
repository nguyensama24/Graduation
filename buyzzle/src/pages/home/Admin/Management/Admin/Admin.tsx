import { download, generateCsv } from "export-to-csv";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ResponsivePagination from "react-responsive-pagination";
import { toast } from "react-toastify";
import Search from "../../../../../assets/TSX/Search";
import Container from "../../../../../components/container/Container";
import {
  AdminModel,
  adminController,
} from "../../../../../controllers/AdminControllder";
import DialogAddAdmin from "../../../../../helper/Dialog/DialogAddAdmin";
import EmptyPage from "../../../../../helper/Empty/EmptyPage";
import { csvConfig } from "../../../../../helper/Export/Excel";
import { ModelAdmin } from "../../../../../model/AdminModel";
import useDebounce from "../../../../../useDebounceHook/useDebounce";
import SitebarAdmin from "../../Sitebar/Sitebar";
import Download from "../../assets/TSX/Download";
import Edit from "../../assets/TSX/Edit";
import PlusSquare from "../../assets/TSX/PlusSquare";
import Handle from "../../assets/TSX/bacham";

export interface admin {
  id: number;
  username: string;
  name: string;
  email: string;
  sex: boolean;
  dateofbirth: string;
  phonenumber: string;
}
export interface FormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  dateofbirth: string;
  phonenumber: string;
  sex: boolean;
}

export default function Admin() {
  const [sex, setSex] = useState<boolean>(true);
  const [admin, setAdmin] = useState<ModelAdmin>({} as ModelAdmin);
  const [adminAPI, setAdminAPI] = useState<AdminModel>({
    pageSize: 2,
  });
  const debouncedInputValueSearch = useDebounce(adminAPI.keyword, 500);

  const idAddAdmin = "AddAdmin";

  const {
    control,
    handleSubmit,
    setError,
    reset,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
  });
  const handleSexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSex(JSON.parse(event.target.value));
  };
  const getAllAdmin = () => {
    adminController
      .getAllAdmin(adminAPI)
      .then((res) => {
        return res;
      })
      .then((res) => {
        if (res[0]?.dateofbirth == null) {
          res.dateofbirth = "dd/mm/yyyy";
        } else {
          res.dateofbirth = (res[0]?.dateofbirth).substring(0, 10);
        }
        
        setAdmin(res);
      });
  };

  useEffect(() => {
    getAllAdmin();
  }, [adminAPI.page, debouncedInputValueSearch]);
  const handlePageChange = (page: number) => {
    setAdminAPI({ ...adminAPI, page: page });
  };
  const handleSearchInput = (value: string) => {
    setAdminAPI({ ...adminAPI, keyword: value });
  };
  function JumpEditUser(username: any) {
    window.location.href = `adminprofile/${username}`;
  }

  const AddAdmin = (data: FormValues) => {
    data.sex = sex;
    adminController
      .AddAdmin(data)
      .then((res) => {
        toast.success("Thêm thành công !");
        reset({
          name: "",
          username: "",
          email: "",
          password: "",
          dateofbirth: "",
          phonenumber: "",
          sex: Boolean(sex),
        });
        const modal = document.getElementById(
          idAddAdmin
        ) as HTMLDialogElement | null;

        if (modal) {
          modal.close();
        }
        getAllAdmin();
      })
      .catch((error) => {
        if (error.response?.data == "Email đã được sử dụng") {
          setError("email", {
            message: "Email đã được sử dụng",
          });
        } else {
          setError("phonenumber", {
            message: "Sdt đã được sử dụng",
          });
        }
        return;
      });
  };
  function reformatDate(dateStr: any) {
    var dArr = dateStr.split("-"); // ex input: "2010-01-18"
    return dArr[2] + "/" + dArr[1] + "/" + dArr[0].substring(0); //ex output: "18/01/10"
  }
  const openModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      //  reset({ name: data.name, id: data.id });
      //  setUrl(data.image);
      modal.showModal();
    }
  };
  const closeModal = async (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  return (
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
              QUẢN LÝ DANH SÁCH ADMIN
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between mb-7">
              <div className="items-center bg-[#EA4B48] rounded-md h-[46px] flex px-6">
                <button
                  className="flex gap-3"
                  onClick={() => openModal(idAddAdmin)}
                >
                  <PlusSquare />
                  <p className="cursor-default text-white text-base font-bold ">
                    Thêm Admin
                  </p>
                </button>
              </div>

              <DialogAddAdmin
                id={idAddAdmin}
                onClose={() => closeModal(idAddAdmin)}
                onSave={handleSubmit((data) => {
                  AddAdmin(data);
                })}
                title="Thêm Admin"
                body={
                  <>
                    <div className="grid grid-cols-5 gap-8">
                      <div className="col-span-3 ">
                        <div className="flex gap-3  ">
                          <div className="flex flex-col gap-5 max-lg:gap-2">
                            <div className="h-[90px] w-[500px]">
                              <Controller
                                name="name"
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
                                      Tên
                                    </label>
                                    <input
                                      className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                                      placeholder="Nhập vào tên"
                                      value={field.value}
                                      onChange={(e) => {
                                        const reg = /[!@#$%^&]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                      name="name"
                                    />
                                    {errors.name && (
                                      <p className="text-[11px] text-red-700 mt-0">
                                        {errors.name.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 ">
                          <div className="flex flex-col gap-5 max-lg:gap-2">
                            <div className="h-[90px] w-[500px]">
                              <Controller
                                name="username"
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
                                      Tên tài khoản
                                    </label>
                                    <input
                                      className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                                      placeholder="Nhập vào tên tài khoản"
                                      value={field.value}
                                      onChange={(e) => {
                                        const reg = /[!@#$%^&]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
                                      }}
                                      name="username"
                                    />
                                    {errors.username && (
                                      <p className="text-[11px] text-red-700 mt-0">
                                        {errors.username.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 ">
                          <div className="flex flex-col gap-5 max-lg:gap-2">
                            <div className="h-[90px] w-[500px]">
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
                                      placeholder="Nhập vào mật khẩu"
                                      value={field.value}
                                      type="password"
                                      onChange={(e) => {
                                        const reg = /[!@#$%^&]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
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

                        <div className="flex gap-3 ">
                          <div className="flex flex-col gap-5 max-lg:gap-2">
                            <div className="h-[90px] w-[500px]">
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
                                  //   value: 25,
                                  //   message: "Nhiều nhất 25 kí tự",
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
                                      placeholder="Nhập vào Email"
                                      value={field.value}
                                      onChange={(e) => {
                                        const reg = /[!#$%^&]/;
                                        const value = e.target.value;
                                        field.onChange(value.replace(reg, ""));
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
                        <div className="w-[500px] flex justify-between">
                          <div className="w-[48%] mb-[15px]">
                            <label
                              htmlFor="name"
                              className="text-[#4C4C4C] text-sm font-medium"
                            >
                              Giới tính:
                            </label>
                            <div className="flex w-[100%] mt-3">
                              <div className="flex items-center w-[33%] gap-1">
                                <div>
                                  <h3>Nam</h3>
                                </div>
                                <div className="flex items-center justify-start ">
                                  <input
                                    type="radio"
                                    // name="colored-radio"
                                    id="orange-radio1"
                                    value="true"
                                    {...register("sex")}
                                    checked={sex === true}
                                    onChange={handleSexChange}
                                    className="appearance-none h-6 w-6 border border-[#CCCCCC] rounded-full 
                                        checked:bg-[#EA4B48] checked:scale-75 transition-all duration-200 peer "
                                  />
                                  <div
                                    className="h-6 w-6 absolute rounded-full pointer-events-none
                                        peer-checked:border-[#EA4B48] peer-checked:border-2"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center w-[33%] ml-[30px] gap-1">
                                <div>
                                  <h3>Nữ</h3>
                                </div>
                                <div className="flex items-center justify-start ">
                                  <input
                                    type="radio"
                                    // name="colored-radio"
                                    id="orange-radio2"
                                    value="false"
                                    {...register("sex")}
                                    checked={sex === false}
                                    onChange={handleSexChange}
                                    className="appearance-none h-6 w-6 border border-[#CCCCCC] rounded-full
checked:bg-[#EA4B48] checked:scale-75 transition-all duration-200 peer "
                                  />
                                  <div
                                    className="h-6 w-6 absolute rounded-full pointer-events-none
                                        peer-checked:border-[#EA4B48] peer-checked:border-2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=" h-[90px] w-[500px]">
                            <Controller
                              name="phonenumber"
                              control={control}
                              rules={{
                                required: {
                                  value: true,
                                  message: "Không để trống",
                                },
                                minLength: {
                                  value: 10,
                                  message: "Ít nhất 10 ký tự",
                                },
                                maxLength: {
                                  value: 10,
                                  message: "Nhiều nhất 10 kí tự",
                                },
                              }}
                              render={({ field }) => (
                                <>
                                  <label className="text-sm font-medium max-xl:text-xs max-lg:text-[10px]">
                                    Số điện thoại
                                  </label>
                                  <input
                                    className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                             max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]
                                            `}
                                    placeholder="Nhập vào số điện thoại"
                                    value={field.value}
                                    onChange={(e) => {
                                      const reg = /[!#$%^&]/;
                                      const value = e.target.value;
                                      field.onChange(value.replace(reg, ""));
                                    }}
                                    name="phonenumber"
                                  />
                                  {errors.phonenumber && (
                                    <p className="text-[11px] text-red-700 mt-0">
                                      {errors.phonenumber.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        </div>

                        <div className="w-[500px] mt-4">
                          <Controller
                            control={control}
                            name="dateofbirth"
                            rules={{
                              required: {
                                value: true,
                                message: "Hãy chọn ngày",
                              },
                              validate: (date: string) => {
                                const valid = moment(date).isAfter(
                                  moment().subtract(1, "days").toDate()
                                );
                                return valid == true
                                  ? "Thời gian không hợp lệ"
                                  : undefined;
                              },
                            }}
                            render={({ field }) => (
                              <>
                                <label
                                  htmlFor="name"
                                  className="text-[#4C4C4C] text-sm font-medium"
                                >
                                  Ngày sinh
                                </label>
                                <input
                                  className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                  rounded-[6px] px-[10px] py-[12px] w-[100%] mt-0
                                  max-xl:text-xs max-lg:text-[10px] border-[#EA4B48]`}
                                  type="date"
                                  value={field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const reg = /[!]/;
                                    field.onChange(value.replace(reg, ""));
                                  }}
                                />
                                {!!errors.dateofbirth && (
                                  <p className="text-red-700 mt-2">
                                    {errors.dateofbirth.message}
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
              />
              <div className="flex gap-[24px]">
                <div
                  className="Search-input-headerCenter items-center flex
                                    py-[3px] px-[6px] border-[1px] border-[#FFAAAF] rounded-md"
                >
                  <div className="mb-2">
                    <Search />
                  </div>
                  <input
                    className="rounded-lg focus:outline-none text-lg relative pr-7 flex-1 pl-3 max-xl:text-sm max-lg:text-sm "
                    placeholder="Tìm kiếm theo tên đăng nhập"
                    value={adminAPI.keyword}
                    style={{ fontSize: "14px" }}
                    onChange={(e) => handleSearchInput(e.target.value)}
                  />
                </div>
                <div className="flex items-center w-[133px] rounded-md h-[46px] hover:bg-[#FFEAE9] transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly cursor-pointer">
                  <Download />
                  <button
                    className="text-center text-base font-bold text-[#EA4B48] max-lg:text-sm"
                    onClick={() => {
                      const csv = generateCsv(csvConfig)(admin.data as []);
                      download(csvConfig)(csv);
                    }}
                  >
                    Xuất excel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative ">
            <table className="w-full text-left ">
              <thead className="text-base text-[#4C4C4C] border-b-[2px] border-[#E0E0E0] max-xl:text-sm max-lg:text-[11px]">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-5 max-lg:px-[5px] max-lg:py-2"
                  >
                    Id Admin
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-5 max-lg:px-[5px] max-lg:py-2"
                  >
                    Tên Admin
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-5 max-lg:px-[5px] max-lg:py-2"
                  >
                    Tên Đăng Nhâp
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-5 max-lg:px-[5px] max-lg:py-2"
                  >
                    Email / Sđt
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-5 max-lg:px-[5px] max-lg:py-2"
                  >
                    Giới tính
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-5 max-lg:px-[5px] max-lg:py-2"
                  >
                    Ngày sinh
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-5 max-lg:px-[5px] max-lg:py-2"
                  >
                    SĐT
                  </th>
                </tr>
              </thead>

              {admin?.data?.length > 0 ? (
                admin?.data?.map((items: any) => {
                  return (
                    <>
                      <tbody>
                        <tr className="bg-white border-b-[2px] border-[#E0E0E0] max-xl:text-sm max-lg:text-xs">
                          <th
                            scope="row"
                            className="px-3 py-5 max-lg:py-3 justify-center font-medium text-gray-900"
                          >
                            {items.id}
                          </th>
                          <td className="px-3 py-5 max-lg:py-3 justify-center">
                            {items.name}
                          </td>
                          <td className="px-3 py-5 max-lg:py-3 justify-center">
                            {items.username}
                          </td>
                          <td className="px-3 py-5 max-lg:py-3 justify-center">
                            {items.email}
                          </td>
                          <td className="px-3 py-5 max-lg:py-3 justify-center">
                            {items.sex
                              ? (items.sex = "Nam")
                              : (items.sex = "Nữ")}
                          </td>

                          <td className="px-3 py-5 max-lg:py-3 justify-center">
                            {items.dateofbirth != null
                              ? reformatDate(items.dateofbirth.substring(0, 10))
                              : (items.dateofbirth = "dd/mm/yyyy")}
                          </td>
                          <td className="text-[#2e34e6] px-3 py-5 max-lg:py-3 justify-center">
                            {items.phonenumber}
                          </td>
                          <th
                            scope="row"
                            className="flex gap-2 items-center px-3 py-5 max-lg:py-3"
                          >
                            <div className="dropdown dropdown-right ">
                              <label
                                className="max-lg:w-[24px] max-lg:h-[24px]"
                                tabIndex={1}
                              >
                                <Handle />
                              </label>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-white rounded-box w-52
                                                shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]
                                                max-2xl:left-[100%] max-2xl:origin-left max-[940px]:w-32 max-[940px]:h-[88px] max-[940px]:rounded"
                              >
                                <li>
                                  <button
                                    className="flex items-center gap-4"
                                    onClick={() => JumpEditUser(items.username)}
                                  >
                                    <Edit />
                                    <p
                                      className="text-[#EA4B48] text-sm font-medium
                                            max-[940px]:text-xs "
                                    >
                                      Xem chi tiết
                                    </p>
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </th>
                        </tr>
                      </tbody>
                    </>
                  );
                })
              ) : (
                <>
                  <tbody>
                    <tr className="bg-white border-b-[2px] border-[#E0E0E0] max-xl:text-sm max-lg:text-xs">
                      <th
                        scope="row"
                        className="px-3 py-5 max-lg:py-3 justify-center font-medium text-gray-900"
                      ></th>
                      <td className="px-3 py-5 max-lg:py-3 justify-center"></td>
                      <td className="px-3 py-5 max-lg:py-3 justify-center"></td>
                      <td className="px-3 py-5 max-lg:py-3 justify-center"></td>

                      <td className="px-3 py-5 max-lg:py-3 justify-center"></td>
                      <td className="px-3 py-5 max-lg:py-3 justify-center"></td>
                      <th
                        scope="row"
                        className="flex gap-2 items-center px-3 py-5 max-lg:py-3"
                      ></th>
                    </tr>
                  </tbody>
                  <EmptyPage
                    title="Danh sách sản phẩm trống"
                    button="Thêm Ngay"
                  />
                </>
              )}
            </table>
            <div className="mt-10">
              <ResponsivePagination
                current={adminAPI.page!}
                total={admin.totalPage}
                onPageChange={handlePageChange}
                maxWidth={500}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
