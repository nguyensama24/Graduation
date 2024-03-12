import { Images } from "../../assets/ts";

interface EmptyModel {
  title?: string;
  button?: string;
}

export default function EmptyPage(props: EmptyModel) {
  const { title } = props;
  return (
    <>
      <div className="text-center w-full">
        <div
          role="status"
          className="space-y-8 relative px-3 py-6 animate-pulse my-auto mx-auto md:space-y-0 md:space-x-8 md:flex md:items-center"
        >
          <img className="mx-auto " src={Images.emptyPages} width={"200px"} />
        </div>

        <p className="text-[#3b3b3b] text-xl ">{title}</p>
      </div>
    </>
  );
}
