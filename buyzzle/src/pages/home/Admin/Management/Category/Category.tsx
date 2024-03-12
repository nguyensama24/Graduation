import { IonIcon } from "@ionic/react";
import { Accordion, AccordionBody } from "@material-tailwind/react";
import { ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ArrowNextHistory from "../../../../../assets/TSX/ArrowNextHistory";
import Plus from "../../../../../assets/TSX/Plus";
import Container from "../../../../../components/container/Container";
import { categoryController } from "../../../../../controllers/CategoryController";
import { storage } from "../../../../../firebase/Config";
import DialogComfirm from "../../../../../helper/Dialog/DialogComfirm";
import DialogModal from "../../../../../helper/Dialog/DialogModal";
import Loading from "../../../../../helper/Loading/Loading";
import { toastSuccess } from "../../../../../helper/Toast/Success";
import { toastWarn } from "../../../../../helper/Toast/Warning";
import { CategoryModal } from "../../../../../model/CategoryModel";
import SitebarAdmin from "../../Sitebar/Sitebar";
import ArrowDown from "../../assets/TSX/ArrowDown";
import Delete from "../../assets/TSX/Delete";
import DeleteCate from "../../assets/TSX/DeleteCate";
import Edit from "../../assets/TSX/Edit";
import EditCate from "../../assets/TSX/EditCate";
import PlusSquare from "../../assets/TSX/PlusSquare";
import RemoveCate from "../../assets/TSX/RemoveCate";
import UploadIMG from "../../assets/TSX/UploadIMG";
import Handle from "../../assets/TSX/bacham";

function Category() {
  const idModalCate = "category";
  const idModalSubCateLv1 = "sybCategoryLv1";
  const idRemoveCategory = "comfirm";
  const idRemoveCates = "comfirmCates";
  const idRemoveSubcate = "comfirmSubcate";

  const [idCate, setIdCate] = useState(0);
  const [idSubcate, setIdSubcate] = useState(0);

  const [indexCate, setIndexCate] = useState(0);

  const [categorys, setCategorys] = useState<CategoryModal[]>([]);

  const [loading, setLoading] = useState(false);

  const [url, setUrl] = useState<string>();

  const [open, setOpen] = useState<number>();
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  const [checkedCategory, setCheckedCategory] = useState<CategoryModal[]>([]);

  var checkAll: boolean =
    categorys?.length > 0
      ? checkedCategory.length === categorys?.length
      : false;

  const [nameCateLv2, setNameCateLv2] = useState<string>("");

  // img firebase
  const loadImageFile = async (images: any) => {
    for (let i = 0; i < 1; i++) {
      const imageRef = ref(storage, `multipleFiles/${images[i].name}`);
      setLoading(true);
      await uploadBytes(imageRef, images[i])
        .then(() => {
          storage
            .ref("multipleFiles")
            .child(images[i].name)
            .getDownloadURL()
            .then((url: string) => {
              setUrl(url);
              return url;
            });
        })
        .catch((err) => {
          alert(err);
        })
        .finally(() => setLoading(false));
    }
  };

  const load = () => {
    if (loading) {
      return <Loading />;
    }
  };

  const renderImg = () => {
    if (url) {
      return (
        <div className="group relative">
          <img
            src={url}
            alt="imageproduct6"
            width={80}
            height={80}
            className="rounded-md"
          />
          <div
            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden rounded-md bg-gray-900 bg-fixed 
                                                                    opacity-0 transition duration-300 ease-in-out group-hover:opacity-20"
          ></div>
        </div>
      );
    } else {
      return (
        <>
          <UploadIMG />
          <div id="images" className="text-center mt-2">
            <p className="text-[#5D5FEF] text-center text-base -tracking-tighter font-bold max-xl:text-xs max-lg:text-[8px]">
              Tải hình ảnh lên
            </p>
          </div>
        </>
      );
    }
  };

  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<CategoryModal>({
    mode: "all",
    defaultValues: {
      name: "",
      id: 0,
      image: "",
    },
  });

  const saveModal = (id: string, data: CategoryModal) => {
    if (!url) {
      toastWarn("Thêm Hình");
      return;
    }
    closeModal(id);
    if (data.id != 0) {
      categoryController
        .update(data.id, {
          id: data.id,
          name: data.name,
          image: url,
        })
        .then(() => {
          toastSuccess("Cập nhật thành công!!");
          getList();
          setnull();
          setCheckedCategory([]);
        });
    } else {
      categoryController
        .create({ id: data.id, name: data.name, image: url })
        .then(() => {
          toastSuccess("Thêm thành công!!");
          getList();
          setnull();
          setCheckedCategory([]);
        })
        .catch(() => {
          toastWarn("Tối đa 6 danh mục");
        });
    }
  };

  const remove = (id: number, idDialog: string) => {
    categoryController
      .remove(id)
      .then(() => {
        closeModal(idDialog);
        toastSuccess("Successfully");
        getList();
      })
      .then(() => {
        setCheckedCategory([]);
      });
  };

  const removeCates = (cate: CategoryModal[], idDialog: string) => {
    let successMessageDisplayed = false;

    cate.map((e, index) => {
      categoryController
        .remove(e.id)
        .then(() => {
          if (index === cate.length - 1 && !successMessageDisplayed) {
            toastSuccess("Thành công");
            successMessageDisplayed = true;
          }
          closeModal(idDialog);
          getList();
        })
        .then(() => {
          setCheckedCategory([]);
        });
    });
  };

  const createSubcate = async (
    data: string,
    idCate: number,
    idSubcate: number
  ) => {
    if (idSubcate == 0) {
      if (data.length >= 4 && data.length <= 20) {
        await categoryController
          .createSubcateLv1(idCate, data)
          .then(() => {
            setNameCateLv2("");
            closeModal(idModalSubCateLv1);
            setCheckedCategory([]);
            getList();
          })
          .then(() => {
            toastSuccess("Thành Công");
          });
      } else {
        toastWarn("Lỗi tên");
      }
    } else {
      if (data.length >= 4 && data.length <= 20) {
        await categoryController
          .updateSubcateLv1(idCate, idSubcate, nameCateLv2)
          .then(() => {
            setNameCateLv2("");
            closeModal(idModalSubCateLv1);
            setCheckedCategory([]);
            getList();
          })
          .then(() => {
            toastSuccess("Thành Công");
          });
      } else {
        toastWarn("Lỗi tên");
      }
    }
  };

  const removeSubcate = async () => {
    await categoryController
      .removeSubcateLv1(idSubcate)
      .then(() => {
        closeModal(idRemoveSubcate);
        setCheckedCategory([]);
        getList();
      })
      .then(() => {
        toastSuccess("Thành Công");
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    categoryController.getAllCateAdmin().then((res: any) => {
      closeModal("");
      setCategorys(res.data);
    });
  };
  const openModal = (id: string, data: CategoryModal) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      reset({ name: data.name, id: data.id });
      setNameCateLv2(data.name);
      setUrl(data.image);
      modal.showModal();
    }
  };

  const closeModal = async (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      clearErrors();
      await setnull();
      setNameCateLv2("");
      modal.close();
    }
  };
  const setnull = async () => {
    reset({ id: 0, name: "", image: "" });
    setUrl("");
  };

  const handleChecked = (checked: boolean, data: CategoryModal) => {
    if (checked) {
      setCheckedCategory((prev) => [...prev, data]);
    } else {
      const cloneCate = [...checkedCategory];
      const cloneCates = cloneCate.filter((e) => e.id !== data.id);
      setCheckedCategory(cloneCates);
    }
  };
  const handleCheckedAll = (checked: boolean) => {
    if (checked) {
      setCheckedCategory(categorys);
    } else {
      setCheckedCategory([]);
    }
  };

  const [isOpenSitebar, setIsOpenSitebar] = useState(false);
  const openSitebar = () => {
    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
      setIsOpenSitebar(!isOpenSitebar);
    }
  };
  const closeSitebar = () => {
    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  return (
    <>
      <Container>
        <div
          className="float-right cursor-pointer max-[1920px]:invisible max-2xl:visible"
          onClick={() => openSitebar()}
        >
          <IonIcon className="text-[2rem]" name={"menu"}></IonIcon>
        </div>
        <div className="grid grid-cols-5">
          <dialog id="my_modal_3" className="max-2xl:modal">
            <div className="relative">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-[120px]"
                onClick={closeSitebar}
              >
                ✕
              </button>
              <SitebarAdmin />
            </div>
          </dialog>
          <div className="col-span-1 max-2xl:hidden">
            <SitebarAdmin />
          </div>
          <div className="content-right-filter col-span-4 flex flex-col gap-4 max-2xl:col-span-5">
            <div>
              <h2
                className="txt-filter font-bold text-[#1A1A1A] text-3xl
                                max-lg:text-xl"
              >
                QUẢN LÝ DANH MỤC SẢN PHẨM
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex justify-between">
                <div
                  className="items-center bg-[#EA4B48] rounded-md h-[46px] flex px-6 cursor-pointer"
                  onClick={() =>
                    openModal(idModalCate, {
                      id: 0,
                    } as CategoryModal)
                  }
                >
                  <button className="flex gap-3">
                    <PlusSquare />
                    <p className=" text-white text-base font-bold">
                      Thêm Danh Mục
                    </p>
                  </button>
                </div>

                <DialogModal
                  id={idModalCate}
                  onClose={() => closeModal(idModalCate)}
                  onSave={handleSubmit((data: any) => {
                    saveModal(idModalCate, data);
                  })}
                  title="Danh Mục Sản Phẩm"
                  body={
                    <>
                      <div className="grid grid-cols-5 gap-8">
                        <div className="col-span-3">
                          <div className="flex gap-3 ">
                            <div className="flex flex-col gap-5 max-lg:gap-2">
                              <div>
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
                                      <label className="text-sm max-xl:text-xs max-lg:text-[10px]">
                                        Tiêu Đề Danh Mục*
                                      </label>
                                      <input
                                        className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2
                                             max-xl:text-xs max-lg:text-[10px]
                                            `}
                                        placeholder="Nhập tiêu đề danh mục"
                                        value={field.value}
                                        onChange={(e) => {
                                          const reg = /[!@#$%^&]/;
                                          const value = e.target.value;
                                          field.onChange(
                                            value.replace(reg, "")
                                          );
                                        }}
                                        name="name"
                                      />
                                      {errors.name && (
                                        <p className="text-[11px] text-red-700 mt-2">
                                          {errors.name.message}
                                        </p>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 flex flex-col gap-12">
                          <div className="max-w-max items-center">
                            <Controller
                              control={control}
                              name="image"
                              render={({ field }) => (
                                <>
                                  <label htmlFor="images">
                                    <div className="outline-dashed outline-2 outline-offset-2 outline-[#EA4B48] py-7 px-9 cursor-pointer max-lg:p-2">
                                      {load()}
                                      <input
                                        value={field.value}
                                        type="file"
                                        onChange={(e: any) => {
                                          loadImageFile(e.target.files);
                                          field.onChange(e);
                                        }}
                                        id="images"
                                        multiple
                                        className="hidden "
                                      />

                                      {renderImg()}
                                      {errors.image && (
                                        <p className="text-[13px] text-red-600 mt-2">
                                          {errors.image.message}
                                        </p>
                                      )}
                                    </div>
                                  </label>
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
              </div>

              <div className="grid grid-cols-10 items-center">
                <div className="col-span-3 py-[15px] pl-16">
                  {categorys.length > 0 ? (
                    <input
                      checked={checkAll}
                      className="checkbox checkbox-sm items-center"
                      type="checkbox"
                      onChange={(e) => handleCheckedAll(e.target.checked)}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex gap-[28px] col-span-5 ">
                  <p></p>
                  <p className=" pt-[12px] text-[16px] font-medium max-lg:text-sm">
                    {/* Tên Danh Mục */}
                  </p>
                </div>
                <div className="flex justify-center col-span-2 max-lg:gap-[30px]">
                  <p
                    onClick={() =>
                      openModal(idRemoveCates, {} as CategoryModal)
                    }
                    className="pt-[12px] text-[16px] pr-2 max-lg:text-sm"
                  >
                    {checkedCategory.length > 0 ? <Delete /> : ""}
                  </p>
                </div>
              </div>

              <DialogComfirm
                desc="Danh mục"
                id={idRemoveCategory}
                onClose={() => closeModal(idRemoveCategory)}
                title="Xóa danh mục"
                onSave={() => remove(idCate, idRemoveCategory)}
              />

              <DialogComfirm
                desc="Các danh mục"
                id={idRemoveCates}
                title="Xóa các danh mục đã chọn"
                onClose={() => closeModal(idRemoveCates)}
                onSave={() => removeCates(checkedCategory, idRemoveCates)}
              />

              <DialogComfirm
                desc="Danh mục Con"
                id={idRemoveSubcate}
                title="Xóa danh mục con"
                onClose={() => closeModal(idRemoveSubcate)}
                onSave={() => removeSubcate()}
              />

              <DialogModal
                id={idModalSubCateLv1}
                title={categorys[indexCate]?.name}
                onClose={() => closeModal(idModalSubCateLv1)}
                onSave={() => createSubcate(nameCateLv2, idCate, idSubcate)}
                body={
                  <>
                    <label className="text-sm max-xl:text-xs max-lg:text-[10px]">
                      Tiêu Đề Danh Mục con*
                    </label>
                    <input
                      className={`focus:outline-none border-[1px] text-[#333333] text-base placeholder-[#7A828A]
                                             rounded-[6px] px-[10px] py-[12px] w-[100%] mt-2
                                             max-xl:text-xs max-lg:text-[10px]
                                            `}
                      placeholder="Nhập tiêu đề danh mục con"
                      required
                      value={nameCateLv2}
                      onChange={(e) => setNameCateLv2(e.target.value)}
                    />
                  </>
                }
              />
              <div className=" flex flex-col gap-7">
                {categorys.map((e, index) => {
                  return (
                    <>
                      <Accordion
                        open={open === e.id}
                        className="w-full"
                        key={e.id}
                      >
                        <div className="grid grid-cols-10">
                          <div className="col-span-8 grid grid-cols-8">
                            <div className="col-span-3 border-[#e0e0e0] flex justify-between items-center pr-6 pl-16">
                              <div className=" flex gap-[20px] max-lg:gap-2">
                                <input
                                  className="checkbox checkbox-sm items-center"
                                  type="checkbox"
                                  checked={checkedCategory.includes(e)}
                                  onChange={(element) =>
                                    handleChecked(element.target.checked, e)
                                  }
                                />
                              </div>
                              <div
                                onClick={() => handleOpen(e.id)}
                                className="cursor-pointer"
                              >
                                <img
                                  className="w-[50px] h-[50px] object-cover"
                                  src={e.image}
                                  alt=""
                                />
                              </div>
                            </div>
                            <div
                              onClick={() => handleOpen(e.id)}
                              className="col-span-5 flex cursor-pointer border-[#e0e0e0] items-center gap-5 pl-[5%] max-lg:h-16 max-lg:py-[7%]"
                            >
                              <p className="text-[16px] font-medium my-auto max-lg:text-sm">
                                {e.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex col-span-2 text-center justify-center gap-5 max-lg:ml-4 max-lg:pt-[22px] max-lg:pb-0 max-lg:pl-[6%] max-lg:gap-2">
                            <button
                              className="flex items-center"
                              onClick={() => {
                                openModal(
                                  idModalSubCateLv1,
                                  {} as CategoryModal
                                );
                                setIdCate(e.id);
                                setIdSubcate(0);
                                setIndexCate(index);
                              }}
                            >
                              <Plus />
                            </button>

                            <div className="dropdown dropdown-left flex items-center">
                              <label tabIndex={0}>
                                <Handle />
                              </label>
                              <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-white rounded-box w-52 z-30
                                                shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]
                                                max-2xl:left-[100%] max-2xl::origin-left"
                              >
                                <li>
                                  <button
                                    onClick={() => openModal(idModalCate, e)}
                                    className="flex items-center gap-4"
                                  >
                                    <Edit />
                                    <p className="text-[#EA4B48] text-sm font-medium">
                                      Sửa
                                    </p>
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => {
                                      openModal(
                                        idRemoveCategory,
                                        {} as CategoryModal
                                      );
                                      setIdCate(e.id);
                                    }}
                                    className="flex items-center gap-4"
                                  >
                                    <RemoveCate />
                                    <p className="text-[#EA4B48] text-sm font-medium">
                                      Xóa
                                    </p>
                                  </button>
                                </li>
                              </ul>
                            </div>

                            <div
                              onClick={() => handleOpen(e.id)}
                              className="cursor-pointer flex items-center"
                            >
                              {open === e.id ? (
                                <ArrowDown />
                              ) : (
                                <ArrowNextHistory />
                              )}
                            </div>
                          </div>
                        </div>

                        <AccordionBody>
                          <div className="flex flex-col gap-5">
                            {e.subCategories?.map((elements) => {
                              return (
                                <>
                                  <div
                                    key={elements.id}
                                    className="grid grid-cols-10 group"
                                  >
                                    <div className="col-span-3"></div>
                                    <div className="col-span-5 border-[#e0e0e0] flex h-5 items-center gap-5 pl-[5%] max-lg:h-16 max-lg:py-[7%]">
                                      <p className="text-[16px] font-medium max-lg:text-sm">
                                        {elements.name}
                                      </p>
                                    </div>
                                    <div className="col-span-2 hidden group-hover:block ">
                                      <div className="flex items-center text-center justify-center gap-5 max-lg:ml-4 max-lg:pt-[22px] max-lg:pb-0 max-lg:pl-[6%] max-lg:gap-2">
                                        <div
                                          onClick={() => {
                                            setIndexCate(index)
                                            openModal(idModalSubCateLv1, {
                                              name: elements.name,
                                            } as CategoryModal);
                                            setIdCate(e.id);
                                            setIdSubcate(elements.id);
                                          }}
                                        >
                                          <EditCate />
                                        </div>

                                        <div
                                          onClick={() => {
                                            openModal(
                                              idRemoveSubcate,
                                              {} as CategoryModal
                                            );
                                            setIdCate(e.id);
                                            setIdSubcate(elements.id);
                                          }}
                                        >
                                          <DeleteCate />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </AccordionBody>
                      </Accordion>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Category;
