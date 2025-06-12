const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + '/api';

// 회원가입
export const register = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
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

// 이메일 중복 체크
export const checkEmailDuplicate = async (email: string) => {
  const response = await fetch(
    `${API_BASE_URL}/user/checkemail?email=${encodeURIComponent(email)}`
  );
  return await response.json();
};

// 배너 가져오기
export const getBanners = async () => {
  const response = await fetch(`${API_BASE_URL}/main`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || '배너 목록을 가져오는 데 실패했습니다.'
    );
  }

  return response.json();
};

// 로그인된 사용자 정보 조회
export const getLoggedInUser = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/userCheck`, {
    method: 'GET',
    credentials: 'include', // 쿠키 포함 (세션 유지용)
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

// 상품 검색
export interface Product {
  id: number;
  nm: string;
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await fetch(
    `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) throw new Error('검색 실패');
  return response.json();
};
