import { Row } from "./ProductModel";

export type CategoryModal = {
    id: number;
    name: string;
    image: string;
    subCategories?: subCate[]
};

export type subCate = {
    id: number;
    categoryid: number;
    name: string;
    productId: Row[]
};