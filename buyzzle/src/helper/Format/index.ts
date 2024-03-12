import moment from 'moment';
export const numberFormat = (number: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)


export const currentDate = (date: string) => {
  return moment(date).format('MMMM Do YYYY');
}

export const roundedNumber = (number: number) => Math.round(number);

export const formatSoldCount = (soldcount: number) => {
  if (soldcount === 0) {
    return ''; // Trả về chuỗi rỗng khi soldcount bằng 0
  } else if (soldcount >= 1000) {
    // Số đã đạt 1000 hoặc hơn
    const kCount = Math.floor(soldcount / 1000);
    return kCount + 'k';
  }
  return soldcount.toString(); // Trả về số như bình thường
}

export const formatDate = (date: Date) => {
  return moment(date).format('DD/MM');
}

export const formatDateYYYY = (date: Date) => {
  return moment(date).format('MMMM Do YYYY');
}
