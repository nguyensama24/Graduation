export interface ProductSuggest {
  mergedProducts: MergedProducts[];
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MergedProducts {
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
  status: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  categoryID: number;
  subcateId: number;
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
  adminId: number;
  ratingValue: number;
  comment: string;
  repComment: string;
  createdAt: string;
  updatedAt: string;
}