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
  desc: string;
  price: number;
  imgUrl: string;
  altText: string;
}

export type CartItem = {
  id: number;
  description: string;
  price: number;
  quantity: number;
  selected?: boolean;
  imgUrl?: string;
}

