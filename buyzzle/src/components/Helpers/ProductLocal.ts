import { Products } from "../../pages/home/User/filterPage/FiltersPage";

export const getCartFromLocal = () => {
  const localProduct = localStorage.getItem("listProductsLocal");
  const listProductLocal: Products[] = localProduct == null ? [] : JSON.parse(localProduct);
  return listProductLocal;
};

export const setCartLocal = (itemsProductlocal: Products[]) => {
  localStorage.setItem("cart", JSON.stringify(itemsProductlocal));
};
