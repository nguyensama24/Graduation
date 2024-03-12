import { IonIcon } from "@ionic/react";
import { download, generateCsv } from "export-to-csv"; //Xuat excel
import { ChangeEvent, useEffect, useState } from "react";
import ResponsivePagination from "react-responsive-pagination";
import { toast } from "react-toastify";
import Search from "../../../../assets/TSX/Search";
import { productController } from "../../../../controllers/ProductsController";
import { csvConfig } from "../../../../helper/Export/Excel";
import Container from "../../../../components/container/Container";
import useDebounce from "../../../../useDebounceHook/useDebounce";
import Download from "../assets/TSX/Download";
import Filter from "../assets/TSX/Filter";
import PlusSquare from "../assets/TSX/PlusSquare";
import StatisticalAdmin from "../assets/TSX/statistical";
import SitebarAdmin from "../Sitebar/Sitebar";
import FilterListproduct from "./Filter/FilterListproduct";
import ListproductMap from "./ListproductMap";
import { Link } from "react-router-dom";
import DialogComfirm from "../../../../helper/Dialog/DialogComfirm";
import { useScroll } from "react-spring";

export default function ListproductsAdmin() {
  const idComfirmRemove = "removeModal";
  const [idProduct, setIdProduct] = useState<number>();
  // const [rate, setRate] = useState<number>();
  const [products, setProducts] = useState<any>([]);
  // Xuat excel
  const [search, setSearch] = useState("");
  const debouncedInputValueSearch = useDebounce(search, 1000); // Debounce for 300 milliseconds

  // Slider Price SiteBarFilterPages
  const [sliderPriceValues, setSliderPriceValues] = useState<[number, number]>([
    0, 10000000,
  ]);
  const debouncedInputValuePrice = useDebounce(sliderPriceValues, 400); // Debounce for 300 milliseconds

  const [sliderQuantityValues, setSliderQuantityValues] = useState<
    [number, number]
  >([0, 10000]);
  const debouncedInputValueQuantity = useDebounce(sliderQuantityValues, 400); // Debounce for 300 milliseconds

  const [sliderPurchaseValues, setSliderPurchaseValues] = useState<
    [number, number]
  >([0, 10000]);
  const debouncedInputValuePurchase = useDebounce(sliderPurchaseValues, 400); // Debounce for 300 milliseconds

  // pagination
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleRemove = async (id: number) => {
    const _dataRemove = {
      id: id,
      page: currentPage,
      pageSize: 5,
    };
    await productController
      .remove(_dataRemove)
      .then((res) => {
        setSearch("");
        closeComfirmRemove(idComfirmRemove);
        toast.success("Xóa thành công !");
        setProducts(res.data);
      })
      .catch(() => {
        toast.error("Xóa thất bại !");
      });
  };

  const [open, setOpen] = useState(false);

  const openModal = () => {
    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
      setOpen(!open);
    }
  };
  const closeModal = () => {
    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const openComfirmRemove = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };
  const closeComfirmRemove = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement | null;
    if (modal) {
      modal.close();
    }
  };

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const [isShown, setIsShown] = useState(false);

  const handleClick = () => {
    setIsShown((current) => !current);
  };

  // Slider Price SiteBarFilterPages and Slider Quantity SiteBarFilterPages
  useEffect(() => {
    handleFilter(
      debouncedInputValuePrice,
      debouncedInputValueQuantity,
      debouncedInputValuePurchase
    );
  }, [
    debouncedInputValuePrice,
    debouncedInputValueQuantity,
    debouncedInputValuePurchase,
    debouncedInputValueSearch,
    currentPage,
  ]);
  const handleFilter = async (
    priceRange: any,
    quantityRange: any,
    purchase: any
  ) => {
    await productController
      .getFilterProductbyPriceAndQuantityAndPurchaseWithinRangePagination(
        priceRange[0],
        priceRange[1],
        currentPage,
        5,
        quantityRange[0],
        quantityRange[1],
        purchase[0],
        purchase[1],
        search
      )
      .then((res: any) => {
        setProducts(res);
      });
  };

  const handleQuantityRangeChange = (quantity: [number, number]) => {
    setSliderQuantityValues(quantity);
   
  };

  const handlePriceRangeChange = (price: [number, number]) => {
    setSliderPriceValues(price);
  };

  const handlePurchaseRangeChange = (purchase: [number, number]) => {
    setSliderPurchaseValues(purchase);
  };

  const handleFillerStar = async (Rate: number) => {
    await productController.getProductWhereRatting(Rate)
    .then((res) => {
      setProducts(res);
    })
  }

  return (
    <>
      <Container>
        <div
          className="float-right cursor-pointer max-[1920px]:invisible max-2xl:visible"
          onClick={() => openModal()}
        >
          <IonIcon className="text-[2rem]" name={"menu"}></IonIcon>
        </div>
        <div className="grid grid-cols-5">
          <div className={`col-span-1`}>
            <dialog id="my_modal_3" className="max-2xl:modal ">
              <div className="relative">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-[120px]"
                  onClick={closeModal}
                >
                  ✕
                </button>
                <SitebarAdmin />
              </div>
            </dialog>
            <div className="max-2xl:hidden">
              <SitebarAdmin />
            </div>
          </div>
          <div className="content-right-filter  col-span-4 max-2xl:col-span-5 ">
            {/* h2 */}
            <div>
              <h2 className="txt-filter font-bold text-[#1A1A1A] text-3xl max-2xl:text-2xl">
                DANH SÁCH SẢN PHẨM
              </h2>
            </div>
            {/* end h2 */}
            <div
              className="grid gap-4 grid-cols-9 mt-4
            max-lg:grid-cols-5 max-lg:gap-0 max-[885px]:grid-cols-12
            "
            >
              <div
                className="col-span-2
              max-lg:col-span-1 
              "
              >
                <div
                  className="flex items-center w-[196px] rounded-md h-[46px] bg-[#EA4B48] justify-evenly cursor-pointer
                max-xl:w-[156px]
                max-lg:w-[130px]
                max-xl:h-[40px]
                max-[885px]:h-[35px]
                max-[885px]:w-[40px]"
                >
                  <PlusSquare />
                  <Link to={"/admin/Addproductspage"}>
                    <button
                      className="text-center text-base font-bold text-white 
                              max-xl:text-sm max-lg:text-xs max-[885px]:hidden
                              "
                    >
                      Thêm sản phẩm
                    </button>
                  </Link>
                </div>
              </div>

              <div
                className="flex gap-3 col-span-7 justify-around ml-20 max-2xl:pl-24
               max-xl:items-center
               max-xl:pl-0
               max-xl:ml-5
               max-lg:col-span-4
               max-[885px]:col-span-11
               max-lg:justify-start
               "
              >
                {/* input */}
                <div className="items-center flex">
                  <div
                    className="Search-input-headerCenter items-center flex
                   py-[3px] px-[6px] border-[1px] border-[#FFAAAF] rounded-md
                   max-2xl:w-[280px]
                   max-xl:h-[40px]
                   max-[885px]:h-[35px]
                   max-xl:w-[250px]
                   max-lg:w-[155px]
                   max-lg:px-0
                   max-[885px]:w-[203px]
                   "
                  >
                    <div className="mb-2  ">
                      <Search />
                    </div>
                    <input
                      className=" rounded-lg focus:outline-none text-lg pl-3
                   max-2xl:pr-3
                   max-xl:text-sm
                   max-lg:text-xs
                   max-lg:w-[50%]"
                      value={search}
                      placeholder="Tìm kiếm..."
                      onChange={onChangeSearchInput}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div>
                    <div
                      className="flex items-center w-[133px] rounded-md h-[46px] hover:bg-[#FFEAE9]
                   transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly cursor-pointer
                   max-xl:w-[125px]
                   max-xl:h-[40px]
                   max-[885px]:h-[35px]
                   max-[885px]:w-[102px]
                   "
                    >
                      <StatisticalAdmin />
                      <Link to={"/admin/statisticsPage"}>
                        <button
                          className="text-center text-base font-bold text-[#EA4B48] 
                                    max-xl:font-medium
                                    max-lg:text-xs
                                    "
                        >
                          Thống kê
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div
                      className="flex items-center w-[133px] rounded-md h-[46px] hover:bg-[#FFEAE9]
                   transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly cursor-pointer
                   max-xl:w-[125px]
                   max-xl:h-[40px]
                   max-[885px]:h-[35px]
                   max-[885px]:w-[102px]
                   "
                    >
                      <Download />
                      <button
                        className="text-center text-base font-bold text-[#EA4B48]
                    max-xl:font-medium
                    max-lg:text-xs
                    "
                        onClick={() => {
                          const csv = generateCsv(csvConfig)(products.rows); // Xuat excel
                          download(csvConfig)(csv);
                        }}
                      >
                        {" "}
                        Xuất excel
                      </button>
                    </div>
                  </div>

                  <div>
                    <div
                      className={
                        !isShown
                          ? `flex items-center w-[112px] rounded-md h-[46px] hover:bg-[#FFEAE9]
                   transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly cursor-pointer
                   max-xl:w-[125px]
                   max-xl:h-[40px]
                   max-[885px]:h-[35px]
                   text-center text-base font-bold text-[#EA4B48] 
                    max-xl:font-medium max-lg:text-xs max-[885px]:w-[102px]`
                          : `flex items-center w-[112px] rounded-md h-[46px] hover:bg-[#ff776f]
                    transition duration-150 border-[#FFAAAF] border-[1px] justify-evenly cursor-pointer
                    max-xl:w-[125px]
                    max-xl:h-[40px]
                    max-[885px]:h-[35px]
                    bg-[#EA4B48]
                    text-center text-base font-bold text-[#FFFFFF] 
                     max-xl:font-medium max-lg:text-xs max-[885px]:w-[102px]`
                      }
                      onClick={() => handleClick()}
                    >
                      <div
                        className={
                          !isShown ? `stroke-[#EA4B48]` : `stroke-white `
                        }
                      >
                        <Filter />
                      </div>
                      <button>Bộ lọc</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isShown && (
              <FilterListproduct
                setProductSubcate={() => console.log("s")}
                onRateChange={(value) => handleFillerStar(value)}
                valuePurchase={sliderPurchaseValues}
                valueQuantity={sliderQuantityValues}
                valuePrice={sliderPriceValues}
                onQuantityRangeChange={handleQuantityRangeChange}
                onPriceRangeChange={handlePriceRangeChange}
                onPurchaseRangeChange={handlePurchaseRangeChange}
              />
            )}

            <div className="grid grid-cols-9 mt-6 items-center">
              <div className="col-span-3 text-center max-lg:w-[40%]">
                <h3
                  className="text-[#1A1A1A] text-sm font-semibold leading-4
                max-xl:text-[13px]
                max-lg:w-[45%]
                max-lg:text-[10px]
                "
                >
                  THÔNG TIN
                </h3>
              </div>
              <div className="col-span-2 flex justify-center">
                <h3
                  className="text-[#1A1A1A] text-sm font-semibold leading-4
                max-xl:text-[13px]
                max-lg:w-[35%]
                max-lg:text-[10px]
                "
                >
                  GIÁ
                </h3>
              </div>

              <div className="col-span-1">
                <h3
                  className="flex justify-center text-[#1A1A1A] text-sm font-semibold leading-4 
                max-xl:text-[13px]
                max-lg:invisible
                "
                >
                  SỐ LƯỢNG
                </h3>
              </div>

              <div className="col-span-1">
                <h3
                  className="flex justify-center text-[#1A1A1A] text-sm font-semibold leading-4
                max-xl:text-[13px]
                max-lg:text-[10px]
                max-[940px]:truncate
                "
                >
                  LƯỢNG MUA
                </h3>
              </div>

              <div className="col-span-1">
                <h3
                  className="flex justify-center text-[#1A1A1A] text-sm font-semibold leading-4
                max-xl:text-[13px]
                max-lg:invisible
                "
                >
                  ĐÁNH GIÁ
                </h3>
              </div>

              <div className="col-span-1"></div>
            </div>
            <div className="mb-6">
              {products?.rows?.length > 0 ? (
                products?.rows?.map((items: any) => {
                  return (
                    <>
                      <ListproductMap
                        HandleRemove={(id) => {
                          openComfirmRemove(idComfirmRemove);
                          setIdProduct(id);
                        }}
                        products={items}
                      />
                    </>
                  );
                })
              ) : (
                <>
                  <p>Trống</p>
                </>
              )}
            </div>

            <DialogComfirm
              id={idComfirmRemove}
              onClose={() => closeComfirmRemove(idComfirmRemove)}
              onSave={() => handleRemove(idProduct!)}
              desc="Sản phẩm"
              title="Xóa sản phẩm"
            />

            <ResponsivePagination
              current={currentPage}
              total={products?.totalPage}
              onPageChange={setCurrentPage}
              maxWidth={500}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
