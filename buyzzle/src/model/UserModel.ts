export interface ModelUser {
  page: number;
  pageSize: number;
  totalPage: number;
  data: UserModel[];
}

export interface UserModel {
  id: number;
  email: string;
  username: string;
  password: string;
  verify: boolean;
  name: string;
  phonenumber: string;
  image: string;
  createdAt: string;
  updateAt: string;
  dateOfBirth: string;
  sex: boolean;
  address: string;
  addresstype: string;
  specificaddress: string;
  refresh_token: string;
  forgotpassword_token?: string;
  role: any;
  deletedAt: any;
  Order: Order[];
  totalAmount: number;
}
export interface Order {
  amountTotal: number;
}
