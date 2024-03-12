import { useState } from "react";
import { ButtonSuggest } from "../SitebarFilter";

type Props = {
  btnSug: ButtonSuggest;
};

const ButtonSuggestt = (props: Props) => {
  const [otherkeywords, setOtherkeywords] = useState("#F2F2F2");
  const [textColor, setTextColor] = useState("black");

  const Clicked = () => {
    setTextColor("#FFFFFF");
    setOtherkeywords("#EA4B48");
  };
  return (
    <>
      { }
      <button
        type="button"
        // style={
        //   Clicked()
        //     ? { backgroundColor: otherkeywords, color: textColor }
        //     : { backgroundColor: otherkeywords, color: textColor }
        // }
        className="transition duration-200 hover:ease-in bg-[#F2F2F2] hover:bg-[#EA4B48] 
        focus:outline-none  font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 
        hover:text-[#FFFFFF]"
        onClick={() => {
          Clicked();
        }} >
        {props.btnSug.name}
      </button>
    </>
  );
};

export default ButtonSuggestt;
