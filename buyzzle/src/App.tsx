import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRouteElements from "./hooks/Router/useRouterElement";
import "./App.css";
import "react-responsive-pagination/themes/classic.css";

function App() {
   const routeElements = useRouteElements();

   return (
      <>
         <ToastContainer />
         <div>{routeElements}</div>
      </>
   );
}

export default App;
