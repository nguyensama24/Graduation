export interface Voucher {
  page: number;
  pageSize: number;
  totalPage: number;
  data: VoucherModel[];
}

export interface VoucherModel {
  id: number;
  code: string;
  quantity: number;
  startDay: Date;
  endDay: Date;
  discount: number;
  used?: number,
  savedBy?: savedBy[];
}

interface savedBy {
  used?: boolean,
}
