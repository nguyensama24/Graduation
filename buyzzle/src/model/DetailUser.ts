export interface UserDetail {
  id: number;
  name: string;
  email: string;
  phonenumber: string;
  sex: boolean;
  dateOfBirth: any;
  createdAt: Date;
  image: any;
  Order: Order[];
  UserImage: any[];
  allUsers: AllUser[];
  totalAmount: number;
}

export interface Order {
  amountTotal: number;
}

export interface AllUser {
  id: number;
  email: string;
  username: string;
  password: string;
  verify: boolean;
  name: string;
  phonenumber: string;
  image: any;
  createdAt: string;
  updateAt: string;
  dateOfBirth?: string;
  sex?: boolean;
  address?: string;
  addresstype?: string;
  specificaddress?: string;
  refresh_token?: string;
  forgotpassword_token?: string;
  role: any;
  deletedAt: any;
}
