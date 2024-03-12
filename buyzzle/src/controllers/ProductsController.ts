import axios from "axios";
import { ProductSuggest } from "../model/ProductsSuggest";
import { FormValues } from "../pages/home/admin/EditProduct/EditProductMap";
import { Products } from "../pages/home/User/filterPage/FiltersPage";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_URL || "",
};

export interface ModelRemoveProducts {
  id?: number;
  page?: number;
  pageSize?: number;
}

class ProductController {
  getList = async (
    nameCate: string
    // id: number
  ): Promise<Products[]> => {
    return await axios
      .get(`${appConfig.apiUrl}/allproducts?categoryName=${nameCate}`)
      .then((res) => {
        return res.data as Products[];
      });
  };
  getProductWithIdCate = async (id: number): Promise<Products[]> => {
    return await axios
      .get(`${appConfig.apiUrl}/allproducts?categoryId=${id}`)
      .then((res) => {
        return res.data as Products[];
      });
  };
  getNameCate = async (
    nameCate: string,
    min?: number,
    max?: number
  ): Promise<Products[]> => {
    return await axios
      .get(
        `${appConfig.apiUrl}/allproducts?categoryName=${nameCate}&minPrice=${min}&maxPrice=${max}`
      )
      .then((res) => {
        return res.data as Products[];
      });
  };
  getAllProducts = async (): Promise<Products[]> => {
    return await axios.get(`${appConfig.apiUrl}/allproducts`).then((res) => {
      return res.data as Products[];
    });
  };
  getAllProductsSearch = async (
    name: string | undefined
  ): Promise<Products[]> => {
    return await axios
      .get(`${appConfig.apiUrl}/allproducts?keyword=${name}`)
      .then((res) => {
        return res.data as Products[];
      });
  };
  getSearchAndPaginationProduct = async (
    name?: string | undefined,
    page?: number,
    pageSize?: number
  ): Promise<Products[]> => {
    return await axios
      .get(
        `${appConfig.apiUrl}/allproducts?keyword=${name}&page=${page}&pageSize=${pageSize}`
      )
      .then((res) => {
        return res.data.rows as Products[];
      });
  };
  getSortProductbyPriceAndDateCreate = async (options: {
    key?: string;
    categoryName?: string;
    keyword?: string;
  }): Promise<Products[]> => {
    const { key, categoryName, keyword } = options;
    const queryParams = new URLSearchParams({
      sortByPrice: key || "",
      sortByDateCreate: key || "",
      sortBySoldCount: key || "",
      categoryName: categoryName || "",
      keyword: keyword || "",
    });
    return await axios
      .get(`${appConfig.apiUrl}/allproducts?${queryParams}`)
      .then((res) => {
        return res.data as Products[];
      });
  };
  // getSortProductbyDateCreate = async (
  //   key: string,
  //   nameCate: string
  // ): Promise<Products[]> => {
  //   return await axios
  //     .get(
  //       `${appConfig.apiUrl}/allproducts?sortByDateCreate=${key}&categoryName=${nameCate}`
  //     )
  //     .then((res) => {
  //       return res.data as Products[];
  //     });
  // };

  getFilterProductWithinRangeIDCategory = async (options: {
    minPrice?: number;
    maxPrice?: number;
    categoryName?: string;
    keyword?: string;
  }): Promise<Products[]> => {
    const { minPrice, maxPrice, categoryName, keyword } = options;

    const queryParams = new URLSearchParams({
      minPrice: minPrice?.toString() || "",
      maxPrice: maxPrice?.toString() || "",
      categoryName: categoryName || "",
      keyword: keyword || "",
    });

    return await axios
      .get(`${appConfig.apiUrl}/allproducts?${queryParams}`)
      .then((res) => {
        return res.data as Products[];
      });
  };
  getFilterProductbyPriceAndQuantityAndPurchaseWithinRangePagination = async (
    minPrice?: number,
    maxPrice?: number,
    page?: number,
    pageSize?: number,
    minQuantity?: number,
    maxQuantity?: number,
    minPurchase?: number,
    maxPurchase?: number,
    name?: string | undefined
  ): Promise<Products[]> => {
    return await axios
      .get(
        `${appConfig.apiUrl}/allproducts?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&pageSize=${pageSize}&minQuantity=${minQuantity}&maxQuantity=${maxQuantity}&minPurchase=${minPurchase}&maxPurchase=${maxPurchase}&keyword=${name}`
      )
      .then((res) => {
        return res.data as Products[];
      });
  };
  remove = async (data: ModelRemoveProducts) => {
    return await axios.post(`${appConfig.apiUrl}/deleteproduct`, data);
  };
  update = async (id: number, data: FormValues) => {
    return await axios.put(`${appConfig.apiUrl}/updateproduct/${id}`, data);
  };
  getProductSuggest = async (id: number): Promise<Products[]> => {
    return await axios
      .get(`${appConfig.apiUrl}/recommendedproducts/${id}`)
      .then((res) => {
        return res.data as Products[];
      });
  };
  getProductSoldOut = async (soldOut: string): Promise<Products[]> => {
    return await axios
      .get(`${appConfig.apiUrl}/allproducts/${soldOut}`)
      .then((res) => {
        return res.data as Products[];
      });
  };
  getProductAvailability = async (
    availability: string
  ): Promise<Products[]> => {
    return await axios
      .get(`${appConfig.apiUrl}/allproducts/${availability}`)
      .then((res) => {
        return res.data as Products[];
      });
  };
  getProductInStockAndSoldOut = async (
    inStockOrsoldOut?: string
  ): Promise<Products[]> => {
    return await axios
      .get(
        `${appConfig.apiUrl}/allproducts?availabilityType=${inStockOrsoldOut}`
      )
      .then((res) => {
        return res.data as Products[];
      });
  };

  getProductWhereRatting = async (rate: number): Promise<Products[]> => {
    return await axios
      .get(`${appConfig.apiUrl}/allproducts?rating=${rate}`)
      .then((res) => {
        return res.data as Products[];
      });
  };

  getProductSuggestHome = async (
    page: number,
    pageSize: number
  ): Promise<ProductSuggest> => {
    return await axios
      .post(
        `${appConfig.apiUrl}/getproductbysex`,
        {
          page: page,
          pageSize: pageSize,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        return res.data as ProductSuggest;
      });
  };
}

export const productController = new ProductController();
