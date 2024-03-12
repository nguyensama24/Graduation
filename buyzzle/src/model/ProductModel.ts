export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  rate: any;
  pricesale: number;
  sellingPrice: number;
  discount: number;
  soldcount: any;
  quantity: number;
  description: string;
  status: any;
  date: string;
  createdAt: string;
  updatedAt: string;
  categoryID: number;
  ProductImage: ProductImage[];
}
export interface Rate {
  FlashsaleProducts: FlashsaleProduct[];
  currentPage: number;
  // totalRatings: number
  productDetail: ProductDetail;
  rows: Row[];
  averageRating: number;
  Rating: Rating[];
  top8products: Top8product[];
}
export interface Top8product {
  id: number;
  name: string;
  price: number;
  rate?: number;
  pricesale: number;
  sellingPrice: number;
  discount: number;
  soldcount: number;
  quantity: number;
  description: string;
  status: any;
  date: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  categoryID: number;
  subcateId: number;
}
export interface FlashsaleProduct {
  id: number;
  name: string;
  price: number;
  rate: any;
  pricesale: number;
  sellingPrice: number;
  discount: number;
  soldcount: any;
  quantity: number;
  description: string;
  status: any;
  date: string;
  createdAt: string;
  updatedAt: string;
  categoryID: number;
}

export interface Row {
  id: number;
  name: string;
  price: number;
  rate: any;
  pricesale: number;
  sellingPrice: number;
  discount: number;
  soldcount?: number;
  quantity: number;
  description: string;
  status: any;
  date: string;
  createdAt: string;
  updatedAt: string;
  categoryID: number;
  ProductImage: ProductImage[];
  fK_category: FKCategory;
  Rating: Rating[];
}

export interface ProductImage {
  id: number;
  url: string;
  idproduct: number;
}

export interface FKCategory {
  id: number;
  name: string;
  date: string;
  updatedAt: string;
  createdAt: string;
  image: string;
}

export interface Rating {
  id: number;
  idproduct: number;
  iduser: number;
  ratingValue: number;
  comment: string;
  createdAt: string;
  updateAt: string;
  repComment: string;
  product: {
    quantity: number;
    ProductImage: ProductImage[];
  };
  user: {
    name: string;
    UserImage: UserImage[];
  };
  CommentImage: {
    url: string;
  }[];
  admin: admin;
}
export interface admin {
  name: string;
  AdminImage: AdminImage[];
}
export interface AdminImage {
  url: string;
}
export interface User {
  name: string;
  UserImage: UserImage[];
}
export interface UserImage {
  url: string;
}
export interface Product {
  quantity: number;
}

export interface Ratee {
  currentPage?: number;
  perPage?: number;
  totalRatings?: number;
  averageRating?: number;
  Rating?: Rating[];
}
