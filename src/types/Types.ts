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
