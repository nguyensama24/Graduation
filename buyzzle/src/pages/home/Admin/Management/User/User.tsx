import { useEffect, useState } from "react";
import Search from "../../../../../assets/TSX/Search";
import Container from "../../../../../components/container/Container";
import SitebarAdmin from "../../Sitebar/Sitebar";
import Download from "../../assets/TSX/Download";
import Edit from "../../assets/TSX/Edit";
import Handle from "../../assets/TSX/bacham";

import { download, generateCsv } from "export-to-csv";
import ResponsivePagination from "react-responsive-pagination";
import { toast } from "react-toastify";
import {
  userController,
  userModel,
} from "../../../../../controllers/UserController";
import { csvConfig } from "../../../../../helper/Export/Excel";
import { numberFormat } from "../../../../../helper/Format";
import { ModelUser } from "../../../../../model/UserModel";
import useDebounce from "../../../../../useDebounceHook/useDebounce";

export interface users {
  id: number;
  username: string;
  name: string;
  email: string;
  sex: string;
}

export default function User() {
  let status = "Hoạt động";
  const [userAPI, setUserAPI] = useState<userModel>({
    pageSize: 2,
  });
  const debouncedInputValueSearch = useDebounce(userAPI.keyword, 500);

  const [users, setUsers] = useState<ModelUser>({} as ModelUser);
  const getAllUserData = () => {
    userController
      .getAllUser(userAPI)
      .then((res) => {
        return res;
      })
      .then((res: any) => {
        setUsers(res);
      });
  };

  useEffect(() => {
    getAllUserData();
  }, [userAPI.page, debouncedInputValueSearch]);
  const handlePageChange = (page: number) => {
    setUserAPI({ ...userAPI, page: page });
  };
  const handleSearchInput = (value: string) => {
    setUserAPI({ ...userAPI, keyword: value });
  };
  function JumpEditUser(username: any) {
    window.location.href = `detailuser/${username}`;
  }

  const DeleteUser = (id: any) => {
    userController
      .deleteUser(id)
      .then((res) => {
        toast.success("Xóa thành công !");
        getAllUserData();
      })
      .catch(() => {
        toast.error("Xóa thất bại !");
      });
  };

  return (
    <Container>
      <div className="grid grid-cols-5">
        <div className="col-span-1 max-2xl:hidden">
          <SitebarAdmin />
        </div>
        <div className="content-right-filter  col-span-4 flex flex-col gap-4 max-2xl:col-span-5">
          <div>
            <h2
              className="txt-filter font-bold text-[#1A1A1A] text-3xl
                            max-lg:text-xl"
            >
              QUẢN LÝ DANH SÁCH NGƯỜI DÙNG
            </h2>
          </div>
          <div className="flex flex-col gap-4">
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
                  placeholder="Tìm kiếm theo tên đăng nhập"
                  value={userAPI.keyword}
                  style={{ fontSize: "14px" }}
                  onChange={(e) => handleSearchInput(e.target.value)}
                />
              </div>
              <div className="flex items-center w-[133px] rounded-md h-[46px] hover:bg-[#FFEAE9] transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly cursor-pointer">
                <Download />
                <button
                  className="text-center text-base font-bold text-[#EA4B48] max-lg:text-sm"
                  onClick={() => {
                    const csv = generateCsv(csvConfig)(users.data as []);
                    download(csvConfig)(csv);
                  }}
                >
                  Xuất excel
                </button>
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
                    Id User
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
                    Giới Tính
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-5 max-lg:px-[5px] max-lg:py-2"
                  >
                    Tổng Số Tiền
                  </th>
                </tr>
              </thead>

              {users?.data?.length > 0 ? (
                users?.data?.map((items: any) => {
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
                            {numberFormat(items.totalAmount)}
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
                      <td
                        className={`${
                          status == "Hoạt động"
                            ? "text-[#00B207] px-3 py-5 max-lg:py-3 justify-center"
                            : "text-[#FF8A00] "
                        }`}
                      ></td>
                      <th
                        scope="row"
                        className="flex gap-2 items-center px-3 py-5 max-lg:py-3"
                      ></th>
                    </tr>
                  </tbody>
                  {/* <EmptyPage
                    title="Danh sách sản phẩm trống"
                    button="Thêm Ngay"
                  /> */}
                </>
              )}
            </table>
            <div className="mt-10">
              <ResponsivePagination
                current={userAPI.page!}
                total={users.totalPage}
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
