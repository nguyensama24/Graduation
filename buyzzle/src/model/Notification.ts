export interface NotificationModel {
  allNotification: AllNotification[];
  countNotification: number;
  count: number;
}

export interface AllNotification {
  id: number;
  orderId: number;
  message: string;
  date: string;
  status: number;
  seen: boolean;
  fk_order: FkOrder;
}

export interface FkOrder {
  id: number;
  userId: number;
  name: string;
  address?: string;
  phoneNumber?: string;
  status: number;
  note: string;
  invoice: string;
  subtotal: number;
  shipping: number;
  discount: number;
  amountTotal: number;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: string;
  User: User;
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
