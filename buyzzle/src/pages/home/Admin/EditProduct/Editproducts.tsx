import { Link } from "react-router-dom";
import Container from "../../../../components/container/Container";
import Back from "../assets/TSX/Back";
import EditProductMap from "./EditProductMap";

export default function Editproducts() {
  return (
    <Container>
      <body className="body-filter container mx-auto">
        {/* back */}
        <div className="back h-[57px] mt-[46px] ">
          <div className="flex gap-3 items-center">
            <div className="border-[1px] border-[#EA4B48] rounded-md py-4 px-4 max-xl:p-3 max-lg:p-2">
              <Link to={"/admin/ListproductsAdmin"}>
                <Back />
              </Link>
            </div>
            <div>
              <p className="font-normal text-sm max-xl:text-xs max-lg:text-[10px]">
                Quay lại danh sách sản phẩm
              </p>
              <h2 className="uppercase text-[32px] font-bold max-xl:text-[28px] max-lg:text-2xl">
                Sửa Sản Phẩm
              </h2>
            </div>
          </div>
        </div>
        {/* end back */}

        <div className="mt-11 ">
          <EditProductMap />
        </div>
      </body>
    </Container>
  );
}
