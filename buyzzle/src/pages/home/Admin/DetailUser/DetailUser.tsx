import Back from "../assets/TSX/Back";
import ProFile from "../DetailUser/Components/Profile";
import PaymentAddress from "../DetailUser/Components/PaymentAddress";
import AccountStatus from "../DetailUser/Components/AccountStatus";
import Container from "../../../../components/container/Container";
import { Link } from "react-router-dom";

export default function DetailUser() {
  return (
    <Container>
      <div className="body-addproduct container mx-auto mb-32">
        {/* back */}
        <div className="back h-[57px] mt-[46px] ">
          <div className="flex gap-3 items-center">
            <Link to={"/admin/usersmanager"}>
              <div className="border-[1px] border-[#EA4B48] rounded-md py-4 px-4 max-xl:p-3 max-lg:p-2">
                <Back />
              </div>
            </Link>
            <div>
              <p className="font-normal text-sm max-xl:text-xs max-lg:text-[10px]">
                Quay lại danh sách sản phẩm
              </p>
              <h2 className="uppercase text-[32px] font-bold max-xl:text-[28px] max-lg:text-2xl">
                Chi Tiết User
                {/* //sda */}
              </h2>
            </div>
          </div>
        </div>
        {/* end back */}

        <div className="">
          <div className="grid grid-cols-2">
            <ProFile />
            <AccountStatus />
          </div>
          <PaymentAddress />
        </div>
      </div>
    </Container>
  );
}
