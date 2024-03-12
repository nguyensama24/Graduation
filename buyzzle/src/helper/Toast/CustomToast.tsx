import { ReactNode } from "react";
interface ToastCustomModel {
  image?: ReactNode;
  iconSVG: ReactNode;
  name: ReactNode;
  content: ReactNode;
}
export default function CustomToast(props: ToastCustomModel) {
  const { image, iconSVG, name, content } = props;
  return (
    <>
      {/* <a  href={`/orderdetail/${notiItems.orderId}`}> */}
      <div id="toast-notification" role="alert" className=" rounded-lg">
        <div className="flex items-center mb-3">
          <span className="mb-1 text-sm font-semibold text-gray-900">
            Thông báo mới
          </span>
        </div>
        <div className="flex items-center">
          <div className="relative inline-block shrink-0">
            {image}
            {iconSVG}
          </div>
          <div className="ms-3 text-sm font-normal">
            {name}
            {content}
          </div>
        </div>
      </div>
      {/* </a> */}
    </>
  );
}
