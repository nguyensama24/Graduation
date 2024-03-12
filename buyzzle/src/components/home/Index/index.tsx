import Container from "../../container/Container";
import Category from "../components/Category";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useScroll } from "react-spring";
import { categoryController } from "../../../controllers/CategoryController";
import { logohome1Controller } from "../../../controllers/LogoHome1Controller";
import { logohomeController } from "../../../controllers/LogoHomeController";
import { productController } from "../../../controllers/ProductsController";
import { LogoHome1Model } from "../../../model/LogoHome1Model";
import { LogoHomeModel } from "../../../model/LogoHomeModel";
import { MergedProducts } from "../../../model/ProductsSuggest";
import {
  ImgOfProduct
} from "../../../pages/home/User/filterPage/FiltersPage";
import { Cate } from "../components/Category";
import Productss from "../components/Product";
import VoucherHomePage from "../components/Voucher/Voucher";
import SlidesHome from "../components/slides/SlidesHome/SlidesHome";

export type Product = {
  id: number;
  imgSrc: string;
  name: string;
  price: number;
  discount: number;
  soldCount: number;
  ProductImage: ImgOfProduct[];
};

export type FlashSaleList = {
  id: number;
  img: string;
  giamGia: number;
  title: string;
  vote: number;
  price: number;
  daBan: number;
};

function Index() {
  useScroll();
  const [categoty, setCategory] = useState<Cate[]>([]);
  const [productsSuggest, setProductsSuggest] = useState<MergedProducts[]>([]);
  const [logo, setLogo] = useState<LogoHomeModel[]>([]);
  const [logo1, setLogo1] = useState<LogoHome1Model[]>([]);

  const getAllLogo = async () => {
    await logohomeController.getAll().then((res: any) => {
      setLogo(res);
    });
  };

  useEffect(() => {
    getAllLogo();
  }, []);

  const getAlllLogo = async () => {
    await logohome1Controller.getAlll().then((res: any) => {
      setLogo1(res);
    });
  };

  useEffect(() => {
    getAlllLogo();
  }, []);

  const [page, setPage] = useState(1);
  const getCategory = () => {
    categoryController
      .getAll()
      .then((response) => response.data)
      .then((data) => {
        setCategory(data);
      })
     
  };

  const getAllProducts = (page: number) => {
    productController.getProductSuggestHome(page, 2).then((res) => {
      setProductsSuggest(res.mergedProducts);
    });
  };
  useEffect(() => {
    getCategory();
    getAllProducts(page);
  }, []);

  const nextData = () => {
    setPage(page + 1);
    productController.getProductSuggestHome(page + 1, 2).then((res) => {
      setProductsSuggest(productsSuggest.concat(res.mergedProducts));
    });
  };

  return (
    <>
      <Container>
        <div className="container mt-[50px]">
          <div className="flex justify-between max-xl:flex-wrap">
            <div className="max-w-[872px] max-xl:mx-auto max-xl:mb-[20px] max-[1023px]:hidden">
              <SlidesHome />
            </div>

            <div className="flex-col max-w-[421px] max-xl:mx-auto">
              {logo1?.map((items, index) => (
                <a
                  key={index}
                  href={`${items.linkgoogle}`}
                  className="flex items-center mb-5"
                  style={{ width: "100%", height: "140px" }}
                >
                  <img
                    className="object-cover w-full h-full"
                    src={items.image}
                    alt=""
                  />
                </a>
              ))}

              <div className="flex justify-between max-w-[421px] max-[556px]:hidden">
                {logo?.map((items, index) => (
                  <a
                    key={index}
                    href={`${items.linkgoogle}`}
                    className="flex items-center"
                    style={{
                      padding: "5px",
                      width: "100%",
                      height: "250px",
                      marginTop: "-6px",
                    }}
                  >
                    <img
                      className="object-cover w-full h-full"
                      src={items.image}
                      alt=""
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container my-[60px]">
          <h1 className="text-2xl font-bold mb-[15px]">Danh mục</h1>
          {/* <div className="flex flex-wrap gap-[35px] justify-center"> */}
          <div className="grid grid-cols-6 gap-[35px] justify-center">
            {categoty.map((e) => {
              return <Category id={e.id} image={e.image} name={e.name} />;
            })}
          </div>
        </div>

        <div className="container">
          <VoucherHomePage />
        </div>
      </Container>

      <Container>
        <div className="container my-[60px]">
          <h1 className="text-2xl font-bold mb-[15px]">Gợi ý sản phẩm </h1>

          <InfiniteScroll
            style={{ overflow: "hidden" }}
            dataLength={productsSuggest.length}
            next={nextData}
            hasMore={true}
            loader={<></>}
          >
            <div className="flex flex-wrap mb-6 gap-3 max-2xl:ml-0 max-2xl:flex-wrap max-lg:gap-4 ">
              {productsSuggest?.map((product) => {
                return <Productss product={product} />;
              })}
            </div>
          </InfiniteScroll>
        </div>
      </Container>
    </>
  );
}

export default Index;
