/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckboxCategory } from "../SitebarFilter";

// b2. se di tim cai data minh muon chuyen di (title trong props: CheckboxCategory)
export default function Checkbox(props: CheckboxCategory) {
  return (
    <>
      <div className="flex items-center mr-4 mt-4 justify-start ">
        <input
          type="radio"
          name="colored-radio"
          id="orange-radio"
          className="appearance-none cursor-pointer h-6 w-6 border border-[#CCCCCC] rounded-full 
          checked:bg-[#EA4B48] checked:scale-75 transition-all duration-200 peer "
          // b1. Xac dinh kieu focus cua inpt la onChange event
          onChange={() => {
            // b5. khi co duoc xong ham callBacks ben phia cha, thi ben con se truyen vao ( luu y "?." khi dung lai props.Callbacks)
            props.onChangeFilter?.(props.title);
            props.getProduct(props.index)
          }}
        />
        <div
          className="h-6 w-6 absolute rounded-full pointer-events-none
          peer-checked:border-[#EA4B48] peer-checked:border-2"
        />
        <div
          // onClick={() => props.getProduct(props.index)}
          className="max-xl:w-[150px] flex flex-col justify-center px-2 peer-checked:text-[#EA4B48]">
          {props.title.length >= 20 ? (
            <label className="truncate block">{props.title}</label>
          ) : (
            <label className="w-auto">{props.title}</label>
          )}
        </div>
        <p className="text-sm text-[#808080]">({props.quantity})</p>
      </div>
    </>
  );
}
