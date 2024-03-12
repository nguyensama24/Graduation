type handleClick = {
  status: number;
  comfirm: (status: number) => void;
  deletedAt: Date;
  confirmCancelOrder: () => void;
};

function StepperAdmin(props: handleClick) {
  const { comfirm, status, deletedAt, confirmCancelOrder } = props;

  return (
    <>
      {status != 0 ? (
        <ul className="steps w-full">
          <li
            data-content={`${status >= 2 ? `✓` : `1`}`}
            className={`step ${status >= 2 ? `step-neutral` : ``}`}
          >
            <p className={` ${status >= 2 ? `inherit` : `text-[#9c9c9c]`}`}>
              Đặt hàng
            </p>
            <div className="group inline-block mt-2">
              <button
                className={`btn btn-outline btn-accent btn-sm group-hover:bg-[#dbfffb] group-hover:text-[#1DCDBC]  ${
                  status != 1 ? `hidden` : ``
                }`}
                onClick={() => comfirm(2)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#1DCDBC"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p className="text-xs">Xác nhận</p>
              </button>
            </div>
          </li>
          {/* ------------- */}
          <li
            data-content={`${status >= 3 ? `✓` : `2`}`}
            className={`step ${status >= 3 ? `step-neutral` : ``}`}
          >
            <p className={` ${status >= 3 ? `inherit` : `text-[#9c9c9c]`}`}>
              Giao cho ĐVVC
            </p>
            <div className="group inline-block mt-2">
              <button
                className={`btn btn-outline btn-accent btn-sm group-hover:bg-[#dbfffb] group-hover:text-[#1DCDBC]  ${
                  status != 2 ? `hidden` : ``
                }`}
                onClick={() => comfirm(3)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#1DCDBC"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p className="text-xs">Xác nhận</p>
              </button>
            </div>
          </li>
          {/* ---------------- */}
          <li
            data-content={`${status >= 5 ? `✓` : `3`}`}
            className={`step ${status >= 5 ? `step-neutral` : ``} `}
          >
            <p className={` ${status >= 5 ? `inherit` : `text-[#9c9c9c]`}`}>
              Đang giao hàng
            </p>
          </li>
          <li
            data-content={`${status >= 6 ? `✓` : `4`}`}
            className={`step ${status == 6 ? `step-neutral` : ``} `}
          >
            <p className={` ${status == 6 ? `inherit` : `text-[#9c9c9c]`}`}>
              Giao hàng thành công
            </p>
          </li>
        </ul>
      ) : (
        <ul className="steps w-full">
          <li
            data-content={`${status == 0 ? `✓` : `1`}`}
            className={`step ${status == 0 ? `step-neutral` : ``}`}
          >
            <p className={` ${status == 0 ? `inherit` : `text-[#9c9c9c]`}`}>
              Yêu cầu hủy đơn hàng
            </p>
            <div className="group inline-block mt-2"></div>
          </li>
          {/* ------------- */}
          <li
            data-content={`${deletedAt != null ? `✓` : `2`}`}
            className={`step ${deletedAt != null ? `step-neutral` : ``} `}
          >
            <p
              className={` ${deletedAt != null ? `inherit` : `text-[#9c9c9c]`}`}
            >
              Xác nhận hủy đơn hàng
            </p>
            <button
              className={`btn btn-outline btn-sm text-xs hover:bg-[#ffeded]
              text-[#EA4B48] hover:text-[#EA4B48] hover:border-[#EA4B48]
              ${deletedAt != null ? "hidden" : ""}
              `}
              onClick={confirmCancelOrder}
            >
              Hủy đơn
            </button>
          </li>
        </ul>
      )}
    </>
  );
}

export default StepperAdmin;
