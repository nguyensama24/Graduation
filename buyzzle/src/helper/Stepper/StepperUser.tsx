type StatusOrder = {
  status: number;
  deletedAt: Date;
};

export default function StepperPage(props: StatusOrder) {
  const { status, deletedAt } = props;

  return (
    <>
      {status != 0 ? (
        <>
          <ol className="flex items-center w-full px-20">
            <li
              className={`flex w-full items-center  after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block ${
                status >= 3
                  ? `dark:after:border-[#EA4B48]`
                  : `dark:after:border-gray-200`
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                  status >= 2
                    ? `dark:bg-[#EA4B48] bg-gray-100`
                    : `border-dashed border-2 border-[#EA4B48]`
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${
                    status >= 2 ? `dark:text-gray-100` : `dark:text-[#EA4B48]`
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
              </span>
            </li>

            <li
              className={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block ${
                status >= 5
                  ? `dark:after:border-[#EA4B48]`
                  : `dark:after:border-gray-200`
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                  status >= 3
                    ? `dark:bg-[#EA4B48] bg-gray-100`
                    : `border-dashed border-2 border-[#EA4B48]`
                }`}
              >
                <svg
                  className={`w-4 h-4 text-red-900 lg:w-5 lg:h-5 ${
                    status >= 3 ? `dark:text-gray-100` : `dark:text-[#EA4B48]`
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                </svg>
              </span>
            </li>

            <li
              className={`flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block ${
                status >= 6
                  ? `dark:after:border-[#EA4B48]`
                  : `dark:after:border-gray-200`
              }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0  ${
                  status >= 5
                    ? `dark:bg-[#EA4B48] bg-gray-100`
                    : `border-dashed border-2 border-[#EA4B48]`
                }`}
              >
                <svg
                  className={`w-4 h-4 text-gray-500 lg:w-5 lg:h-5 ${
                    status >= 5 ? `dark:text-gray-100` : `dark:text-[#EA4B48]`
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  fill="currentColor"
                >
                  <path d="M112 0C85.5 0 64 21.5 64 48V96H16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 272c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 48c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 240c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 208c8.8 0 16 7.2 16 16s-7.2 16-16 16H64V416c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H112zM544 237.3V256H416V160h50.7L544 237.3zM160 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm272 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z" />
                </svg>
              </span>
            </li>

            <li className="flex items-center">
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${
                  status >= 6
                    ? `dark:bg-[#EA4B48] bg-gray-100`
                    : ` border-dashed border-2 border-[#EA4B48]`
                }`}
              >
                <svg
                  className={`w-4 h-4  lg:w-5 lg:h-5 ${
                    status >= 6 ? `dark:text-gray-100` : `dark:text-[#EA4B48]`
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                </svg>
              </span>
            </li>
          </ol>
          <div className="w-[100%] mt-3 flex">
            <p
              className={`${
                status >= 2 ? `text-[#EA4B48]` : `text-[#e0e0e0]`
              } w-[23%] text-center`}
            >
              Đặt hàng
            </p>
            <p
              className={`${
                status >= 3 ? `text-[#EA4B48]` : `text-[#e0e0e0]`
              } w-[27%] text-center`}
            >
              Giao cho ĐVVC
            </p>
            <p
              className={`${
                status >= 5 ? `text-[#EA4B48]` : `text-[#e0e0e0]`
              } w-[25%] text-center`}
            >
              Đang giao hàng
            </p>
            <p
              className={`${
                status == 6 ? `text-[#EA4B48]` : `text-[#e0e0e0]`
              } w-[25%] text-center`}
            >
              Giao hàng thành công
            </p>
          </div>
        </>
      ) : (
        <>
          <ol className="flex items-center w-full px-20">
            <li
              className={`flex w-full items-center  after:content-[''] after:w-full after:h-1 after:border-b
               after:border-blue-100 after:border-4 after:inline-block ${
                 status == 0
                   ? `dark:after:border-[#EA4B48]`
                   : `dark:after:border-gray-200`
               }`}
            >
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                  status == 0
                    ? `dark:bg-[#EA4B48] bg-gray-100`
                    : `border-dashed border-2 border-[#EA4B48]`
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${
                    status == 0 ? `dark:text-gray-100` : `dark:text-[#EA4B48]`
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
              </span>
            </li>

            <li className="flex items-center">
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 ${
                  deletedAt != null
                    ? `dark:bg-[#EA4B48] bg-gray-100`
                    : ` border-dashed border-2 border-[#EA4B48]`
                }`}
              >
                <svg
                  className={`w-4 h-4  lg:w-5 lg:h-5 ${
                    deletedAt != null
                      ? `dark:text-gray-100`
                      : `dark:text-[#EA4B48]`
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                </svg>
              </span>
            </li>
          </ol>
          <div className=" mt-3 grid grid-cols-6">
            <p
              className={`${
                status == 0 ? `text-[#EA4B48]` : `text-[#e0e0e0]`
              } col-span-1 text-right`}
            >
              Yêu cầu hủy đơn
            </p>
            <p
              className={`${
                deletedAt != null ? `text-[#EA4B48]` : `text-[#e0e0e0]`
              } col-span-5 text-right`}
            >
              Yêu cầu hủy đơn thành công
            </p>
          </div>
        </>
      )}
    </>
  );
}
