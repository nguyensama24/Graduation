import { ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Location from "../../../../assets/TSX/Location";
import RemoveIMG from "../../../../assets/TSX/RemoveIMG";
import { orderControllers } from "../../../../controllers/OrderControllers";
import { ratingAndCommentController } from "../../../../controllers/Rating&Comment";
import { storage } from "../../../../firebase/Config";
import DialogModal from "../../../../helper/Dialog/DialogModal";
import { numberFormat } from "../../../../helper/Format";
import Loading from "../../../../helper/Loading/Loading";
import StepperPage from "../../../../helper/Stepper/StepperUser";
import { OrderModel } from "../../../../model/OrderModel";
import { Rating } from "../../../../model/ProductModel";
import Container from "../../../../components/container/Container";
import Back from "../../admin/assets/TSX/Back";
import UploadIMG from "../../admin/assets/TSX/UploadIMG";

export default function OrderDetailPage() {
  const { id } = useParams();
  const idOrder = Number(id);

  const [orderDetails, setOrderDetails] = useState<OrderModel>(
    {} as OrderModel
  );

  const [url, setUrl] = useState<string[]>([]);
  const [loadingImage, setLoadingImage] = useState(false);

  const [idSP, setIdSP] = useState(0);
  const [indexSP, setIndexSP] = useState<number>(0);

  useEffect(() => {
    getOrderDetails();
  }, []);

  const getOrderDetails = async () => {
    await orderControllers.getDetails(idOrder).then((res) => {
      setOrderDetails(res);
    });
  };

  //Add images comment
  const delayIMG = () => {
    const timeoutId = setTimeout(() => {
      setLoadingImage(false);
    }, 7000);
    return () => {
      clearTimeout(timeoutId);
    };
  };
  // img firebase
  const loadImageFile = async (images: any) => {
    for (let i = 0; i < 6; i++) {
      const imageRef = ref(storage, `multipleFiles/${images[i].name}`);

      await uploadBytes(imageRef, images[i])
        .then(() => {
          setLoadingImage(true);
          delayIMG();
          storage
            .ref("multipleFiles")
            .child(images[i].name)
            .getDownloadURL()

            .then((url: any) => {
              setUrl((prev) => prev.concat(url));
              delayIMG();
              return url;
            });
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const addImages = async (url: string, id: number) => {


    await ratingAndCommentController
      .addImagesComment(url, id)
     
  };

  const resetImages = () => {
    setUrl([]);
  };
  const loading = () => {
    if (loadingImage) {
      return (
        <>
          <div className="absolute left-[45%] top-5 z-30">
            <Loading />
          </div>
        </>
      );
    } else {
      setLoadingImage(false);
    }
  };
  const { control, handleSubmit, reset, setValue } = useForm<Rating>({
    mode: "all",
    defaultValues: {
      idproduct: 0,
      comment: "",
      ratingValue: 5,
      iduser: 1,
      CommentImage: [
        {
          url: "",
        },
      ],
    },
  });
  const idDialogRating = "dialogRating";
  const onClose = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
      reset({});
    }
  };

  const openDialog = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  const handleRatingClick = (rating: number) => {
    setValue("ratingValue", rating);
    setSelectedRating(rating);
  };

  const [selectedRating, setSelectedRating] = useState(0);

  const ratings = [1, 2, 3, 4, 5];

  const getRatingText = () => {
    switch (selectedRating) {
      case 1:
        return "Rất tệ";
      case 2:
        return "Tệ";
      case 3:
        return "Bình thường";
      case 4:
        return "Tốt";
      case 5:
        return "Sản phẩm rất tốt";
      default:
        return "";
    }
  };

  //Thêm đánh giá
  const handleAddProductRating = (id: string, data: Rating) => {
    const _data = {
      idproduct: idSP,
      ratingValue: data.ratingValue,
      comment: data.comment,
    };
    ratingAndCommentController
      .postRatingAndComment(_data)
      .then(async (data) => {
        // setValue("iduser", data.iduser);
        // console.log(
        //   "🚀 ~ file: OrderDetailPage.tsx:64 ~ .then ~ data.iduser:",
        //   data.iduser
        // );
        toast.success("Đánh giá thành công !");
        resetImages();

        for (let i = 0; i < url.length; i++) {
          await addImages(url[i], data.id);
        }
        reset({});
        onClose(id);
      })
      .then(() => {
        orderControllers
          .putRatingAt(idOrder, idSP, orderDetails?.OrderDetail[indexSP]?.id)
          .then(() => {
            getOrderDetails();
          });
      })
      .catch(() => {
        toast.error("Đánh giá thất bại !");
      });
  };

  return (
    <Container>
      <div className="body-filter">
        <div className="grid grid-cols-9 mt-10 shadow gap-6 ">
          <div className="col-span-1"></div>
          <div className="col-span-7 max-2xl:col-span-5">
            <div className="back p-12 h-[57px] ">
              <div className="flex gap-3 items-center">
                <Link to={"/orderhistory"}>
                  <div className="border-[1px] border-[#EA4B48] rounded-md py-4 px-4 max-xl:p-3 max-lg:p-2">
                    <Back />
                  </div>
                </Link>
                <div>
                  <p className="font-normal text-sm max-xl:text-xs max-lg:text-[10px]">
                    Quay lại danh sách đơn hàng
                  </p>
                  <h2 className="uppercase text-[32px] font-bold max-xl:text-[28px] max-lg:text-xl">
                    Chi tiết đơn hàng
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-12  border-[#6C6C6C40] rounded-md flex flex-col gap-10 max-lg:p-6">
              <div className="flex gap-5">
                <div className="w-[60%] max-lg:w-[55%] border-[#6C6C6C40] border-[1px] rounded-md p-[26px] flex flex-col gap-9">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-1 items-center">
                      <Location />
                      <p className="text-[#EA4B48] font-medium text-sm max-[870px]:text-xs">
                        Địa chỉ nhận hàng
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#1A1A1A] max-[870px]:text-xs">
                        <span className="font-bold">
                          {orderDetails?.name}, {orderDetails?.phoneNumber}{" "}
                        </span>{" "}
                        {orderDetails?.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex gap-1 items-center">
                      <Location />
                      <p className="text-[#EA4B48] font-medium text-sm max-[870px]:text-xs">
                        Ghi chú
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-normal text-[#1A1A1A] max-[870px]:text-xs">
                        {orderDetails?.note == "" || orderDetails?.note == null
                          ? "Không có"
                          : orderDetails?.note}{" "}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-[40%] max-lg:w-[45%] flex flex-col gap-5 p-[20px] border-[#6C6C6C40] border-[1px] rounded-md">
                  <div className="">
                    <div className="flex gap-5 max-xl:gap-3 max-lg:gap-0">
                      <div>
                        <p className="text-xs text-[#E0E0E0] max-xl:text-[13px] max-[870px]:text-xs">
                          ID ĐƠN HÀNG
                        </p>
                        <p className="max-xl:text-sm max-[870px]:text-xs">
                          #000{orderDetails.id}
                        </p>
                      </div>
                      <div className="border-r-[1px] border-[#FFAAAF] h-[25px] my-auto"></div>
                      <div>
                        <p className="text-xs text-[#E0E0E0] max-xl:text-[13px] max-[870px]:text-xs">
                          PHƯƠNG THỨC THANH TOÁN
                        </p>
                        <p className="max-xl:text-sm max-[870px]:text-xs">
                          {orderDetails.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm text-[#393939] max-[870px]:text-[11px]">
                      Tổng Giá Sản Phẩm:{" "}
                    </p>
                    <p className="text-sm text-[#EA4B48] max-[870px]:text-[11px]">
                      {numberFormat(orderDetails.subtotal)}
                    </p>
                  </div>
                  <div className="flex justify-between border-t-[1px] pt-2">
                    <p className="text-sm text-[#393939] max-[870px]:text-[11px]">
                      Phí Giao Hàng:{" "}
                    </p>
                    <div className="flex gap-1">
                      <p className="text-sm text-[#EA4B48] max-[870px]:text-[11px]">
                        {numberFormat(orderDetails.shipping)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between border-t-[1px] pt-2">
                    <p className="text-sm text-[#393939] max-[870px]:text-[11px]">
                      Giảm:{" "}
                    </p>
                    <div className="flex gap-1">
                      <p className="text-sm text-[#FFAAAF] line-through max-[870px]:text-[11px]">
                        {numberFormat(orderDetails.discount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between border-t-[1px] pt-2">
                    <p className="text-sm text-[#393939] max-[870px]:text-[11px]">
                      Tổng Thanh Toán:{" "}
                    </p>
                    <p className="text-xl text-[#EA4B48] font-semibold max-[870px]:text-sm">
                      {numberFormat(orderDetails.amountTotal)}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <StepperPage
                  deletedAt={orderDetails.deletedAt}
                  status={orderDetails.status}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-5 px-[26px] py-[10px] bg-[#F2F2F2]">
                  <h4 className="col-span-2 font-normal text-[#1A1A1A] text-sm max-[870px]:text-xs">
                    SẢN PHẨM
                  </h4>
                  <h4 className="col-span-1 font-normal text-[#1A1A1A] text-sm text-center max-[870px]:text-xs">
                    GIÁ
                  </h4>
                  <h4 className="col-span-1 font-normal text-[#1A1A1A] text-sm text-center max-[870px]:text-xs">
                    TỔNG
                  </h4>
                  <h4 className="col-span-1 font-normal text-[#1A1A1A] text-sm text-center max-[870px]:text-xs">
                    THAO TÁC
                  </h4>
                </div>
                {orderDetails?.OrderDetail?.map((e, index) => {
                  return (
                    <>
                      <div className="grid grid-cols-5 px-[26px] py-[16px] items-center bg-[#FFFFFF] shadow">
                        <div className="col-span-2 text-sm flex gap-4 items-center">
                          <img
                            className="w-[70px] h-[70px] object-contain"
                            src={e.image}
                            alt=""
                          />
                          <div>
                            <p className="text-base text-[#393939] max-[870px]:text-[13px]">
                              {e.name}
                            </p>
                            <p className="text-sm text-[#1A1A1A] max-[870px]:text-[13px]">
                              SL:{" "}
                              <span className="text-[#4C4C4C]">
                                x{e.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="col-span-1 flex gap-2 justify-around items-center">
                          <p className="font-medium text-[#7A828A] text-sm line-through max-[870px]:text-[13px]">
                            {numberFormat(e.price)}
                          </p>
                          <p className="font-medium text-[#1A1A1A] text-base max-[870px]:text-[13px]">
                            {numberFormat(e.price)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-[#EA4B48] text-base text-center max-[870px]:text-[13px]">
                            {numberFormat(e.total)}
                          </p>
                        </div>
                        <div className="col-span-1 flex mx-auto items-center">
                          {orderDetails.status == 6 ? (
                            <>
                              <button
                                className={` rounded-md font-medium ${
                                  e.ratingAt == null
                                    ? `cursor-pointer bg-[#EA4B48]`
                                    : `cursor-not-allowed bg-[#908a8a]`
                                }`}
                                onClick={() => {
                                  if (e.ratingAt == null) {
                                    openDialog(idDialogRating);
                                    setIdSP(e.productId);
                                    setIndexSP(index);
                                  }
                                }}
                              >
                                <p className="px-4 py-2 text-white">
                                  {e.ratingAt == null
                                    ? "Đánh giá"
                                    : "Đã đánh giá"}
                                </p>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className={` rounded-md font-medium cursor-not-allowed bg-[#908a8a]`}
                              >
                                <p className="px-4 py-2 text-white">Đánh giá</p>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })}
                <DialogModal
                  id={idDialogRating}
                  onClose={() => onClose(idDialogRating)}
                  onSave={handleSubmit((data: Rating) => {
                    handleAddProductRating(idDialogRating, data);
                  })}
                  title="Đánh Giá Sản Phẩm"
                  body={
                    <>
                      <div className="grid grid-cols-2 w-[800px]">
                        <div className="flex col-span-1 items-start gap-3">
                          <div>
                            <img
                              src={
                                orderDetails?.OrderDetail?.length > 0
                                  ? orderDetails?.OrderDetail[indexSP]?.image
                                  : ""
                              }
                              alt="imageproduct5"
                              className="mb-5 h-[50px] w-[50px] object-cover"
                            />
                          </div>
                          <div className="flex-col flex">
                            <p className="text-[#393939] text-base font-semibold">
                              {orderDetails?.OrderDetail?.length > 0
                                ? orderDetails?.OrderDetail[indexSP]?.name
                                : 0}
                            </p>
                            <p className="text-[#393939] text-sm font-normal">
                              SL: x
                              {orderDetails?.OrderDetail?.length > 0
                                ? orderDetails?.OrderDetail[indexSP]?.quantity
                                : 0}
                            </p>
                          </div>
                        </div>
                        <div className=" col-span-1">
                          <p className="text-[#393939] text-lg font-semibold">
                            Chất lượng sản phẩm:
                          </p>
                          <div className="rating mt-1 ">
                            <div className="flex items-center justify-start gap-3 ">
                              <div className="rating rating-lg gap-3">
                                <Controller
                                  control={control}
                                  name="ratingValue"
                                  rules={{
                                    required: {
                                      value: true,
                                      message: "",
                                    },
                                  }}
                                  render={({}) => (
                                    <>
                                      <div className="flex items-center">
                                        {ratings.map((rating) => (
                                          <>
                                            <input
                                              key={rating}
                                              type="radio"
                                              name="rating-5"
                                              className="mask mask-star-2 bg-orange-400"
                                              onClick={() =>
                                                handleRatingClick(rating)
                                              }
                                            />
                                          </>
                                        ))}
                                        {selectedRating > 0 && (
                                          <p className="ml-4 text-sm">
                                            {getRatingText()}
                                          </p>
                                        )}
                                      </div>
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className=" border-b-[1px] border-[#E0E0E0] mb-4"></div>
                      <div>
                        <Controller
                          control={control}
                          name="comment"
                          rules={{
                            required: {
                              value: true,
                              message:
                                "Bạn phải nhập thông tin cho trường dữ liệu này!",
                            },
                          }}
                          render={({ field }) => (
                            <>
                              <p className="text-[#4C4C4C] text-base font-semibold mb-[8px] mt-[23px] max-xl:text-[13px] max-lg:text-xs">
                                Mô tả chất lượng sản phẩm
                                <span className="text-[#FF0000]">*</span>
                              </p>
                              <textarea
                                id="message"
                                rows={4}
                                className="block p-2.5 w-full text-sm text-gray-900 outline-none
                             border-[1px] border-[#FFAAAF] rounded-md mt-2"
                                placeholder="Để lại bình luận..."
                                defaultValue={field.value}
                                onChange={field.onChange}
                              />
                            </>
                          )}
                        />
                        {/* // ảnh sản phẩm  */}
                        <div>
                          <p className="text-[#4C4C4C] text-base font-semibold mb-[8px] mt-[23px] max-xl:text-[13px] max-lg:text-xs">
                            Thêm ảnh
                            <span className="text-[#FF0000]">*</span>
                          </p>
                          {/* card */}
                          <div
                            className="card w-[100%] py-4 px-9 mt-2 
                                shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                          >
                            <Controller
                              control={control}
                              name="CommentImage"
                              render={({}) => (
                                <>
                                  <div className="flex max-[1300px]:gap-3">
                                    {/* form upload img */}
                                    <div className="max-w-max items-center">
                                      <label htmlFor="images">
                                        <div
                                          className="outline-dashed outline-2 outline-offset-2 outline-[#EA4B48] py-7 px-9 cursor-pointer
                                                                 max-xl:px-4 max-[1100px]:py-4 max-[1024px]:p-2 max-[768px]:p-1"
                                        >
                                          <input
                                            type="file"
                                            // onChange={field.onChange}
                                            onChange={(e: any) =>
                                              loadImageFile(e.target.files)
                                            }
                                            id="images"
                                            multiple
                                            className="hidden "
                                          />
                                          <UploadIMG />
                                          <div
                                            id="images"
                                            className="text-center mt-2"
                                          >
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
                                    {/* end form upload img */}

                                    <div className="justify-center flex flex-1">
                                      <div className="inline-grid grid-cols-3 gap-4 relative">
                                        {url.map((e) => {
                                          return (
                                            <>
                                              <div className="relative">
                                                {loading()}
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
                                                    // onClick={() =>
                                                    //   handleRemoveOnlyIMG(e.id)
                                                    // }
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
                                </>
                              )}
                            />
                          </div>
                        </div>
                        {/* end ảnh bình luận sản phẩm  */}
                      </div>
                      <div className=" border-b-[1px] border-[#E0E0E0] mb-4"></div>
                    </>
                  }
                />
              </div>
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </Container>
  );
}
