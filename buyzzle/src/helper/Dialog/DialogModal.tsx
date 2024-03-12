import { ReactNode } from "react";
import LogoCate from "../../pages/home/admin/assets/TSX/logoCateAdmin";

type Props = {
  title: ReactNode;
  body: ReactNode;
  onSave: () => void;
  onClose: () => void;
  id: string;
};
export default function DialogModal(props: Props) {
  const { title, id, body, onClose, onSave } = props;

  return (
    <>
      <dialog id={id} className="modal ">
        <div className="bg-white relative flex flex-col p-[60px] max-xl:w-[650px] max-lg:w-[450px] max-lg:p-[30px] rounded-md">
          <div className="flex flex-col max-lg:gap-4">
            <div className="flex items-center">
              <LogoCate />
              <h3 className="font-bold text-2xl max-xl:text-[18px] uppercase text-[#4C4C4C]">
                {title}
              </h3>
            </div>
            <div className="mt-5">{body}</div>

            <div className="flex justify-end gap-2 mt-7">
              <button
                onClick={() => onClose()}
                className="py-2 px-14 border-[1px] border-[#EA4B48] text-sm text-[#1A1A1A] rounded"
              >
                Hủy
              </button>
              <button
                tabIndex={0}
                onClick={() => {
                  onSave();
                }}
                className="py-2 px-11 border-[1px] text-sm text-[#FCFCFD] rounded bg-[#EA4B48]"
              >
                Xác Nhận
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
