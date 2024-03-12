/* eslint-disable no-var */

import { Link } from "react-router-dom";
import Container from "../container/Container";
import LogoWeb from "../../assets/TSX/LogoWeb";
import HeaderTopAdmin from "../HeaderTop/HeaderTopAdmin";

export default function HeaderAdmin() {
  return (
    <>
      <header className="Header">
        <Container>
          <div className="my-1">
            <HeaderTopAdmin />
          </div>
        </Container>
        <div className="border-2 border-[#E6E6E6]" />
        <Container>
          <div className="p-[10px] max-w-max ">
            <Link to="/">
              <LogoWeb />
            </Link>
          </div>
        </Container>
      </header>
    </>
  );
}
