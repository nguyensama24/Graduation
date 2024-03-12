import { Images } from "../../assets/ts/index";
// import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import Back from "../home/admin/assets/TSX/Back";

export interface FormValues {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmpassword: string;
    phonenumber: string;
}
function DieuKhoan() {

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <div className="register-bg flex max-xl:flex-wrap">
            <div className="relative p-4 max-w-[872px] max-xl:mx-auto max-xl:mb-[20px]">
                <img
                    src={Images.bgRegisterIcon}
                    alt="bgRegisterIcon"
                    width={"924px"}
                    height={"1083px"}
                />

                <div className="absolute inset-0 flex justify-center items-center ">
                    <Link to="/">
                        <img
                            src={Images.logoSlogan}
                            alt="logo"
                            width={"90%"}
                            height={"90%"}
                        />
                    </Link>
                </div>
            </div>

            <div className="w-1/2 mt-0 overflow-auto">
                <div className="p-6 bg-white shadow-md rounded-md ">
                    <div className="flex gap-3 items-center">

                        <button onClick={handleGoBack}>
                            <div className="border-[1px] border-[#EA4B48] rounded-md py-4 px-4 max-xl:p-3 max-lg:p-2">
                                <Back />
                            </div>
                        </button>
                        <div> <p className="font-normal text-sm max-xl:text-xs max-lg:text-[10px]">
                            Quay lại
                        </p>
                            <h2 className="uppercase text-[32px] font-bold max-xl:text-[28px] max-lg:text-2xl">Điều khoản sử dụng của Buyzzle:</h2></div>

                    </div>


                    <p className="mb-4 text-lg">
                        Buyzzle là một trang web thương mại điện tử, cung cấp các sản phẩm và dịch vụ liên quan đến mua sắm trực tuyến. Khi bạn sử dụng trang web này, bạn đồng ý tuân theo các điều khoản và điều kiện sau đây:
                    </p>

                    <ul className="list-disc pl-6 mb-4 text-lg">
                        <li>Bạn phải có ít nhất 18 tuổi hoặc có sự đồng ý của phụ huynh hoặc người giám hộ hợp pháp để sử dụng trang web này.</li>
                        <li>Bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký tài khoản hoặc đặt hàng trên trang web này.</li>
                        <li>                Bạn không được sử dụng trang web này để thực hiện bất kỳ hành vi bất hợp pháp, vi phạm quyền sở hữu trí tuệ, xâm phạm quyền riêng tư, gây rối loạn, lừa đảo, quấy rối hoặc làm tổn hại đến bất kỳ bên thứ ba nào.
                        </li>
                        <li>                Bạn không được sao chép, phân phối, sửa đổi, đảo ngược, tháo gỡ, hack, can thiệp hoặc làm bất kỳ hành động nào nhằm mục đích làm hỏng, làm giảm hiệu suất, làm gián đoạn hoặc làm mất tính bảo mật của trang web này hoặc bất kỳ phần nào của nó.
                        </li>
                        <li>                Bạn không được sử dụng trang web này để gửi hoặc truyền bất kỳ loại virus, mã độc, mã hủy hoại, mã quảng cáo hoặc bất kỳ loại tệp hoặc dữ liệu nào có thể gây hại cho trang web này hoặc bất kỳ bên thứ ba nào.
                        </li>
                        <li>                Bạn chịu trách nhiệm về tất cả các hoạt động xảy ra dưới tài khoản của bạn và phải bảo mật mật khẩu của bạn. Bạn phải thông báo ngay cho chúng tôi nếu bạn phát hiện bất kỳ sự truy cập trái phép hoặc vi phạm bảo mật nào liên quan đến tài khoản của bạn.
                        </li>
                        <li>                Chúng tôi có quyền thay đổi, cập nhật, tạm ngừng hoặc ngừng cung cấp trang web này hoặc bất kỳ phần nào của nó mà không cần báo trước hoặc chịu trách nhiệm đối với bạn hoặc bất kỳ bên thứ ba nào.
                        </li>
                        <li>                Chúng tôi có quyền xóa, sửa đổi, từ chối hoặc hạn chế bất kỳ nội dung, thông tin, đánh giá, bình luận, phản hồi hoặc bất kỳ tài liệu nào do bạn hoặc bất kỳ bên thứ ba nào đăng tải, gửi hoặc truyền lên trang web này mà không cần báo trước hoặc chịu trách nhiệm đối với bạn hoặc bất kỳ bên thứ ba nào.
                        </li>
                        <li>                Chúng tôi không đảm bảo rằng trang web này sẽ hoạt động liên tục, không bị gián đoạn, không có lỗi hoặc an toàn. Bạn sử dụng trang web này hoàn toàn tự chịu rủi ro và chúng tôi không chịu trách nhiệm đối với bất kỳ thiệt hại, mất mát, chi phí hoặc bất kỳ hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng trang web này.
                        </li>
                        <li>                Chúng tôi không chịu trách nhiệm đối với bất kỳ nội dung, thông tin, sản phẩm, dịch vụ, quảng cáo, liên kết hoặc bất kỳ tài liệu nào do bất kỳ bên thứ ba nào cung cấp, đăng tải, gửi hoặc truyền lên trang web này. Bạn phải tự đánh giá và chịu rủi ro khi sử dụng hoặc tin tưởng vào bất kỳ điều đó.
                        </li>
                        {/* <li>                Chúng tôi có quyền sửa đổi, bổ sung hoặc thay đổi các điều khoản và điều kiện này bất cứ lúc nào mà không cần báo trước. Việc bạn tiếp tục sử dụng trang web này sau khi các thay đổi có hiệu lực có nghĩa là bạn đồng ý với các thay đổi đó.
                        </li> */}

                    </ul>

                    <p className="mb-4 text-lg">
                        Chúng tôi có quyền sửa đổi, bổ sung hoặc thay đổi các điều khoản và điều kiện này bất cứ lúc nào mà không cần báo trước. Việc bạn tiếp tục sử dụng trang web này sau khi các thay đổi có hiệu lực có nghĩa là bạn đồng ý với các thay đổi đó.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DieuKhoan;
