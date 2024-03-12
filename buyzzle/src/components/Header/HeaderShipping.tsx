/* eslint-disable no-var */

import HeaderTopShipping from "../HeaderTop/HeaderTopShipping";
import Container from "../container/Container";

export default function HeaderShipping() {
  return (
    <>
      <header className="Header">
        <Container>
          <div className="my-1">
            <HeaderTopShipping />
          </div>
        </Container>
        <div className="border-2 border-[#E6E6E6]" />
      </header>
    </>
  );
}
