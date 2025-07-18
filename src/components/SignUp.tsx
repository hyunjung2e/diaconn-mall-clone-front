import React, { useState } from 'react';
import '../css/login.css';
import { register, checkEmailDuplicate } from '../api/Api.ts';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
    address: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = '이름을 입력하세요';
    if (!formData.email) newErrors.email = '이메일을 입력하세요';
    if (!formData.phone) newErrors.phone = '휴대폰 번호를 입력하세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요';
    if (!formData.password2) newErrors.password2 = '비밀번호 확인을 입력하세요';
    if (formData.password !== formData.password2)
      newErrors.password2 = '비밀번호가 일치하지 않습니다.';
    if (!formData.address) newErrors.address = '주소를 입력하세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      const result = await checkEmailDuplicate(formData.email);
      alert(result.message);
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await register(formData);
        console.log('회원가입 성공:', response);
        alert('회원가입이 완료되었습니다!');
      } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="body">
      <div className="login-signup-box">
        <h2
          style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px' }}
        >
          회원가입
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* 이름 */}
            <label style={{ fontSize: '14px', fontWeight: '500' }}>이름</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '450px',
                padding: '8px',
                marginTop: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            {errors.name && (
              <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>
            )}
          </div>
          {/* 이메일 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>
              이메일
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  flex: 8,
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxSizing: 'border-box',
                  height: '40px',
                }}
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                style={{
                  flex: 2,
                  height: '40px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                이메일 중복검사
              </button>
            </div>
            {errors.email && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* 휴대폰번호 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>
              휴대폰번호
            </label>
            <input
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: '450px',
                padding: '8px',
                marginTop: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            {errors.phone && (
              <p style={{ color: 'red', fontSize: '12px' }}>{errors.phone}</p>
            )}
          </div>
          {/* 비밀번호 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '450px',
                padding: '8px',
                marginTop: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            {errors.password && (
              <p style={{ color: 'red', fontSize: '12px' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>
              비밀번호 확인
            </label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              style={{
                width: '450px',
                padding: '8px',
                marginTop: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            {errors.password2 && (
              <p style={{ color: 'red', fontSize: '12px' }}>
                {errors.password2}
              </p>
            )}
          </div>
          {/* 주소 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>주소</label>
            <input
              type="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{
                width: '450px',
                padding: '8px',
                marginTop: '4px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
            {errors.address && (
              <p style={{ color: 'red', fontSize: '12px' }}>{errors.address}</p>
            )}
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              marginBottom: '30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
