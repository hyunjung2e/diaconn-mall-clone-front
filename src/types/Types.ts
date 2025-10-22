export interface Login {
  id: string;
  password: any;
}

export interface LoginUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  addressDetail: string;
}

export interface Product {
  id: number;
  nm: string;
  contentDesc: string;
  price: number;
  imgUrl: string;
  altText: string;
  quantity: number;
}

export type CartItem = {
  id: number;
  nm: string;
  description: string;
  price: number;
  quantity: number;
   count: number; // 서버에서 받은 원본 수량
  selected?: boolean; // 사용자가 UI에서 조작하는 현재 수량
  imgUrl?: string;
  totalPrice: number;
};

// 타입 + API를 한 파일로 합쳐 최소화
export interface OrderSummary {
  id: number;
  totalPrice: number;
  regDate: string; // ISO 8601
  address: string;
  name: string;
  firstProductName: string;
  firstProductImgUrl: string;
  totalProductCount: number;
  addressDetail?: string;
  status?: string; // 주문 상태 (예: 결제완료, 배송준비중, 배송중, 배송완료 등)
}

export interface OrderDetailItem {
  productName: string;
  productImgUrl: string;
  productPrice: number;
  productQuantity: number;
  // 서버 미제공 -> 프론트 계산
  productTotalPrice?: number;
}

export interface OrderDetail {
  id: number;
  totalPrice: number;
  regDate: string;
  address: string;
  addressDetail?: string;
  name?: string;
  phone?: string;
  memo?: string;
  orderDetails: OrderDetailItem[];
}

export const formatDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\. /g, '.')
    .replace(/\.$/, '');

export const formatPrice = (n: number) => `${n.toLocaleString()}원`;

export const formatProductCount = (first: string, total: number) =>
  total <= 1 ? first : `${first} 외 ${total - 1}건`;

// 날짜를 연월로 그룹핑하기 위한 포맷 함수 (예: "2025년 10월")
export const formatYearMonth = (iso: string) => {
  const date = new Date(iso);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

