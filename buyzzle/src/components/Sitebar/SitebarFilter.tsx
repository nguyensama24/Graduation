import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useState } from "react";
import { Images } from "../../assets/ts";
import { numberFormat } from "../../helper/Format";
import { subCate } from "../../model/CategoryModel";
import Checkbox from "./Checkbox/Checkbox";
import Rate from "./Rate/Rate";
// rati star
export interface RatingStar {
  checked: boolean;
  rating: number;

  onChangeFilter?(rating: number): void;
}

const arrRating: RatingStar[] = [
  { checked: false, rating: 5 },
  { checked: false, rating: 4 },
  { checked: false, rating: 3 },
  { checked: false, rating: 2 },
  { checked: false, rating: 1 },
];

// check box
export interface CheckboxCategory {
  checkedCB: boolean;
  title: string;
  quantity: number;
  // b3. da xac dinh duoc can chuyen gi va nam o dau
  // b4. goi lai ham callbacks va truyen vao truong minh muon chuyen di
  onChangeFilter?(tittle: string): void;
  getProduct: (index: number) => void;
  index: number;
}
export interface ButtonSuggest {
  name: string;
}
const arrBtnSug: ButtonSuggest[] = [
  {
    name: "Áo Cổ điển",
  },
];
arrBtnSug.push(
  {
    name: "Áo Bra",
  },
  {
    name: "Áo",
  },
  {
    name: "Áo Cổ điển",
  }
);

export interface SliderComponentProps {
  onPriceRangeChange: (value: [number, number]) => void;
  onQuantityRangeChange: (value: [number, number]) => void;
  onRateChange: (value: number) => void;
  onPurchaseRangeChange: (value: [number, number]) => void;
  nameCate?: string;
  valuePrice?: [number, number];
  valuePurchase?: [number, number];
  valueQuantity?: [number, number];
  subcate?: subCate[];
  setProductSubcate: (index: number) => void;
}

export default function SitebarFilter({
  nameCate,
  onPriceRangeChange,
  onRateChange,
  subcate,
  setProductSubcate,
}: SliderComponentProps) {
  const [rangeValue, setRangeValue] = useState([5000, 300000]);
  const handleSliderChange = (price: [number, number]) => {
   
    setRangeValue(price);
    onPriceRangeChange(price);
  };

  const [rating, setRating] = useState(1);
  const handleRateChange = (rate: number) => {
    
    setRating(rate);
    onRateChange(rate);
  };
 

  return (
    <>
      <div className="content-left-filter mt-[34px] h-max p-4 ">
        <Accordion className="w-full" allowMultiple>
          <h2 className="txt-filter font-bold text-[#1A1A1A] text-[20px]">
            BỘ LỌC TÌM KIẾM
          </h2>
          {nameCate != null ? (
            <AccordionItem className="border-b border-gray-200 py-[17px] dark:!border-[#E6E6E6]">
              <h2>
                <AccordionButton className="flex justify-between">
                  <span className="text-left font-medium text-navy-900 dark:text-[#1A1A1A]">
                    Theo Danh Mục
                  </span>
                  <AccordionIcon className="text-left !text-navy-900 dark:!text-[#1A1A1A]" />
                </AccordionButton>
              </h2>
              <AccordionPanel
                className="text-left text-medium mt-2 !text-navy-900 dark:!text-[#1A1A1A]"
                pb={4}
              >
                <div className="mt-[20px]">
                  {/* default-radio-1 */}
                  {subcate?.map((item, index) => {
                    return (
                      <Checkbox
                        checkedCB={false}
                        quantity={item.productId.length}
                        title={item.name}
                        key={index}
                        getProduct={(index: number) => setProductSubcate(index)}
                        index={index}
                      />
                    );
                  })}

                  {/* default-radio-1-endsd */}
                </div>
              </AccordionPanel>
            </AccordionItem>
          ) : (
            <></>
          )}
          <AccordionItem className="border-b border-gray-200 py-[17px] dark:!border-[#E6E6E6]">
            <h2>
              <AccordionButton className="flex justify-between">
                <span className="text-left font-medium text-navy-900 dark:text-[#1A1A1A]">
                  Giá
                </span>
                <AccordionIcon className="text-left !text-navy-900 dark:!text-[#1A1A1A]" />
              </AccordionButton>
            </h2>
            <AccordionPanel
              className="text-medium mt-2 text-left !text-navy-900 dark:!text-[#1A1A1A]"
              pb={4}
            >
              <div className="slider w-[95%] mx-auto">
                <Slider
                  min={1000}
                  max={1000000}
                  step={1}
                  pushable={false}
                  value={rangeValue}
                  trackStyle={{
                    backgroundColor: "#EA4B48",
                  }}
                  handleStyle={{ border: "1px solid red" }}
                  // dotStyle={{ backgroundColor: "#EA4B48", outlineColor: "#EA4B48",color:'red',border:'1px solid #EA4B48'}}
                  onChange={(e: any) => handleSliderChange(e)}
                  // value={rangeValue}
                  // onChange={() => onSliderChange}
                  range
                // onChange={(e) => {
                //   // b5. khi co duoc xong ham callBacks ben phia cha, thi ben con se truyen vao ( luu y "?." khi dung lai props.Callbacks)
                //   props.onChangeSlider?.(props.minPrice, props.maxPrice);
                // }}
                />
                <div className="flex mt-[20px] justify-start gap-2 ">
                  <p className="max-w-max">Giá: </p>
                  <p className="font-extrabold max-w-max ">
                    {numberFormat(rangeValue[0])} -{" "}
                    {numberFormat(rangeValue[1])}
                  </p>
                </div>
              </div>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem className="border-b border-gray-200 py-[17px] dark:!border-[#E6E6E6]">
            <h2>
              <AccordionButton className="flex justify-between">
                <span className="text-left font-medium text-navy-900 dark:text-[#1A1A1A]">
                  Đánh giá
                </span>
                <AccordionIcon className="text-left !text-navy-900 dark:!text-[#1A1A1A]" />
              </AccordionButton>
            </h2>
            <AccordionPanel
              className="text-left text-medium mt-2 !text-navy-900 dark:!text-[#1A1A1A]"
              pb={4}
            >
              <div className="rate flex">
                <div className="mt-3">
                  {arrRating.map((item, index) => {
                    return (
                      <Rate
                        checked={item.checked}
                        rating={item.rating}
                        key={index}
                        onChangeFilter={(rating) => {
                          const ratingNum: number = Number(rating);
                          handleRateChange(ratingNum);
                          onRateChange(ratingNum);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </AccordionPanel>
          </AccordionItem>
          {/* <div className="btn-deleteFilter font-extrabold flex items-center justify-center mt-[38px]">
            <button
              type="button"
              className=" text-white bg-[#EA4B48] hover:bg-red-400 rounded-lg px-6 py-3 w-[95%] "
            >
              Xóa bộ lọc
            </button>
          </div> */}
          <a href="#">
            <img
              className="mt-[12px] cursor-pointer opacity-100 hover:opacity-80 transition duration-200 hover:ease-in"
              src={Images.Advertise}
              alt="Advertise"
            />
          </a>
        </Accordion>
      </div>{" "}
      {/* content-left-filter */}
    </>
  );
}
