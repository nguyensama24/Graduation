import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Images } from "../../../../../assets/ts";
import LineCMT from "../../../../../assets/TSX/LineCMT";
import Period from "../../../../../assets/TSX/Period";
import SendCmt from "../../../../../assets/TSX/SendCmt";
import { ratingAndCommentController } from "../../../../../controllers/Rating&Comment";
import DialogModal from "../../../../../helper/Dialog/DialogModal";
import { currentDate, roundedNumber } from "../../../../../helper/Format";
import { stars } from "../../../../../helper/StarRating/Star";
import { Ratee, Rating } from "../../../../../model/ProductModel";
import Edit from "../../../admin/assets/TSX/Edit";
import RemoveCate from "../../../admin/assets/TSX/RemoveCate";
import secureLocalStorage from "react-secure-storage";
import { adminController } from "../../../../../controllers/AdminControllder";
import EmptyPage from "../../../../../helper/Empty/EmptyPage";
import EyeSlide from "../../../admin/assets/TSX/EyeSlide";
import Handle from "../../../admin/assets/TSX/bacham";

interface FormValues {
  id: number;
  idproduct: number;
  iduser: number;
  ratingValue: number;
  comment: string;
  createdAt: Date;
  product: {
    quantity: number;
  };
  user: {
    username: string;
  };
  CommentImage: {
    url: string;
  }[];
}

