import { ReactNode } from "react";

type Props = {
    title: ReactNode;
    onClose: () => void;
    id: string;
};
export default function WarningQuantityCart(props: Props) {
    const { title, id, onClose, } = props;

    return (
        <>
            <dialog id={id} className="modal">
                <div className="bg-white max-w-[500px] relative flex flex-col px-[30px] py-[20px] max-xl:w-[650px] max-lg:w-[450px] max-lg:p-[30px] rounded-md">
                    <div className="flex flex-col gap-4 max-lg:gap-4">
                        <div className="flex items-center">
                            <h3 className="font-medium text-sm max-xl:text-[18px] text-[#4C4C4C]">
                                {title}
                            </h3>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={() => onClose()}
                                className="py-1 text-white px-8 bg-[#EA4B48] border-[1px] border-[#EA4B48] text-sm rounded"
                            >
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
}