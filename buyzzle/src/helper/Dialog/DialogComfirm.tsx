import CloseComfirm from "../../assets/TSX/CloseComfirm";
import ComfirmIcon from "../../assets/TSX/ComfirmIcon";
import DeleteComfirm from "../../pages/home/admin/assets/TSX/DeleteComfirm";

type Props = {
  title?: string;
  id?: string;
  desc?: string;
  onClose: () => void;
  onSave: () => void;
};

export default function DialogComfirm(props: Props) {
  const { desc, id, onClose, onSave, title } = props;
  return (
    <>
      <dialog id={id} className="modal">
        <div className="modal-box">
          <div className="pb-4 mb-5 ">
            <div className="flex-col flex gap-2 justify-center items-center">
              <ComfirmIcon />
              <h1 className="text-[#EA4B48] text-xl font-lg font-semibold tracking-normal leading-tight max-[870px]:text-xs">
                {title}
              </h1>
              <p className=" text-center text-sm font-normal text-[#4C4C4C]">
                Bạn có chắc chắn muốn xóa {desc} này không, sau khi xóa thì
                không thể khôi phục lại{" "}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={() => onClose()}
              className="py-2 px-20 flex items-center gap-2 border-[1px] border-[#EA4B48] text-sm text-[#1A1A1A] rounded"
            >
              <CloseComfirm />
              Hủy
            </button>
            <button
              onClick={() => onSave()}
              className="py-2 px-[81px] flex items-center gap-2 border-[1px] text-sm text-[#FCFCFD] rounded bg-[#EA4B48]"
            >
              <DeleteComfirm />
              Xóa
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