type Props = {
  handleEditProductRating: (
    id: string,
    data: Rating,
    idRating: number
  ) => Promise<void>;
  rateAndcomment: Ratee;
  handleRemoveRating: (id: number) => void;
  setRateAndcomment: React.Dispatch<React.SetStateAction<Ratee>>;
  getCommentWhereRating: (idproduct: any, rating: any) => void;
};
export default function RatingMap(props: Props) {
  const [isFeedbackClicked, setIsFeedbackClicked] = useState<number | null>(1);
  const [idRating, setidRating] = useState<number>(0);
  const [repTextCmt, setTextRepCmt] = useState<string>("");
  const [AdminAvt, setAdminAvt] = useState<any>("");
  const [AdminName, setAdminName] = useState<any>("");
  // const [AdminAvt, setAdminAvt] = useState<any>("");
  const [Username, setUsername] = useState<any>("");
  const { id: idProduct } = useParams();

  const {
    control,
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      comment: "",
      ratingValue: 5,
      iduser: 1,
    },
  });
  const idDialogRating = "dialogRating";
  const onClose = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const openDialog = (id: string, idRating: number, comment: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      reset({ comment: comment });
      modal.showModal();
    }
  };
  const handleRatingClick = (rating: number) => {
    setValue("ratingValue", rating);
  
  };
  const handleFeedbackClick = (ratingId: number) => {
    if (isFeedbackClicked === ratingId) {
      setIsFeedbackClicked(null);
    } else {
      setIsFeedbackClicked(ratingId);
    }
  };
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key == "Enter") {
      getAdminRepComment(id);
    }
  };
  const getAdminRepComment = (id: number) => {
    const _dataRepCmt = {
      ratingId: id,
      repComment: repTextCmt,
      page: props.rateAndcomment.currentPage,
    };
    ratingAndCommentController
      .repCommentsFromAdminToUser(_dataRepCmt)
      .then((_) => {
        props.getCommentWhereRating(idProduct, 1);
        setTextRepCmt("");
        toast.success("Trả lời thành công !");
      })
      .catch((err) => console.log(err));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextRepCmt(e.target.value);
  };

  useEffect(() => {
    let user = secureLocalStorage.getItem("admin");
    if (user == null) {
   
      setAdminName(null);
      setAdminAvt(null);
    } else {
      const fetchData = async () => {
        user = JSON.stringify(secureLocalStorage.getItem("admin"));
        let UserData = JSON.parse(user);
        const username = UserData.username;
        await adminController.getAdminWhereUsername(username).then((res) => {
          const name = res.adminWithImage.name;

          // const email = res.adminWithImage.email;
          setAdminName(name);
          // setAdminAvt(null);
          // const pathName = `/admin/adminprofile/${username}`
          // setHref(`/admin/adminprofile/${username}`);
          // setName(name);
          // setEmail(email);
          if (res.adminWithImage.AdminImage != undefined) {
            const Image = res.adminWithImage.AdminImage[0].url;
            setAdminAvt(Image);
          } else {
            console.log("Error");
          }
   
          return res;
        });
      };
      fetchData();
    }
  }, []);
  useEffect(() => {
    let user = localStorage.getItem("nameUser");
    if (user == null) {
      setUsername(null);
    } else {
      const userData = JSON.parse(user);
      const username = userData;
  
      setUsername(username);
    
    }
  }, []);

  return (
    <div>
      {props.rateAndcomment?.Rating ? (
        props.rateAndcomment.Rating.length > 0 ? (
          props.rateAndcomment?.Rating.map((rating) => {
            return (
              <>
                <div
                  key={rating.id}
                  className="border-t-[1.5px] border-gray-300 px-11 py-8 bg-white mb-5 rounded-md"
                >
                  {/* header comment */}
                  <div className=" justify-between flex mb-4">
                    <div className="flex items-center gap-3">
                      {/* hinh anh */}
                      <div className="relative">
                        {rating?.user?.UserImage?.length > 0 ? (
                          <img
                            className="w-10 h-10 rounded-full"
                            src={`${rating?.user?.UserImage?.[0].url}`}
                            alt="Avtcmt"
                          />
                        ) : (
                          <div
                            // src={notiItems.fk_order.User.image}
                            // src={`${notiItems.fk_order.User.UserImage?.[0].url}`}
                            // alt="avatar_admin"
                            className={`w-12 h-12 border-4  rounded-full bg-red-500 pt-2 pb-2 ps-3.5 pe-3.5}`}
                          >
                            <p className="text-1xl text-stone-50">
                              {(rating?.user?.name)
                                .substring(0, 1)
                                .toUpperCase()}
                            </p>
                          </div>
                        )}
                      </div>
                      {/* end hinh anh */}
                      {/* thong tin users */}
                      <div>
                        {/* name - period - date */}
                        <div className="flex items-center">
                          {/* name */}{" "}
                          <p className="text-[#1A1A1A] text-xl font-medium">
                            {rating?.user?.name}
                          </p>
                          {/* end name */}
                          {/* period */}
                          <Period /> {/* end period */}
                          {/* date */}{" "}
                          <p className="text-[#4C4C4C] font-normal text-sm">
                            {currentDate(rating.createdAt)}
                          </p>
                          {/* end date */}
                        </div>
                        {/* end name - period - date */}
                        {/* rating */}
                        <div className="flex gap-1">
                          <div className="rating rating-xs">
                            {stars.map((_, index) => (
                              <button key={index}>
                                {/* Sử dụng index để xác định xem sao này có phải sao màu vàng hay không */}
                                <img
                                  src={
                                    index < rating.ratingValue
                                      ? Images.star1
                                      : Images.star2
                                  }
                                  alt=""
                                />
                              </button>
                            ))}
                          </div>
                          <p className="text-[#4C4C4C] font-normal text-xs">
                            {roundedNumber(rating.ratingValue)}.0
                          </p>
                        </div>
                        {/* end rating */}
                      </div>{" "}
                      {/* end thong tin users */}
                    </div>
                    <div className="items-center">
                      <div className="dropdown dropdown-right ">
                        {Username == rating?.user?.name ? (
                          <>
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
                                  onClick={() => {
                                    openDialog(
                                      idDialogRating,
                                      rating.id,
                                      rating.comment
                                    );
                                    setidRating(rating.id);
                                  }}
                                >
                                  <Edit />
                                  <p
                                    className="text-[#EA4B48] text-sm font-medium
                                max-[940px]:text-xs "
                                  >
                                    Chỉnh sửa
                                  </p>
                                </button>
                              </li>
                              <li>
                                <button
                                  className="flex items-center gap-4"
                                  onClick={() =>
                                    props.handleRemoveRating(rating.id)
                                  }
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
                          </>
                        ) : (
                          <>
                            {AdminName ? (
                              <>
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
                                      onClick={() =>
                                        props.handleRemoveRating(rating.id)
                                      }
                                    >
                                      <EyeSlide />
                                      <p
                                        className="text-[#EA4B48] text-sm font-medium
                                 max-[940px]:text-xs "
                                      >
                                        Ẩn bình luận
                                      </p>
                                    </button>
                                  </li>
                                </ul>
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* end header comment */}
                  {/* content comment */}

                  <div className="border-t-[1px] border-[#E0E0E0] pt-2">
                    <p className="text-[#4C4C4C]">{rating.comment}</p>
                    <div className=" flex flex-1 mt-2">
                      <div className="inline-grid grid-cols-8 gap-4 relative ">
                        {rating.CommentImage.map((img) => {
                          return (
                            <>
                              <img
                                src={img.url}
                                alt="imgComment"
                                className="w-20 h-20 rounded-md"
                              />
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* text reply */}

                  <>
                    {" "}
                    {rating.repComment ? (
                      <div>
                        <p
                          className="text-[#4C4C4C] text-xs hover:underline cursor-pointer max-w-max float-right"
                          onClick={() => handleFeedbackClick(rating.id)}
                        >
                          {isFeedbackClicked === rating.id
                            ? "Ẩn phản hồi"
                            : "Xem phản hồi"}
                        </p>
                      </div>
                    ) : (
                      <>
                        {AdminName ? (
                          <div>
                            <p
                              className="text-[#4C4C4C] text-xs hover:underline cursor-pointer max-w-max float-right"
                              onClick={() => handleFeedbackClick(rating.id)}
                            >
                              {isFeedbackClicked === rating.id
                                ? "Ẩn phản hồi"
                                : "Phản hồi"}
                            </p>
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </>
                    )}
                  </>

                  {isFeedbackClicked === rating.id && (
                    <>
                      {/* end reply content comment */}
                      {/* input */}

                      <div>
                        {/* end text reply */}
                        {/* reply content comment */}

                        {rating.repComment != null ? (
                          <>
                            {AdminName ? (
                              <div className="mx-3 my-2 flex">
                                <div className="ml-2">
                                  <LineCMT />
                                </div>
                                {/* shop reply cmt */}
                                <div className="flex items-center mt-1 ml-3 gap-3">
                                  {/* hinh anh */}
                                  <div className="relative ">
                                    {rating?.admin?.AdminImage?.length > 0 ? (
                                      <img
                                        className="w-10 h-10 rounded-full"
                                        src={`${AdminAvt}`}
                                        alt="Avtcmt"
                                      />
                                    ) : (
                                      <div
                                        // src={notiItems.fk_order.User.image}
                                        // src={`${notiItems.fk_order.User.UserImage?.[0].url}`}
                                        // alt="avatar_admin"
                                        className={`w-12 h-12 border-4  rounded-full bg-red-500 pt-2.5 pb-2.5 ps-4 pe-4`}
                                      >
                                        <p className="text-1xl text-stone-50">
                                          {(rating?.admin?.name)
                                            .substring(0, 1)
                                            .toUpperCase()}
                                        </p>
                                      </div>
                                    )}

                                    {/* <img src={`${rating?.admin?.AdminImage?.[0].url}`} className="w-10 h-10 rounded-ful"/>  */}
                                  </div>
                                  {/* end hinh anh */}
                                  {/* thong tin admin */}
                                  <div>
                                    {/* name - period - date */}
                                    <div className="flex items-center">
                                      {/* name */}{" "}
                                      <p className="text-[#1A1A1A] text-base font-medium">
                                        {AdminName}
                                      </p>
                                      {/* end name */}
                                      {/* period */}
                                      <Period /> {/* end period */}
                                      {/* date */}{" "}
                                      <p className="text-[#4C4C4C] text-[12px]">
                                        {currentDate(rating.updateAt)}
                                      </p>
                                      {/* end date */}
                                    </div>
                                    {/* end name - period - date */}
                                  </div>{" "}
                                  {/* end thong tin admin */}
                                </div>

                                {/* shop reply cmt */}
                              </div>
                            ) : (
                              <div className="mx-3 my-2 flex">
                                <div className="ml-2">
                                  <LineCMT />
                                </div>
                                {/* shop reply cmt */}
                                <div className="flex items-center mt-1 ml-3 gap-3">
                                  {/* hinh anh */}
                                  <div className="relative ">
                                    {rating?.admin?.AdminImage?.length > 0 ? (
                                      <img
                                        className="w-10 h-10 rounded-full"
                                        src={`${AdminAvt}`}
                                        alt="Avtcmt"
                                      />
                                    ) : (
                                      <div
                                        // src={notiItems.fk_order.User.image}
                                        // src={`${notiItems.fk_order.User.UserImage?.[0].url}`}
                                        // alt="avatar_admin"
                                        className={`w-12 h-12 border-4  rounded-full bg-red-500 pt-2.5 pb-2.5 ps-4 pe-4`}
                                      >
                                        <p className="text-1xl text-stone-50">
                                          {(rating?.admin?.name)
                                            .substring(0, 1)
                                            .toUpperCase()}
                                        </p>
                                      </div>
                                    )}
                                    {/* <img src={`${rating?.admin?.AdminImage?.[0].url}`} className="w-10 h-10 rounded-ful"/>  */}
                                    <span className="top-0 right-0 absolute  w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
                                  </div>
                                  {/* end hinh anh */}
                                  {/* thong tin admin */}
                                  <div>
                                    {/* name - period - date */}
                                    <div className="flex items-center">
                                      {/* name */}{" "}
                                      <p className="text-[#1A1A1A] text-base font-medium">
                                        {rating?.admin?.name}
                                      </p>
                                      {/* end name */}
                                      {/* period */}
                                      <Period /> {/* end period */}
                                      {/* date */}{" "}
                                      <p className="text-[#4C4C4C] text-[12px]">
                                        {currentDate(rating.updateAt)}
                                      </p>
                                      {/* end date */}
                                    </div>
                                    {/* end name - period - date */}
                                  </div>{" "}
                                  {/* end thong tin admin */}
                                </div>

                                {/* shop reply cmt */}
                              </div>
                            )}
                            <div className="border-t-[1px] border-[#E0E0E0] py-2 mx-7 mt-4">
                              <p className="text-[#4C4C4C]">
                                {rating.repComment}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            {AdminName ? (
                              <>
                                {" "}
                                <div className="mx-3 my-2 flex">
                                  <div className="ml-2">
                                    <LineCMT />
                                  </div>
                                  {/* shop reply cmt */}
                                  <div className="flex items-center mt-1 ml-3 gap-3">
                                    {/* hinh anh */}
                                    <div className="relative ">
                                      {rating?.admin?.AdminImage?.length > 0 ? (
                                        <img
                                          className="w-10 h-10 rounded-full"
                                          src={`${AdminAvt}`}
                                          alt="Avtcmt"
                                        />
                                      ) : (
                                        <div
                                          // src={notiItems.fk_order.User.image}
                                          // src={`${notiItems.fk_order.User.UserImage?.[0].url}`}
                                          // alt="avatar_admin"
                                          className={`w-12 h-12 border-4  rounded-full bg-red-500 pt-2.5 pb-2.5 ps-4 pe-4`}
                                        >
                                          <p className="text-1xl text-stone-50">
                                            {AdminName.substring(
                                              0,
                                              1
                                            ).toUpperCase()}
                                          </p>
                                        </div>
                                      )}
                                      {/* <img src={`${rating?.admin?.AdminImage?.[0].url}`} className="w-10 h-10 rounded-ful"/>  */}
                                      <span className="top-0 right-0 absolute  w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
                                    </div>
                                    {/* end hinh anh */}
                                    {/* thong tin admin */}
                                    <div>
                                      {/* name - period - date */}
                                      <div className="flex items-center">
                                        {/* name */}{" "}
                                        <p className="text-[#1A1A1A] text-base font-medium">
                                          {AdminName}
                                        </p>
                                        {/* end name */}
                                        {/* period */}
                                        <Period /> {/* end period */}
                                        {/* date */}{" "}
                                        <p className="text-[#4C4C4C] text-[12px]">
                                          {currentDate(rating.updateAt)}
                                        </p>
                                        {/* end date */}
                                      </div>
                                      {/* end name - period - date */}
                                    </div>{" "}
                                    {/* end thong tin admin */}
                                  </div>

                                  {/* shop reply cmt */}
                                </div>
                                <div className="text-[#333333] rounded-[6px] px-[10px] py-[6px] max-xl:text-sm mt-2 border-[1px] border-[#FFAAAF] w-[95%] mx-auto flex">
                                  <input
                                    className={`w-full focus:outline-none`}
                                    value={repTextCmt}
                                    placeholder={`Trả lời ${rating?.user?.name}`}
                                    onChange={(e) => handleChange(e)}
                                    onKeyDown={(e: any) =>
                                      handleKeyPress(e, rating.id)
                                    }
                                  />
                                  <div
                                    className="pl-2 cursor-pointer"
                                    onClick={() => {
                                      if (repTextCmt.trim().length !== 0) {
                                        getAdminRepComment(rating.id);
                                      } else {
                                        toast.warn("Trống !");
                                      }
                                    }}
                                  >
                                    <SendCmt />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div></div>
                            )}
                          </>
                        )}
                      </div>
                      {/* content comment */}
                    </>
                  )}
                </div>
              </>
            );
          })
        ) : (
          <></>
        )
      ) : (
        <>
          <EmptyPage title="Chưa có đánh giá nào!" />
        </>
      )}
      <DialogModal
        id={idDialogRating}
        onClose={() => onClose(idDialogRating)}
        // onSave={handleSubmit(async (data: Rating) => {
        //   const htmlString = data.comment;
        //   const regex = /<p>(.*?)<\/p>/;
        //   const match = htmlString.match(regex);
        //   if (match) {
        //     const extractedText = match[1];
        //     const _data: Rating = {
        //       ...data,
        //       comment: extractedText,
        //     };

        //   }
        // })}
        onSave={handleSubmit((data: any) => {
          props
            .handleEditProductRating(idDialogRating, data, idRating)
            .finally(() => {
              onClose(idDialogRating);
            });
        })}
        title="Đánh Giá Sản Phẩm"
        body={
          <>
            <div className="grid grid-cols-2 w-[800px]">
              <div className="flex col-span-1 items-start gap-3">
                <div>
                  <img
                    src={Images.imageproduct5}
                    alt="imageproduct5"
                    className="mb-5"
                  />
                </div>
                <div className="flex-col flex">
                  <p className="text-[#393939] text-base font-semibold">
                    Máy tính để bàn
                  </p>
                  <p className="text-[#393939] text-sm font-normal">SL: x2</p>
                </div>
              </div>
              <div>
                <p className="text-[#393939] text-lg font-semibold">
                  Chất lượng sản phẩm:
                </p>
                <div className="rating mt-1 ">
                  <div className="flex items-center justify-start gap-3 ">
                    <div className="rating rating-lg gap-3 ">
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
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <input
                                key={rating}
                                type="radio"
                                name="rating-5"
                                className="mask mask-star-2 bg-orange-400"
                                onClick={() => handleRatingClick(rating)}
                                // ref={register}
                              />
                            ))}
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
              {/* <p>Mô tả chất lượng sản phẩm: </p> */}
              {/* <textarea
                            id="message"
                            rows={4}
                            className="block p-2.5 w-full text-sm text-gray-900 outline-none
                             border-[1px] border-[#FFAAAF] rounded-md mt-2"
                            placeholder="Để lại bình luận..."
                            defaultValue={""}
                          /> */}
              <Controller
                control={control}
                name="comment"
                rules={{
                  required: {
                    value: true,
                    message: "Bạn phải nhập thông tin cho trường dữ liệu này!",
                  },
                }}
                render={({ field }) => (
                  <>
                    <p className="text-[#4C4C4C] text-base font-semibold mb-[8px] mt-[23px] max-xl:text-[13px] max-lg:text-xs">
                      Mô tả chất lượng sản phẩm
                      <span className="text-[#FF0000]">*</span>
                    </p>
                    <textarea
                      rows={4}
                      className="block p-2.5 w-full text-sm text-gray-900 outline-none
                             border-[1px] border-[#FFAAAF] rounded-md mt-2"
                      placeholder="Để lại bình luận..."
                      value={field.value}
                      onChange={(e) => field.onChange(e)}
                    />
                  </>
                )}
              />
              {/* // ảnh sản phẩm  */}
              {/* <div>
                <p className="text-[#4C4C4C] text-base font-semibold mb-[8px] mt-[23px] max-xl:text-[13px] max-lg:text-xs">
                  Thêm ảnh
                  <span className="text-[#FF0000]">*</span>
                </p>
                {/* card */}
              {/* <div
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
              {/*    <div className="max-w-max items-center">
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
                          {/* end form upload img */}
              {/* {props.editImages.map((e) => {
                            return (
                              <>
                                <div className="relative">
                                  <div className="group relative">
                                    <img
                                      src={e.url}
                                      alt="imageproduct6"
                                      width={80}
                                      height={80}
                                      className="rounded-md"
                                    />
                                    <div
                                      className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden rounded-md bg-gray-900 bg-fixed 
                                                            opacity-0 transition duration-300 ease-in-out group-hover:opacity-20"
                                    ></div>
                                    <div className="transition duration-300 ease-in-out bottom-0 left-0 right-0 top-0 opacity-0 group-hover:opacity-100 absolute">
                                      <button
                                        // onClick={() =>
                                        //   props.handleRemoveOnlyIMG(e.id)
                                        // }
                                        onClick={() =>
                                            console.log("an không ?")
                                          }
                                      >
                                        <RemoveIMG />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })} */}
              {/*<div className="justify-center flex flex-1">
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
                                          onClick={() =>
                                            console.log("an không ?")
                                          }
                                          // onClick={() =>
                                          //   props.handleRemoveOnlyIMG()
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
              </div> */}
              {/* end ảnh bình luận sản phẩm  */}
            </div>
            <div className=" border-b-[1px] border-[#E0E0E0] mb-4"></div>
          </>
        }
      />
    </div>
  );
}
