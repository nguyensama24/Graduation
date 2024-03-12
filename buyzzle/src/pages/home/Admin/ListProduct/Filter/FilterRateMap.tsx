import { RatingStar } from "../../../../../components/Sitebar/SitebarFilter";

export default function FilterRateMap(props: RatingStar) {
   return (
      <div
         className="col-span-1 flex gap-3 items-center
            max-xl:gap-2 max-lg:gap-1"
      >
         <input type="radio"
          name="colored-radio"
          id="orange-radio"
          className="appearance-none h-6 w-6 border border-[#CCCCCC] rounded-full 
          checked:bg-[#EA4B48] checked:scale-75 transition-all duration-200 peer "
          onChange={(e) => {
            // b5. khi co duoc xong ham callBacks ben phia cha, thi ben con se truyen vao ( luu y "?." khi dung lai props.Callbacks)
            props.onChangeFilter?.(props.rating);
          }}
          
          />
<div
          className="h-6 w-6 absolute rounded-full pointer-events-none
          peer-checked:border-[#EA4B48] peer-checked:border-2"
        />
         <div className="flex items-center space-x-1 ">
            {[1, 2, 3, 4, 5].map((item) => {
               return (
                  <svg
                     className={`w-4 h-4 max-lg:w-3 max-[850px]:w-[10px] ${
                        props.rating >= item
                           ? `text-yellow-300`
                           : `text-[#CCCCCC]`
                     }`}
                     aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="currentColor"
                     viewBox="0 0 22 20"
                  >
                     <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
               );
            })}
         </div>
         <p className="max-[850px]:text-[10px]">{props.rating}.0</p>
      </div>
   );
}
