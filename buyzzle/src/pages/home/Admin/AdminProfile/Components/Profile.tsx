import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Container from "../../../../../components/container/Container";

import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import secureLocalStorage from "react-secure-storage";
import { appConfigAdmin } from "../../../../../configsEnv";
import { adminController } from "../../../../../controllers/AdminControllder";
import { storage } from "../../../../../firebase/Config";
import SitebarAdmin from "../../Sitebar/Sitebar";

export type FormValues = {
  username: string;
  name: string;
  email: string;
  sex: string;
  phonenumber: string;
  dateofbirth: string;
  image: string;
};
export type FormImage = {
  idadmin: number;
  UserImage: string[];
};
type UserData1 = {
  username: string;
  name: string;
  email: string;
  sex: string;
  phonenumber: string;
  dateofbirth: string;
};
export default function UserProfile() {
  const [validUrl, setValidUrl] = useState<boolean>(false);
  const [CheckImageUrl, setCheckImageUrl] = useState<boolean>(false);
  const param = useParams();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  // const [editUser, setEditUser] = useState<FormValues>();
  const [url, setUrl] = useState<string>("");
  const [urlThen, setUrlThen] = useState<string>("");
  const [id, setId] = useState<string>("11");
  // const id: number | undefined = getID()!;
  const [sex, setSex] = useState<boolean>();
  const [emailThen, setEmailThen] = useState<string>("");
  const [sdtThen, setSdtThen] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // const [UserData1, setUserData1] = useState<UserData1>();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    mode: "all",
  });

  const user = param.username;
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user != null) {
          const username = user;

          await adminController.getAdminWhereUsername(username).then((res) => {

            if (res.adminWithImage.dateofbirth == null) {
              res.adminWithImage.dateofbirth = "dd/mm/yyyy";
            } else {
              res.adminWithImage.dateofbirth =
                res.adminWithImage.dateofbirth.substring(0, 10);
            }

            let Bruh = res.adminWithImage.email;
            Bruh = Bruh.replace(res.adminWithImage.email[3], "*");
            Bruh = Bruh.replace(res.adminWithImage.email[4], "*");
            Bruh = Bruh.replace(res.adminWithImage.email[5], "*");
            let emailDef = Bruh;
            setEmailThen(res.adminWithImage.email);

            let Bruh2 = res.adminWithImage.phonenumber;
            Bruh2 = Bruh2.replace(res.adminWithImage.phonenumber[0], "*");
            Bruh2 = Bruh2.replace(res.adminWithImage.phonenumber[1], "*");
            Bruh2 = Bruh2.replace(res.adminWithImage.phonenumber[2], "*");
            Bruh2 = Bruh2.replace(res.adminWithImage.phonenumber[3], "*");
            Bruh2 = Bruh2.replace(res.adminWithImage.phonenumber[4], "*");
            Bruh2 = Bruh2.replace(res.adminWithImage.phonenumber[5], "*");
            Bruh2 = Bruh2.replace(res.adminWithImage.phonenumber[6], "*");
            let phonenumberDef = Bruh2;

            setSdtThen(res.adminWithImage.phonenumber);

            res.adminWithImage.email = emailDef;
            res.adminWithImage.phonenumber = phonenumberDef;
            setId(res.adminWithImage.id);
            setSex(res.adminWithImage.sex);
          
            setLoading(false);
            SetDataUser(res.adminWithImage);

            const UserImageArray = JSON.stringify(
              res.adminWithImage.AdminImage
            );
           
            if (UserImageArray == "[]") {
              setCheckImageUrl(false);
            } else {
              const urlTaker = JSON.parse(UserImageArray);
              setUrlThen(urlTaker[0].url);
              setCheckImageUrl(true);
            }

            return res;
          });
        } else {
          console.log("Error");
        }
      } catch (error) {
        console.log("ERROR", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [reset]);

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

  const SetDataUser = (data: any) => {
    const user = JSON.stringify(secureLocalStorage.getItem("admin"));
    if (user != null) {
     
      reset({
        username: "" + data?.username,
        name: "" + data?.name,
        email: "" + data?.email,
        // sex: JSON.stringify(data?.sex),
        phonenumber: " " + data?.phonenumber,
        dateofbirth: data?.dateofbirth,
      });
    }
  };

  const handleSexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSex(JSON.parse(event.target.value));
  };

  useEffect(() => {
    loadImageFile(image);
  }, [image]);

  // useEffect(() => {

  // }, []);

  // img firebase
  const loadImageFile = async (image: any) => {
    try {
      const imageRef = ref(storage, `imageUrl/${image.name}`);

      await uploadBytes(imageRef, image);

      const url = await getDownloadURL(imageRef);
      setUrl(url);
    
      return url;
    } catch (error) {
      console.error(error);
    }
  };

  const addImages = async (id: number, url: string) => {
    const urlImages = {
      idadmin: id,
      url: url,
    };
    
    await axios
      .post(`${appConfigAdmin.apiUrl}/addimageadmin/`, urlImages).then((res)=>{

      })
    
  };

  const EditImages = async (id: number, url: string) => {
    const urlImages = {
      iduser: id,
      url: url,
    };
  
    await axios
      .put(
        `${appConfigAdmin.apiUrl}/updateimageadmin/${urlImages.iduser}`,
        urlImages
      )
      .then((response) => "CCCCCCCCCCCC1:" + response);
  };

  const API = `http://localhost:5000/admin/adminprofile/${param.username}`;
  const onSubmit = async (formData: FormValues, FormImage: FormImage) => {
    try {
     
      if (selectedFile == null && CheckImageUrl == false) {
        toast.error("Hãy chọn hình");
        return;
      }
    
      formData.sex = JSON.parse(formData.sex);
      formData.email = emailThen;
      formData.phonenumber = sdtThen;
    
      const response = await axios.put(API, formData);
      FormImage.idadmin = parseInt(id);
    
      if (response) {
        if (CheckImageUrl == false) {
          await addImages(FormImage.idadmin, url);
          setCheckImageUrl(true);
        } else {
          if (url != "") {
            await EditImages(FormImage.idadmin, url);
          } else {
            await EditImages(FormImage.idadmin, urlThen);
          }
        }
      }


      if (response.status === 200) {
        toast.success("Cập nhật thành công", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.warning("Sign-in failed", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        if (responseData.error) {
          const errorMessageUsername = responseData.error.username;
          const errorMessageEmail = responseData.error.email;
          const errorMessagePhoneNumber = responseData.error.phonenumber;
          if (errorMessageUsername) {
            toast.warning(errorMessageUsername, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (errorMessageEmail) {
            toast.warning(errorMessageEmail, {
              position: "top-right",
              autoClose: 5000,
            });
          } else if (errorMessagePhoneNumber) {
            toast.warning(errorMessagePhoneNumber, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        } else {
          console.log("Lỗi không xác định từ server");
        }
      } else {
        console.error("Lỗi gửi yêu cầu không thành công", error);
      }
    }
  };

  const onChangeImage = (file: any) => {
    // const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImage(file);

    } else {
      setSelectedFile(null); // Reset the selectedFile state when no file is selected
      setImage(null); // Reset the imageURL state
    }
  };
  const isDisabled = !(isValid && isDirty);

  return (
    <Fragment>
      {loading ? (
        <></>
      ) : (
        <div>
          {validUrl ? (
            <Container>
              <div className="body-filter container mx-auto">
                <div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 max-2xl:hidden">
                      <SitebarAdmin />
                    </div>

                    <div className="mt-20 col-span-3 max-2xl:col-span-1 grid grid-cols-5 gap-4">
                      <form
                        className="card py-4 px-5 col-span-3  rounded-[6px]
                            shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                      >
                        <span className="text-[#000] text-2xl font-normal ">
                          Hồ sơ của tôi
                        </span>
                        <p className="text-[#393939] text-sm font-normal">
                          Quản lý thông tin hồ sơ để bảo mật tài khoản
                        </p>
                        <div className="flex w-[100%] mt-4 justify-between">
                          <div className="w-[48%]">
                            <Controller
                              control={control}
                              name="username"
                              rules={{
                                required: {
                                  value: true,
                                  message:
                                    "Bạn phải nhập thông tin cho trường dữ liệu này!",
                                },
                                minLength: {
                                  value: 6,
                                  message: "Tên sản phẩm phải lớn hơn 6 ký tự",
                                },
                              }}
                              render={({ field }) => (
                                <>
                                  <label
                                    htmlFor="name"
                                    className="text-[#4C4C4C] text-sm font-medium"
                                  >
                                    Tên đăng nhập
                                  </label>
                                  {/* input addNameProducts */}
                                  <input
                                    className={`focus:outline-none text-[#333333] text-base placeholder-[#7A828A]
                                         rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2
                                        ${!!errors.username
                                        ? "border-[2px] border-red-900"
                                        : "border-[1px] border-[#FFAAAF]"
                                      }`}
                                    disabled={true}
                                    placeholder="Tên đăng nhập"
                                    value={field.value}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const reg = /[!@#$%^&*]/;
                                      field.onChange(value.replace(reg, ""));
                                    }}
                                  />
                                  {!!errors.username && (
                                    <p className="text-red-700 mt-2">
                                      {errors.username.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                            {/* end input addNameProducts */}
                          </div>
                          <div className="w-[48%]">
                            <Controller
                              control={control}
                              name="name"
                              rules={{
                                required: {
                                  value: true,
                                  message:
                                    "Bạn phải nhập thông tin cho trường dữ liệu này!",
                                },
                                minLength: {
                                  value: 6,
                                  message:
                                    "Tên người dùng phải lớn hơn 6 ký tự",
                                },
                              }}
                              render={({ field }) => (
                                <>
                                  <label
                                    htmlFor="name"
                                    className="text-[#4C4C4C] text-sm font-medium"
                                  >
                                    Tên người dùng
                                  </label>
                                  {/* input addNameProducts */}
                                  <input
                                    className={`focus:outline-none text-[#333333] text-base placeholder-[#7A828A]
rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2
                                                   ${!!errors.name
                                        ? "border-[2px] border-red-900"
                                        : "border-[1px] border-[#FFAAAF]"
                                      }`}
                                    placeholder="Tên người dùng"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const reg = /[!@#$%^&*]/;
                                      field.onChange(value.replace(reg, ""));
                                    }}
                                    value={field.value}
                                  // {...register("name")}
                                  />
                                  {!!errors.name && (
                                    <p className="text-red-700 mt-2">
                                      {errors.name.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                            {/* end input addNameProducts */}
                          </div>
                        </div>
                        <div className="w-[100%] mt-4">
                          <Controller
                            control={control}
                            name="email"
                            rules={{
                              required: {
                                value: true,
                                message:
                                  "Bạn phải nhập thông tin cho trường dữ liệu này!",
                              },
                            }}
                            render={({ field }) => (
                              <>
                                <label
                                  htmlFor="name"
                                  className="text-[#4C4C4C] text-sm font-medium"
                                >
                                  Email
                                </label>
                                {/* input addNameProducts */}
                                <input
                                  className={`focus:outline-none text-[#333333] text-base placeholder-[#7A828A]
                                                    rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2 
                                                   ${!!errors.email
                                      ? "border-[2px] border-red-900"
                                      : "border-[1px] border-[#FFAAAF]"
                                    }`}
                                  placeholder="Email"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const reg = /[!#$%^&]/;
                                    field.onChange(value.replace(reg, ""));
                                  }}
                                  value={field.value}
                                  disabled={true}
                                // {...register("email")}
                                // onChange={onChangeInput}
                                />
                                {!!errors.email && (
                                  <p className="text-red-700 mt-2">
                                    {errors.email.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                          {/* end input addNameProducts */}
                        </div>
                        <div className="w-[100%] mt-4 flex justify-between">
                          <div className="w-[48%]">
                            <label
                              htmlFor="name"
                              className="text-[#4C4C4C] text-sm font-medium"
                            >
                              Giới tính
                            </label>
                            <div className="flex w-[100%] mt-6">
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
                              <div className="flex items-center w-[33%] gap-1">
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
                          <div className="w-[48%]">
                            <Controller
                              control={control}
                              name="phonenumber"
                              rules={{
                                required: {
                                  value: true,
                                  message:
                                    "Bạn phải nhập thông tin cho trường dữ liệu này!",
                                },
                              }}
                              render={({ field }) => (
                                <>
                                  <label
                                    htmlFor="name"
                                    className="text-[#4C4C4C] text-sm font-medium"
                                  >
                                    Số điện thoại
                                  </label>
                                  {/* input addNameProducts */}
                                  <input
                                    className={`focus:outline-none text-[#333333] text-base placeholder-[#7A828A]
                                                    rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2
                                                   ${!!errors.phonenumber
                                        ? "border-[2px] border-red-900"
                                        : "border-[1px] border-[#FFAAAF]"
                                      }`}
                                    placeholder="Số điện thoại"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const reg = /[!@#$%^&]/;
                                      field.onChange(value.replace(reg, ""));
                                    }}
                                    disabled={true}
                                    value={field.value}
                                  // {...register("phonenumber")}
                                  // onChange={onChangeInput}
                                  />
                                  {!!errors.phonenumber && (
                                    <p className="text-red-700 mt-2">
                                      {errors.phonenumber.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="w-[100%] mt-4">
                          <Controller
                            control={control}
                            name="dateofbirth"
                            rules={{
                              required: {
                                value: true,
                                message:
                                  "Bạn phải nhập thông tin cho trường dữ liệu này!",
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
                                  className={`focus:outline-none text-[#333333] text-base placeholder-[#7A828A]
                                         rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2`}
                                  type="date"
                                  value={field.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const reg = /[!@#$%^&*]/;
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
                        {/* button */}
                        <div
                          className={`flex w-[122.164px] rounded-md h-[32px] transition duration-150 justify-evenly bg-[#EA4B48] mt-5 ${isDisabled
                              ? "bg-[#aeaeae] cursor-not-allowed"
                              : "bg-[#EA4B48] hover:bg-[#ff6d65] cursor-pointer"
                            }
                     `}
                        >
                          <button
                            disabled={isDisabled}
                            onClick={handleSubmit(
                              (formData: any, FormImage: any) => {
                                onSubmit(formData, FormImage);
                              }
                            )}
                            className={`text-center text-base font-bold text-[#FFFFFF]
                    ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                              }                `}
                          >
                            Lưu
                          </button>
                        </div>
                      </form>

                      {/* Form */}

                      <div
                        className="card py-4 px-5 col-span-2 rounded-[6px]
                    shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                      >
                        <div className=" flex flex-col items-center my-auto">
                          {selectedFile ? (
                            <>
                              <img
                                className="w-40 h-40 rounded-full object-cover"
                                src={url!}
                                alt="Rounded avatar"
                              />
                            </>
                          ) : (
                            <>
                              {CheckImageUrl ? (
                                <>
                                  <img
                                    src={urlThen!}
                                    alt="Rounded avatar"
                                    className="w-40 h-40 rounded-full object-cover"
                                  />
                                </>
                              ) : (
                                <div>
                                  <div className="w-36 h-36 rounded-full flex items-center justify-center bg-red-500">
                                    <p className="text-2xl text-stone-50 text-[45px]">
                                      {user?.substring(0, 1).toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          {/* button */}
                          <label htmlFor="images">
                            <div
                              className="flex items-center w-[141px] rounded-md h-[32px]
                             hover:bg-[#FFEAE9] transition duration-150 border-[#EA4B48]
                              border-[1px] justify-evenly cursor-pointer mt-5"
                              onClick={() => {
                                if (!!selectedFile) {
                                  console.log("Confirm");
                                }
                              }}
                            >
                              <Controller
                                control={control}
                                name="image"
                                render={({ field }) => (
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      // const value = ;
                                      onChangeImage(e.target.files?.[0]);
                                      field.onChange(e.target.files?.[0].name);
                                    }}
                                    id="images"
                                    multiple
                                    className="hidden"
                                  />
                                )}
                              />
                              <div className="text-center text-sm font-bold text-[#1A1A1A] ">
                                Thay đổi ảnh
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          ) : (
            <Container>
              <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center space-y-16 lg:space-y-0 space-x-8 2xl:space-x-0">
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center">
                  <p className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider text-gray-300">
                    404
                  </p>
                  <p className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-gray-300 mt-2">
                    Page Not Found
                  </p>
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-500 my-12">
                    Sorry, the page you are looking for could not be found.
                  </p>
                  <a
                    href="/"
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded transition duration-150"
                    title="Return Home"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Return Home</span>
                  </a>
                </div>
                <div className="w-1/2 lg:h-full flex lg:items-end justify-center p-4">
                  <svg
                    className="w-full text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                    viewBox="0 0 1120.59226 777.91584"
                  >
                    <title>not found</title>
                    <circle
                      cx="212.59226"
                      cy="103"
                      r="64"
                      fill="#ff6584"
                    ></circle>
                    <path
                      d="M563.68016,404.16381c0,151.01141-89.77389,203.73895-200.51559,203.73895S162.649,555.17522,162.649,404.16381,363.16457,61.04208,363.16457,61.04208,563.68016,253.1524,563.68016,404.16381Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="#cbd5e1"
                    ></path>
                    <polygon
                      points="316.156 523.761 318.21 397.378 403.674 241.024 318.532 377.552 319.455 320.725 378.357 207.605 319.699 305.687 319.699 305.687 321.359 203.481 384.433 113.423 321.621 187.409 322.658 0 316.138 248.096 316.674 237.861 252.547 139.704 315.646 257.508 309.671 371.654 309.493 368.625 235.565 265.329 309.269 379.328 308.522 393.603 308.388 393.818 308.449 394.99 293.29 684.589 313.544 684.589 315.974 535.005 389.496 421.285 316.156 523.761"
                      fill="#3f3d56"
                    ></polygon>
                    <path
                      d="M1160.29613,466.01367c0,123.61-73.4842,166.77-164.13156,166.77s-164.13156-43.16-164.13156-166.77S996.16457,185.15218,996.16457,185.15218,1160.29613,342.40364,1160.29613,466.01367Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="#cbd5e1"
                    ></path>
                    <polygon
                      points="950.482 552.833 952.162 449.383 1022.119 321.4 952.426 433.154 953.182 386.639 1001.396 294.044 953.382 374.329 953.382 374.329 954.741 290.669 1006.369 216.952 954.954 277.514 955.804 124.11 950.467 327.188 950.906 318.811 898.414 238.464 950.064 334.893 945.173 428.327 945.027 425.847 884.514 341.294 944.844 434.608 944.232 446.293 944.123 446.469 944.173 447.428 931.764 684.478 948.343 684.478 950.332 562.037 1010.514 468.952 950.482 552.833"
                      fill="#3f3d56"
                    ></polygon>
                    <ellipse
                      cx="554.59226"
                      cy="680.47903"
                      rx="554.59226"
                      ry="28.03433"
                      fill="#3f3d56"
                    ></ellipse>
                    <ellipse
                      cx="892.44491"
                      cy="726.79663"
                      rx="94.98858"
                      ry="4.80162"
                      fill="#3f3d56"
                    ></ellipse>
                    <ellipse
                      cx="548.71959"
                      cy="773.11422"
                      rx="94.98858"
                      ry="4.80162"
                      fill="#3f3d56"
                    ></ellipse>
                    <ellipse
                      cx="287.94432"
                      cy="734.27887"
                      rx="217.01436"
                      ry="10.96996"
                      fill="#3f3d56"
                    ></ellipse>
                    <circle
                      cx="97.08375"
                      cy="566.26982"
                      r="79"
                      fill="#2f2e41"
                    ></circle>
                    <rect
                      x="99.80546"
                      y="689.02332"
                      width="24"
                      height="43"
                      transform="translate(-31.32451 -62.31008) rotate(0.67509)"
                      fill="#2f2e41"
                    ></rect>
                    <rect
                      x="147.80213"
                      y="689.58887"
                      width="24"
                      height="43"
                      transform="translate(-31.31452 -62.87555) rotate(0.67509)"
                      fill="#2f2e41"
                    ></rect>
                    <ellipse
                      cx="119.54569"
                      cy="732.61606"
                      rx="7.5"
                      ry="20"
                      transform="translate(-654.1319 782.47948) rotate(-89.32491)"
                      fill="#2f2e41"
                    ></ellipse>
                    <ellipse
                      cx="167.55414"
                      cy="732.18168"
                      rx="7.5"
                      ry="20"
                      transform="translate(-606.25475 830.05533)
rotate(-89.32491)"
                      fill="#2f2e41"
                    ></ellipse>
                    <circle
                      cx="99.31925"
                      cy="546.29477"
                      r="27"
                      fill="#fff"
                    ></circle>
                    <circle
                      cx="99.31925"
                      cy="546.29477"
                      r="9"
                      fill="#3f3d56"
                    ></circle>
                    <path
                      d="M61.02588,552.94636c-6.04185-28.64075,14.68758-57.26483,46.30049-63.93367s62.13813,11.14292,68.18,39.78367-14.97834,38.93-46.59124,45.59886S67.06774,581.58712,61.02588,552.94636Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M257.29613,671.38411c0,55.07585-32.73985,74.3063-73.13,74.3063q-1.40351,0-2.80255-.0312c-1.87139-.04011-3.72494-.1292-5.55619-.254-36.45135-2.57979-64.77127-22.79937-64.77127-74.02113,0-53.00843,67.73872-119.89612,72.827-124.84633l.00892-.00889c.19608-.19159.29409-.28516.29409-.28516S257.29613,616.30827,257.29613,671.38411Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M181.50168,737.26482l26.747-37.37367-26.81386,41.4773-.07125,4.29076c-1.87139-.04011-3.72494-.1292-5.55619-.254l2.88282-55.10258-.0223-.42775.049-.0802.27179-5.20415-26.88076-41.5798,26.96539,37.67668.06244,1.105,2.17874-41.63324-23.0132-42.96551,23.29391,35.6583,2.26789-86.31419.00892-.294v.28516l-.37871,68.064,22.91079-26.98321-23.00435,32.84678-.60595,37.27566L204.18523,621.958l-21.4805,41.259-.33863,20.723,31.05561-49.79149-31.17146,57.023Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="#3f3d56"
                    ></path>
                    <circle
                      cx="712.48505"
                      cy="565.41532"
                      r="79"
                      fill="#2f2e41"
                    ></circle>
                    <rect
                      x="741.77716"
                      y="691.82355"
                      width="24"
                      height="43"
                      transform="translate(-215.99457 191.86399) rotate(-17.08345)"
                      fill="#2f2e41"
                    ></rect>
                    <rect
                      x="787.6593"
                      y="677.72286"
                      width="24"
                      height="43"
                      transform="matrix(0.95588, -0.29376, 0.29376, 0.95588, -209.82788, 204.72037)"
                      fill="#2f2e41"
                    ></rect>
                    <ellipse
                      cx="767.887"
                      cy="732.00275"
                      rx="20"
                      ry="7.5"
                      transform="translate(-220.8593 196.83312) rotate(-17.08345)"
                      fill="#2f2e41"
                    ></ellipse>
                    <ellipse
                      cx="813.47537"
                      cy="716.94619"
                      rx="20"
                      ry="7.5"
                      transform="translate(-214.42477 209.56103) rotate(-17.08345)"
                      fill="#2f2e41"
                    ></ellipse>
                    <circle
                      cx="708.52153"
                      cy="545.71023"
                      r="27"
                      fill="#fff"
                    ></circle>
                    <circle
                      cx="708.52153"
                      cy="545.71023"
                      r="9"
                      fill="#3f3d56"
                    ></circle>
                    <path
                      d="M657.35526,578.74316c-14.48957-25.43323-3.47841-59.016,24.59412-75.0092s62.57592-8.34055,77.06549,17.09268-2.39072,41.6435-30.46325,57.63671S671.84483,604.17639,657.35526,578.74316Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M611.29613,661.29875c0,50.55711-30.05368,68.20979-67.13,68.20979q-1.28835,0-2.57261-.02864c-1.71785-.03682-3.41933-.1186-5.10033-.23313-33.46068-2.36813-59.45707-20.92878-59.45707-67.948,0-48.65932,62.18106-110.05916,66.85186-114.60322l.00819-.00817c.18-.17587.27-.26177.27-.26177S611.29613,610.74164,611.29613,661.29875Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M541.72029,721.77424l24.55253-34.30732-24.6139,38.07426-.0654,3.93872c-1.71785-.03682-3.41933-.1186-5.10033-.23313l2.6463-50.58165-.02047-.39266.045-.07361.24949-4.77718-24.67531-38.16836,24.753,34.58547.05731,1.01433,2-38.21741-21.12507-39.44039L541.80616,625.928l2.08182-79.23247.00819-.26994v.26177l-.34764,62.47962,21.031-24.76934-21.11693,30.15184-.55624,34.21735,19.63634-32.839-19.71812,37.87389-.31085,19.0228,28.50763-45.70631-28.614,52.34448Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="#3f3d56"
                    ></path>
                    <path
                      d="M875.29613,682.38411c0,55.07585-32.73985,74.3063-73.13,74.3063q-1.4035,0-2.80255-.0312c-1.87139-.04011-3.72494-.1292-5.55619-.254-36.45135-2.57979-64.77127-22.79937-64.77127-74.02113,0-53.00843,67.73872-119.89612,72.827-124.84633l.00892-.00889c.19608-.19159.29409-.28516.29409-.28516S875.29613,627.30827,875.29613,682.38411Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M799.50168,748.26482l26.747-37.37367-26.81386,41.4773-.07125,4.29076c-1.87139-.04011-3.72494-.1292-5.55619-.254l2.88282-55.10258-.0223-.42775.049-.0802.27179-5.20415L770.108,654.01076l26.96539,37.67668.06244,1.105,2.17874-41.63324-23.0132-42.96551,23.29391,35.6583,2.26789-86.31419.00892-.294v.28516l-.37871,68.064,22.91079-26.98321-23.00435,32.84678-.606,37.27566L822.18523,632.958l-21.4805,41.259-.33863,20.723,31.05561-49.79149-31.17146,57.023Z"
                      transform="translate(-39.70387 -61.04208)"
                      fill="#3f3d56"
                    ></path>
                    <ellipse
                      cx="721.51694"
                      cy="656.82212"
                      rx="12.40027"
                      ry="39.5"
                      transform="translate(-220.83517 966.22323) rotate(-64.62574)"
                      fill="#2f2e41"
                    ></ellipse>
                    <ellipse
                      cx="112.51694"
                      cy="651.82212"
                      rx="12.40027"
                      ry="39.5"
                      transform="translate(-574.07936 452.71367) rotate(-68.15829)"
                      fill="#2f2e41"
                    ></ellipse>
                  </svg>
                </div>
              </div>
            </Container>
          )}
        </div>
      )}
    </Fragment>
  );
}
