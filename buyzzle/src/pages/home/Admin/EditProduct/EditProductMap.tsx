import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RemoveIMG from "../../../../assets/TSX/RemoveIMG";
import { categoryController } from "../../../../controllers/CategoryController";
import { imagesController } from "../../../../controllers/ImagesController";
import { productController } from "../../../../controllers/ProductsController";
import { storage } from "../../../../firebase/Config";
import { appConfig } from "../../../../configsEnv";
import UploadIMG from "../assets/TSX/UploadIMG";
import Loading from "../../../../helper/Loading/Loading";
import { CategoryModal } from "../../../../model/CategoryModel";

export type FormValues = {
  name?: string;
  price?: number;
  description?: string;
  quantity?: number;
  discount?: number;
  categoryID?: number;
  subcateId?: Number;
  images?: EditImage;
};

interface EditImage {
  url?: string;
  id?: number;
}

export default function EditProductMap() {
  const [url, setUrl] = useState<string[]>([]);
  const editorRef = useRef<any>(null);
  const [categoty, setCategory] = useState<CategoryModal[]>([]);

  const [editImages, setEditImages] = useState<EditImage[]>([]);

  const [loadingImage, setLoadingImage] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    mode: "all",
  });
  const isDisabled = !(isValid && isDirty);

  const handleRemoveOnlyIMG = (id: number) => {
    imagesController
      .remove(id)
      .then((_) => {
        getList();
      
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: EditProductMap.tsx:62 ~ imagesController.remove ~ err:",
          err
        );
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = () => {
    categoryController
      .getAllCateAdmin()
      .then((res) => {
        setCategory(res.data);
      })
      .catch((err) => console.log(err));
  };

  const idProduct = useParams();
  const id = Number(idProduct.id);

  const submitData = (data: FormValues) => {
    const _data = {
      name: data.name,
      price: data.price,
      description: data.description,
      quantity: data.quantity,
      discount: data.discount,
      categoryID: Number(data.categoryID),
      subcateId: Number(data.subcateId),
      images: {
        url: data.images?.url,
      },
    };

    productController
      .update(id, _data)
      .then(async (responseData) => {
        toast.success("Thành công");
        for (let i = 0; i < url.length; i++) {
          await updateImages(responseData?.data.id, url[i]);
        }
      })
      .catch(() => {
        toast.error("Lỗi hình !");
      });
  };

  const updateImages = async (id: number, url: string) => {
    const urlImages = {
      idproduct: id,
      url: url,
    };
    await axios
      .post(`${appConfig.apiUrl}/addImagesByProductsID`, urlImages)
      .then((response) => response.data);
  };
  const getList = () => {
    axios
      .get(`${appConfig.apiUrl}/chitietproduct/${id}`)
      .then((detailForm) => {
        return detailForm;
      })
      .then((detailForm) => {
        reset({
          name: detailForm.data.productDetail.name,
          description: detailForm.data.productDetail.description,
          price: detailForm.data.productDetail.price,
          discount: detailForm.data.productDetail.discount,
          quantity: detailForm.data.productDetail.quantity,
          categoryID: detailForm.data.productDetail.categoryID,
          subcateId: detailForm.data.productDetail.subcateId,
          images: {
            url: detailForm.data.productDetail.ProductImage,
          },
        });
        setEditImages(detailForm.data.productDetail.ProductImage);
      })
      .catch((error) => {
        console.log("🚀 ~ file: Detailproducts.tsx:27 ~ .then ~ error:", error);
      });
  };
  useEffect(() => {
    getList();
  }, []);

  // img firebase
  const loadImageFile = async (images: any) => {
    setLoadingImage(true);
    for (let i = 0; i < images.length; i++) {
      const imageRef = ref(storage, `multipleFiles/${images[i].name}`);

      await uploadBytes(imageRef, images[i])
        .then(() => {
          storage
            .ref("multipleFiles")
            .child(images[i].name)
            .getDownloadURL()
            .then((url: any) => {
              setUrl((prev) => prev.concat(url));
              return url;
            });
        })
        .catch((err) => {
          alert(err);
        })
        .finally(() => setLoadingImage(false));
    }
  };

  const loading = () => {
    if (loadingImage) {
      return (
        <>
          <div className="absolute left-[65%] top-[50%] z-30">
            <Loading />
          </div>
        </>
      );
    }
  };

  return (
    <>
      <form>
        <div className="grid grid-cols-2 gap-6">
          <div>
            {/* Mô Tả Sản Phẩm */}
            <div>
              <span className="text-[#000] text-2xl font-normal max-xl:text-xl max-lg:text-base">
                Mô Tả Sản Phẩm
              </span>
              {/* card */}
              <div
                className="card w-[100%] py-6 px-6 mt-2 rounded-md
                            shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
              >
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
                      message: "Tên sản phẩm phải lớn hơn 6 ký tự",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <label
                        htmlFor="name"
                        className="text-[#4C4C4C] text-sm font-semibold mb-[8px] max-xl:text-[13px] max-lg:text-xs"
                      >
                        Tên Sản Phẩm
                        <span className="text-[#FF0000]">*</span>
                      </label>
                      {/* input addNameProducts */}
                      <input
                        className={`focus:outline-none text-[#333333] text-base font-medium placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%]
                                             max-xl:text-sm max-lg:text-[13px]
                                            ${
                                              !!errors.name
                                                ? "border-[2px] border-red-900"
                                                : "border-[1px] border-[#FFAAAF]"
                                            }`}
                        placeholder="Nhập tiêu đề sản phẩm"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          const reg = /[!@#$%^&*]/;
                          field.onChange(value.replace(reg, ""));
                        }}
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

                <Controller
                  control={control}
                  name="description"
                  rules={{
                    required: {
                      value: true,
                      message: "Không để trống",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] mt-[23px] max-xl:text-[13px] max-lg:text-xs">
                        Mô Tả Chi Tiết Sản Phẩm
                        <span className="text-[#FF0000]">*</span>
                      </p>
                      <Editor
                        apiKey="i6krl4na00k3s7n08vuwluc3ynywgw9pt6kd46v0dn1knm3i"
                        onInit={(editor) => (editorRef.current = editor)}
                        onEditorChange={(e) => field.onChange(e)}
                        value={field.value}
                        init={{
                          height: 500,
                          menubar: false,
                          font_size_formats: "18pt 24pt 36pt 48pt",
                          plugins: [
                            "advlist",
                            "autolink",
                            "link",
                            "image",
                            "lists",
                            "charmap",
                            "preview",
                            "anchor",
                            "pagebreak",
                            "searchreplace",
                            "wordcount",
                            "visualblocks",
                            "visualchars",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "emoticons",
                            "template",
                            "help",
                          ],
                          toolbar:
                            "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons",
                          content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:22px;fontsize }",
                        }}
                      />
                      {!!errors.description && (
                        <p className="text-red-700 mt-2">
                          {errors.description.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* button */}
            <div className="flex w-[50%] justify-between mt-6 max-[1330px]:gap-5 max-[1330px]:w-[55%] max-[1024px]:w-[75%]">
              <div
                className={`flex items-center w-[150px] rounded-md h-[46px] transition 
                                    duration-150 justify-evenly  max-[1330px]:w-[280px] max-[1024px]:w-[320px]
                                ${
                                  isDisabled
                                    ? "bg-[#aeaeae] cursor-not-allowed"
                                    : "bg-[#EA4B48] hover:bg-[#ff6d65] cursor-pointer"
                                }
                                    `}
              >
                <button
                  disabled={isDisabled}
                  onClick={handleSubmit((data: any) => {
                    submitData(data);
                  })}
                  className={`text-center text-base font-bold text-[#FFFFFF] max-xl:text-sm max-lg:text-[13px]
                                        ${
                                          isDisabled
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer"
                                        } `}
                >
                  Sửa sản phẩm
                </button>
              </div>

              <div
                className="flex items-center w-[133px] rounded-md h-[46px] hover:bg-[#FFEAE9] transition duration-150 border-[#EA4B48] border-[1px] justify-evenly cursor-pointer
                                    max-[1330px]:w-[160px] max-[1024px]:w-[190px]"
              >
                <Link to="/admin/ListproductsAdmin">
                  <button className="text-center text-base font-bold text-[#1A1A1A] max-xl:text-sm max-lg:text-[13px]">
                    Hủy bỏ
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div>
            {/* Ảnh sản phẩm */}
            <div>
              <span className="text-[#000] text-2xl font-normal max-xl:text-xl max-lg:text-base">
                Ảnh Sản Phẩm
              </span>
              {/* card */}
              <div
                className="card w-[100%] py-4 px-9 mt-2 flex 
                                shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
              >
                {/* form upload img */}
                <div className="flex max-[1300px]:gap-3">
                  <Controller
                    control={control}
                    name="images"
                    render={({ field }) => (
                      <div className="max-w-max items-center">
                        <label htmlFor="images">
                          <div className="outline-dashed outline-2 outline-offset-2 outline-[#EA4B48] py-7 px-9 cursor-pointer max-xl:px-4 max-[1100px]:py-4 max-[1024px]:p-2 max-[768px]:p-1">
                            <input
                              type="file"
                              onChange={(e) => {
                                field.onChange(e.target.files);
                                loadImageFile(e.target.files);
                              }}
                              id="images"
                              multiple
                              className="hidden"
                            />
                            <UploadIMG />
                            <div id="images" className="text-center mt-2">
                              <p className="text-[#5D5FEF] text-center -tracking-tighter font-bold max-[1024px]:text-xs max-[768px]:text-[10px]">
                                Click to upload
                                <p className="text-[#1A1A1A] font-normal text-sm tracking-widest max-[1024px]:text-[11px] max-[768px]:text-[10px]">
                                  or drag and drop
                                </p>
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>
                    )}
                  />
                  {/* end form upload img */}
                  <div className="justify-center flex flex-1">
                    <div className="inline-grid grid-cols-3 gap-4">
                      {loadingImage && <p>{loading()}</p>}

                      {editImages.map((e) => (
                        <div className="relative" key={e.id}>
                          <div className="group relative">
                            <img
                              src={e.url}
                              alt="imageproduct6"
                              width={80}
                              height={80}
                              className="rounded-md"
                            />

                            <div className="transition duration-300 ease-in-out bottom-0 left-0 right-0 top-0 opacity-0 group-hover:opacity-100 absolute">
                              {!loadingImage && (
                                <button
                                  onClick={() => handleRemoveOnlyIMG(e.id!)}
                                >
                                  <RemoveIMG />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {url.map((e) => {
                        return (
                          <>
                            <div key={e} className="relative">
                              <div className="group relative">
                                <img
                                  src={e}
                                  alt="imageproduct6"
                                  width={80}
                                  height={80}
                                  className="rounded-md"
                                />
                                <div
                                  className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden rounded-md bg-gray-900 bg-fixed 
                                                                    opacity-0 transition duration-300 ease-in-out group-hover:opacity-20"
                                ></div>
                                <div
                                  className="transition duration-300 ease-in-out bottom-0 left-0 right-0 top-0 opacity-0 group-hover:opacity-100 absolute"
                                  // onClick={() => console.log("an không ?")}
                                >
                                  <RemoveIMG />
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Giá và số lượng sản phẩm */}
            <div className="mt-7">
              <span className="text-[#000] text-2xl font-normal max-xl:text-xl max-lg:text-base">
                Giá & Số Lượng
              </span>
              {/* card */}
              <div
                className="card w-[100%] py-6 px-6 mt-2 rounded-md
                                shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
              >
                <div className="grid grid-cols-6 gap-5">
                  <Controller
                    control={control}
                    name="price"
                    rules={{
                      required: {
                        value: true,
                        message: "Bạn phải nhập giá cho sản phẩm này!",
                      },
                      maxLength: {
                        value: 10,
                        message: "Giá sản phẩm tối đa 10 chữ số!",
                      },
                      minLength: {
                        value: 3,
                        message: "Giá sản phẩm tối thiểu 3 chữ số!",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <div className="col-span-4">
                          <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] max-xl:text-[13px] max-lg:text-xs">
                            Giá Sản phẩm
                            <span className="text-[#FF0000]">*</span>
                          </p>
                          <div
                            className={`flex justify-between items-center rounded-[6px] px-[15px] py-[12px]
                                                            ${
                                                              !!errors.price
                                                                ? "border-[1px] border-red-900"
                                                                : "border-[1px] border-[#FFAAAF]"
                                                            }
                                                            `}
                          >
                            <input
                              className="focus:outline-none text-[#333333] text-base font-medium placeholder-[#7A828A] w-[100%]
                                                            max-xl:text-sm  max-lg:text-[13px]"
                              placeholder="000.000"
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                const reg = /[a-zA-Z!@#$%^&*(){}[\]"=+:"_-]/;
                                field.onChange(value.replace(reg, ""));
                              }}
                            />
                            <p className="text-[#7A828A] font-bold ml-4 cursor-default max-xl:text-[13px]  max-lg:text-[13px]">
                              VNĐ
                            </p>
                          </div>
                          {errors.price && (
                            <p className="text-red-700 mt-2">
                              {errors.price.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  />
                  <Controller
                    control={control}
                    name="discount"
                    rules={{
                      required: {
                        value: true,
                        message:
                          "Bạn nên nhập số '0' nếu sản phẩm này không giảm giá",
                      },
                      maxLength: {
                        value: 2,
                        message: "Giảm sản phẩm tối đa 99%!",
                      },
                      minLength: {
                        value: 1,
                        message: "Giá sản phẩm tối thiểu 1 chữ số!",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <div className="col-span-2">
                          <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] max-xl:text-[13px] max-lg:text-xs">
                            Giảm giá
                            <span className="text-[#FF0000]">*</span>
                          </p>
                          <div
                            className={`flex justify-between items-center rounded-[6px] px-[15px] py-[12px]
                                                            ${
                                                              !!errors.discount
                                                                ? "border-[1px] border-red-900"
                                                                : "border-[1px] border-[#FFAAAF]"
                                                            }
                                                            `}
                          >
                            <input
                              className="focus:outline-none text-[#333333] text-base font-medium placeholder-[#7A828A] w-[100%]
                                                            max-xl:text-sm max-lg:text-[13px]"
                              placeholder="000.000"
                              maxLength={3}
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                const reg = /[a-zA-Z!@#$%^&*(){}[\]"=+:"_-]/;
                                field.onChange(value.replace(reg, ""));
                              }}
                            />
                            <p className="text-[#7A828A] font-bold ml-4 cursor-default max-xl:text-[13px] max-lg:text-[13px]">
                              %
                            </p>
                          </div>
                          {errors.discount && (
                            <p className="text-red-700 mt-2">
                              {errors.discount.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name="quantity"
                  rules={{
                    required: {
                      value: true,
                      message: "Bạn phải nhập số lượng cho sản phẩm này!",
                    },
                    maxLength: {
                      value: 4,
                      message:
                        "Số lượng sản phẩm quá nhiều! Chỉ tối đa đến hàng nghìn!",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] mt-[23px] max-xl:text-[13px] max-lg:text-xs">
                        Số Lượng Sản Phẩm
                        <span className="text-[#FF0000]">*</span>
                      </p>
                      <input
                        className={`focus:outline-none text-[#333333] text-base font-medium placeholder-[#7A828A] w-[100%] rounded-[6px] px-[15px] py-[12px]
                                                max-xl:text-sm max-lg:text-[13px]
                                                    ${
                                                      !!errors.quantity
                                                        ? "border-[1px] border-red-900"
                                                        : "border-[1px] border-[#FFAAAF]"
                                                    } `}
                        placeholder="000.000"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          const reg = /[a-zA-Z!@#$%^&*(){}[\]"=+:"_-]/;
                          field.onChange(value.replace(reg, ""));
                        }}
                      />
                      {errors.quantity && (
                        <p className="text-red-700 mt-2">
                          {errors.quantity.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Danh Mục Sản Phẩm */}
            <div className="mt-7">
              <span className="text-[#000] text-2xl font-normal max-xl:text-xl max-lg:text-base">
                Danh Mục Sản Phẩm
              </span>
              {/* card */}
              <div
                className="card w-[100%] py-6 px-6 mt-2 rounded-md
                            shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
              >
                <Controller
                  control={control}
                  name="categoryID"
                  rules={{
                    required: {
                      value: true,
                      message: "Vui lòng chọn danh mục!",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] max-xl:text-[13px] max-lg:text-xs">
                        Danh Mục Cấp 1<span className="text-[#FF0000]">*</span>
                      </p>
                      {/* Dropdown */}
                      <div className=" w-[100%] flex border-[1px] border-[#FFAAAF] rounded-[6px] items-center">
                        <select
                          className="w-[100%] p-2.5 text-gray-500 bg-white py-[14px] outline-none rounded-md"
                          onChange={field.onChange}
                          value={field.value}
                        >
                          <option value="">-- Chọn Danh Mục Cấp 1--</option>
                          {categoty.map((e) => {
                            return <option value={e.id}>{e.name}</option>;
                          })}
                        </select>
                      </div>
                      {!!errors.categoryID && (
                        <p className="text-red-700 mt-2">
                          {errors.categoryID.message}
                        </p>
                      )}
                      {/* end input addNameProducts */}
                    </>
                  )}
                />

                <Controller
                  name="subcateId"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Vui lòng chọn danh mục!",
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <p className="text-[#4C4C4C] text-sm font-semibold mb-[8px] mt-[23px] max-xl:text-[13px] max-lg:text-xs">
                        Danh Mục Cấp 2<span className="text-[#FF0000]">*</span>
                      </p>
                      {/* Dropdown */}
                      <div className=" w-[100%] flex border-[1px] border-[#FFAAAF] rounded-[6px] items-center">
                        <select
                          onChange={(e) => {
                            const reg = /[]/;
                            const value = e.target.value;
                            field.onChange(value.replace(reg, ""));
                          }}
                          value={field.value ? field.value.toString() : ""}
                          className="w-[100%] p-2.5 text-gray-500 bg-white py-[14px] outline-none rounded-md"
                        >
                          <option value="">-- Chọn Danh Mục Cấp 2 --</option>
                          {categoty.map((e) => {
                            return (
                              <>
                                {e?.subCategories?.map((ele) => {
                                  return (
                                    <>
                                      {ele.categoryid == watch("categoryID") ? (
                                        <option value={ele.id}>
                                          {ele.name}
                                        </option>
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  );
                                })}
                              </>
                            );
                          })}
                        </select>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
