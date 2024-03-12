import { ReactNode } from "react";

type Props = {
  title: ReactNode;
  body: ReactNode;
  onSave: () => void;
  onClose: () => void;
  id: string;
};
export default function DialogAddAdmin(props: Props) {
  const { title, id, body, onClose, onSave } = props;
  return (
    <>
      <dialog id={id} className="modal ">
        <div className="bg-white relative flex flex-col w-[640px] p-[60px] max-xl:w-[650px] max-lg:w-[450px] max-lg:p-[30px] rounded-md">
          <div className="flex flex-col max-lg:gap-4">
            <div className="flex items-center justify-center">
              <h3 className="font-bold text-3xl max-xl:text-[18px] uppercase text-[#FFAAAF]">
                {title}
              </h3>
            </div>
            <div className="mt-5">{body}</div>

            <div className="flex justify-center gap-2 mt-7">
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
        </div>
      </dialog>
    </>
  );
}
