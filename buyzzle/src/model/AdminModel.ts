export interface ModelAdmin {
  page: number;
  pageSize: number;
  totalPage: number;
  data: AdminModel[];
}

export interface AdminModel {
  id: number;
  email: string;
  password: string;
  username: string;
  name: string;
  sex: boolean;
  phonenumber: string;
  dateofbirth: string;
}
