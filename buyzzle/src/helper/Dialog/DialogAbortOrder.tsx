import { ReactNode } from "react";
import ComfirmIcon from "../../assets/TSX/ComfirmIcon";

type Props = {
  title?: string;
  id?: string;
  desc?: string;
  input?: ReactNode;
  onClose: () => void;
  onSave: () => void;
};

export default function DialogAbortOrder(props: Props) {
  const { desc, id, onClose, onSave, title, input } = props;
  return (
    <>
      <dialog id={id} className="modal ">
        <div className="modal-box w-[450px]">
          <div>
            <div className="flex-col flex gap-2 items-center">
              <ComfirmIcon />
              <h1 className="text-[#EA4B48] text-xl font-lg font-semibold tracking-normal leading-tight max-[870px]:text-xs">
                {title}
              </h1>
              <p className=" text-center text-sm font-normal text-[#4C4C4C]">
                {desc}
              </p>
            </div>
          </div>

          {<div className="mt-5">{input}</div>}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => onClose()}
              className="py-2 px-[50px] flex items-center gap-2 border-[1px] border-[#EA4B48] text-sm text-[#1A1A1A] rounded"
            >
              Hủy
            </button>
            <button
              onClick={() => onSave()}
              className="py-2 px-[30px] flex items-center gap-2 border-[1px] text-sm text-[#FCFCFD] rounded bg-[#EA4B48]"
            >
              Xác Nhận
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
