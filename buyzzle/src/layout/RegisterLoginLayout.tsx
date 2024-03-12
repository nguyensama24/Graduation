import Footer from "../components/Footer/Footer";
import HeaderTopUser from "../components/HeaderTop/HeaderTopUser";

interface Props {
  children?: React.ReactNode;
}
function RegisterLoginLayout({ children }: Props) {
  return (
    <div className="inline-flex flex-col h-screen w-full">
      <HeaderTopUser />
      {children}
      <Footer />
    </div>
  );
}

export default RegisterLoginLayout;
