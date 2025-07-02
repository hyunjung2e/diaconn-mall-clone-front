export interface Login {
  id: string;
  password: any;
}

export interface LoginUser {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  nm: string;
  desc: string;
  price: number;
  imgUrl: string;
  altText: string;
}
