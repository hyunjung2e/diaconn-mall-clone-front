const API_BASE_URL = 'http://localhost:8080/api';

export const register = async (userData: any) => {
  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const login = async (loginData: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response.json();
  }

  return response.json();
};

export const checkEmailDuplicate = async (email: string) => {
  const response = await fetch(
    `${API_BASE_URL}/user/checkemail?email=${encodeURIComponent(email)}`
  );
  return await response.json(); // { isDuplicate: boolean, message: string }
};
