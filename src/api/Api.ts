import { Product } from '../types/Types.ts';
import { CartItem } from '../types/Types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + '/api';

// ***** 유저 관련 *****

// 회원가입
export const register = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// 이메일 중복 체크
export const checkEmailDuplicate = async (email: string) => {
  const response = await fetch(
    `${API_BASE_URL}/user/checkemail?email=${encodeURIComponent(email)}`
  );
  return await response.json();
};

// 로그인
export const login = async (loginData: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData),
    credentials: 'include', // 쿠키 포함 옵션
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '로그인 실패');
  }

  return data;
};

// 로그인된 사용자 정보 조회
export const getLoggedInUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/userCheck`, {
    method: 'GET',
    headers: { 'Cache-control': 'no-store', Pragma: 'no-cache' },
    credentials: 'include', // 쿠키 포함 (세션 유지용)
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

// 마이페이지 회원 정보 수정
export const updateUser = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/user/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    credentials: 'include', // 쿠키 포함 (세션 유지용)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '회원 정보 수정 실패');
  }
  return response.json();
};

// ***** 메인 & 상품 관련 *****

// 메인-배너 가져오기
export const getBanners = async () => {
  const response = await fetch(`${API_BASE_URL}/product/banners`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '배너 목록을 가져오는 데 실패했습니다.');
  }

  return response.json();
};

// 메인-상품 이미지 가져오기
export const fetchProductsInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/product/products`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '상품 이미지 목록을 가져오는 데 실패했습니다.');
  }
  return response.json();
};

// 메인-카테고리별 상품 이미지 가져오기
export const fetchCategoryProducts = async (categoryId: string) => {
  const response = await fetch(`${API_BASE_URL}/product/products/${categoryId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '카테고리별 상품 목록을 가져오는 데 실패했습니다.');
  }
  return response.json();
};

// 상품 상세 조회
export const getProductDetail = async (productId: number) => {
  const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '상품 정보를 불러오는 데 실패했습니다.');
  }

  return response.json();
};

// 상품 검색
export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/product/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('검색 실패');
  return response.json();
};

// 장바구니 목록 가져오기
export const getCartItems = async (): Promise<CartItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/cart`);
  if (!response.ok) throw new Error('장바구니 불러오기 실패');
  return response.json();
};