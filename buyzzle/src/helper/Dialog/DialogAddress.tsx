import { ReactNode } from "react";

type Props = {
   title: string;
   id: string;
   body: ReactNode;
   onClose: () => void;
   onSave: () => void;
};

export default function DialogAddress(props: Props) {
   const { body, id, onClose, onSave, title } = props;
   return (
      <>
         <dialog id={id} className="modal">
            <div className="modal-box">
               <div className="border-b-[1px] pb-4 mb-4">
                  <h1 className="text-[#EA4B48] text-sm font-lg font-bold tracking-normal leading-tight max-[870px]:text-xs">
                     {title}
                  </h1>
               </div>

               {body}

               <div className="flex justify-end gap-2">
                  <button
                     onClick={() => onClose()}
                     className="py-2 px-14 border-[1px] border-[#EA4B48] text-sm text-[#1A1A1A] rounded"
                  >
                     Hủy
                  </button>
                  <button
                     onClick={() => onSave()}
                     className="py-2 px-11 border-[1px] text-sm text-[#FCFCFD] rounded bg-[#EA4B48]"
                  >
                     Xác Nhận
                  </button>
               </div>
            </div>
         </dialog>
      </>
   );
}
