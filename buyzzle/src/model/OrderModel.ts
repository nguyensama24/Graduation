export interface OrderPanigation {
  data: OrderModel[];
  page: number;
  pageSize: number;
  totalPage: number;
  totalOrder: number;
  statusCounts: StatusCounts;
  totalOrderShipping: number;
}
export interface StatusCounts {
  orderStatus2: number;
  orderStatus5: number;
  orderStatus0: number;
  orderStatus1: number;
  orderStatus3: number;
  orderStatus4: number;
  orderStatus6: number;
}
export interface OrderModel {
  id: number;
  iduser: number;
  subtotal: number;
  shipping: number;
  discount: number;
  amountTotal: number;
  paymentMethod: string;
  createdAt: Date;
  deletedAt: Date;
  status: StatusOrder;
  _paymentStatus: string;
  invoice: string;
  note: string;
  name: string;
  address: string;
  phoneNumber: number;
  OrderDetail: OrderItems[];
  User:User;
  
}
export interface OrderItems {
  id?: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
  ratingAt?: Date;
}

export enum StatusOrder {
  Cancel,
  Comfirm,
  Ordered,
  WaitingCourier, // Giao cho Đơn vị Vận tải (ĐVVT)
  recievedCourier,
  Shipping, //Đang trên đường giao hàng
  Succed, // Giao hàng thành công
}

export interface UpdateQuantityModal {
  productId: number,
  quantity: number
}
export interface User {
  name: string;
  username: string;
  UserImage: UserImage[];
}

export interface UserImage {
  // name: string;
  url: string;
 
}