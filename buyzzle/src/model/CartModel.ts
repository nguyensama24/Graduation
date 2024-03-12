import { ProductDetail } from "./ProductModel"


export interface CartModel {
    status: boolean,
    data: CartProduct,
}
export interface CartProduct {
    userId: number,
    subtotal: number,
    item: CartItem[]
}
export interface CartItem {
    id?: number,
    productid: number,
    quantity: number,
    cartid: number,
    product: ProductDetail
    total: number
}
