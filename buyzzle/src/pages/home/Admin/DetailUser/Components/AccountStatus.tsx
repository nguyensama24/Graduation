import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useParams } from "react-router-dom";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import secureLocalStorage from "react-secure-storage";
import { userController } from "../../../../../controllers/UserController";
import { storage } from "../../../../../firebase/Config";
import { formatDateYYYY, numberFormat } from "../../../../../helper/Format";
import { UserDetail } from "../../../../../model/DetailUser";

export interface userStatus {
  id: number;
  createdAt: string;
}

export type FormValues = {
  id: number;
  createdAt: string;
};
export type FormImage = {
  id: number;
  UserImage: string[];
};
export default function UserProfile() {
  const [validUrl, setValidUrl] = useState(false);
  const [CheckImageUrl, setCheckImageUrl] = useState(false);
  const param = useParams();
  const [image, setImage] = useState("");
  const [url, setUrl] = useState<string>("");
  const [urlThen, setUrlThen] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<UserDetail>({} as UserDetail);

  const { control, reset } = useForm<FormValues>({
    mode: "all",
  });

  const getUserData = () => {
    const user = param.username;
    userController
      .getUserWhereUsername(user)
      .then((res) => {
        setUsers(res);
        setName(res.name);
        const UserImageArray = JSON.stringify(res.UserImage);
        if (UserImageArray == "[]") {
          setCheckImageUrl(false);
        } else {
          const urlTaker = JSON.parse(UserImageArray);
          setUrlThen(urlTaker[0].url);
          setCheckImageUrl(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getUserData();
    getUserStatus();
  }, []);

  useEffect(() => {
    function CheckLink() {
      const user = secureLocalStorage.getItem("admin");
      if (user != null) {
        setValidUrl(true);
      } else {
        setValidUrl(false);
      }
    }
    CheckLink();
  }, [param]);

  useEffect(() => {
    loadImageFile(image);
  }, [image]);

  // img firebase
  const loadImageFile = async (image: any) => {
    try {
      const imageRef = ref(storage, `multipleFiles/${image}`);

      await uploadBytes(imageRef, image);

      const url = await getDownloadURL(imageRef);
      setUrl(url);
      return url;
    } catch (error) {
      console.error(error);
    }
  };

  const getUserStatus = () => {
    const user = param.username;
    if (user != null) {
      userController
        .getStatusUser(user)
        .then((res) => {
          return res;
        })
        .then((res) => {
          if (res.createdAt == null) {
            res.createdAt = "dd/mm/yyyy";
          } else {
            var createdAt = res.createdAt.substring(0, 10);
            var datearray = createdAt.split("-");
            res.createdAt =
              datearray[2] + "-" + datearray[1] + "-" + datearray[0];
          }
          reset({
            id: res.id,
            createdAt: res.createdAt,
          });
        })
        .catch((error) => {
          console.log(
            "🚀 ~ file: Detailproducts.tsx:27 ~ .then ~ error:",
            error
          );
        });
      console.log("Error");
    }
  };

  return (
    <>
      <div
        className="p-5 rounded-md mt-9
      shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-[#000] text-2xl font-normal ">
            Trạng Thái Tài Khoản
          </span>
        </div>
        <div className="border-[1px] border-[#E0E0E0] my-[30px]"></div>
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center gap-4 col-span-2">
            {CheckImageUrl ? (
              <div>
                <img
                  className="w-[70px] h-[70px] rounded-full border-4"
                  src={urlThen}
                  alt=""
                />
              </div>
            ) : (
              <div>
                <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center bg-red-500">
                  <p className="text-2xl text-stone-50">
                    {name.substring(0, 1).toUpperCase()}
                  </p>
                </div>
              </div>
            )}
            <div>
              <p>Tên: {name}</p>
            </div>
          </div>
        </div>

        {/* input */}
        <div className="mt-7">
          {/* card */}
          <div className="card w-[100%] rounded-md">
            <div className="grid grid-cols-6 gap-5">
              <div className="col-span-4 max-lg:col-span-3">
                <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] max-xl:text-[13px] max-lg:text-xs">
                  #Id User
                </p>
                <div
                  className={`flex justify-between items-center rounded-[6px] px-[15px] py-[12px]
                                 border-[1px] border-[#FFAAAF] `}
                >
                  <Controller
                    control={control}
                    name="id"
                    render={({ field }) => (
                      <>
                        <input
                          className="focus:outline-none text-[#333333] text-base font-medium placeholder-[#7A828A] w-[100%]
                                                                            max-xl:text-sm  max-lg:text-[13px] cursor-not-allowed"
                          placeholder="#a32223"
                          value={`#00${users.id}`}
                          disabled={true}
                        />
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="col-span-2 max-lg:col-span-3">
                <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] max-xl:text-[13px] max-lg:text-xs">
                  Ngày Tạo Tài Khoản
                </p>
                <div
                  className={`flex justify-between items-center rounded-[6px] px-[15px] py-[12px]
                                border-[1px] border-[#FFAAAF] `}
                >
                  <Controller
                    control={control}
                    name="createdAt"
                    render={({ field }) => (
                      <>
                        <input
                          className="focus:outline-none text-[#333333] text-base font-medium placeholder-[#7A828A] w-[100%]
                                                                            max-xl:text-sm max-lg:text-[13px] cursor-not-allowed"
                          placeholder={"20/10/2020"}
                          maxLength={3}
                          value={formatDateYYYY(users.createdAt)}
                          disabled={true}
                        />
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="col-span-6 max-lg:col-span-3">
                <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] max-xl:text-[13px] max-lg:text-xs">
                  Tổng Số Tiền Đã Thanh Toán:
                </p>
                <input
                  className={`focus:outline-none text-[#EA4B48] text-base font-medium placeholder-[#EA4B48] 
                            w-[100%] rounded-[6px] px-[15px] py-[12px]
                            max-xl:text-sm max-lg:text-[13px] border-[1px] border-[#FFAAAF]`}
                  placeholder={numberFormat(users.totalAmount)}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
