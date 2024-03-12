export interface Statistics {
  //thong ke doanh thu va so luong san pham da duoc ban trong khoang thoi gian minh nhap vo
  totalRevenueInRange: number;
  totalQuantitySoldInRange: number;
  purchaseOrShoppingInRange: number;
  revenuePercentageInRange: number;
  percentageQuantitySold: number;
  hotProductsInRange: HotProductsInRange[];
  initialDataChartLine: InitialDataChartLine;
  initialDataChartBar: InitialDataChartBar;
}
export interface HotProductsInRange {
  _sum: sumQuantity;
  name: string;
  productId: number;
  total: number;
  id: number;
  quantity: number;
  price: number;
}

export interface sumQuantity {
  quantity: number;
}

export interface InitialDataChartLine {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
}

export interface InitialDataChartBar {
  labels: string[];
  datasets: Dataset2[];
}

export interface Dataset2 {
  label: string;
  data: number[];
}
