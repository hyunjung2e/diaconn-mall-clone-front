import React, { useState, useEffect } from 'react';
import '../css/login.css';
import { getLoggedInUser } from '../api/Api.ts';
import { LoginUser } from '../types/Types.ts';

export default function Mypage() {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    password2: '',
    address: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<LoginUser | null>(null);

  // 로그인한 유저 정보 가져오기
  useEffect(() => {
    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 유효성 검사
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.phone) newErrors.phone = '휴대폰 번호를 입력하세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요';
    if (!formData.password2) newErrors.password2 = '비밀번호가 일치하지 않습니다';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('회원정보 수정 데이터:', formData);
    }
  };

  return (
    <div className="body">
      <div className="login-signup-box">
        <h2 className="mypage-title">마이페이지</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          {/* 이름 */}
          <div className="mypage-row">
            <label className="mypage-label">이름</label>
            <input
              className="mypage-disabled-input"
              value={user?.name || ''}
              readOnly
              onChange={handleChange}
            />
            {errors.name && <p>{errors.name}</p>}
          </div>

          {/* 이메일 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="mypage-label">이메일</label>
            <input
              className="mypage-disabled-input"
              value={user?.email || ''}
              readOnly
              onChange={handleChange}
            />
            {errors.email && <p>{errors.email}</p>}
          </div>

          {/* 휴대폰번호(필수) */}
          <div className="mypage-row">
            <label className="mypage-label">휴대폰번호</label>
            <input
              className="mypage-input"
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="mypage-errors">{errors.phone}</p>}
          </div>

          {/* 비밀번호(필수) */}
          <div className="mypage-row">
            <label className="mypage-label">비밀번호</label>
            <input
              className="mypage-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="mypage-errors">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인(필수) */}
          <div className="mypage-row">
            <label className="mypage-label">비밀번호 확인</label>
            <input
              className="mypage-input"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
            />
            {errors.password && <p className="mypage-errors">{errors.password}</p>}
          </div>

          {/* 주소(선택) */}
          <div className="mypage-row">
            <label className="mypage-label">주소</label>
            <input
              className="mypage-input"
              type="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="mypage-errors">{errors.address}</p>}
          </div>

          {/* 수정 버튼 */}
          <button className="submit-button" type="submit">
            회원정보 수정
          </button>
        </form>
      </div>
    </div>
  );
}
