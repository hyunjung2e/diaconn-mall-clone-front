export interface Login {
  id: string;
  password: any;
}

export interface Banner {
  id: number;
  imageUrl: string;
  altText: string;
}

export interface LoginUser {
  id: number;
  name: string;
  email: string;
}

export interface ProductImage {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  altText: string;
}
