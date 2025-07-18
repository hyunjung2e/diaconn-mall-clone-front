import React, { useState, useEffect } from 'react';
import '../css/login.css';
import { getLoggedInUser, updateUser } from '../api/Api.ts';
import { LoginUser } from '../types/Types.ts';

export default function Mypage() {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    email: '',
    phone: user?.phone || '',
    password: '',
    password2: '',
    address: user?.address || '',
    addressDetail: user?.addressDetail || '',
  });

  // 로그인한 유저 정보 가져오기
  useEffect(() => {
    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  // user가 변경되었을 때 formData 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        phone: user.phone || '',
        password: '',
        password2: '',
        address: user.address || '',
        addressDetail: user.addressDetail || '',
      });
    }
  }, [user]);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 유효성 검사
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.phone) newErrors.phone = '휴대폰 번호를 입력하세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요';
    if (!formData.password2) newErrors.password2 = '비밀번호 확인을 입력하세요';
    if (formData.password !== formData.password2)
      newErrors.password2 = '비밀번호가 일치하지 않습니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원정보 수정 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const updateData = {
          email: user!.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
          addressDetail: formData.addressDetail,
        };
        await updateUser(updateData);

        // 수정 후 최신 유저 정보 다시 불러오기
        const updatedUser = await getLoggedInUser();
        setUser(updatedUser);
        alert('회원정보가 성공적으로 수정되었습니다!');
      } catch (error) {
        alert('회원정보 수정중 오류가 발생했습니다.');
      }
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
              autoComplete="tel"
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
              placeholder="010-1234-5678"
              value={formData.phone}
              className="mypage-input"
              type="tel"
              name="phone"
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phone && <p className="mypage-errors">{errors.phone}</p>}
          </div>

          {/* 비밀번호(필수) */}
          <div className="mypage-row">
            <label className="mypage-label">비밀번호</label>
            <input
              placeholder="비밀번호를 입력하세요"
              className="mypage-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <p className="mypage-errors">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인(필수) */}
          <div className="mypage-row">
            <label className="mypage-label">비밀번호 확인</label>
            <input
              placeholder="비밀번호를 입력하세요"
              className="mypage-input"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password2 && <p className="mypage-errors">{errors.password2}</p>}
          </div>

          {/* 주소(선택) */}
          <div className="mypage-row">
            <label className="mypage-label">주소</label>
            <input
              placeholder="주소를 입력하세요"
              className="mypage-input"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="mypage-errors">{errors.address}</p>}
          </div>

          {/* 주소상세(선택) */}
          <div className="mypage-row">
            <input
              placeholder="상세주소를 입력하세요"
              className="mypage-input"
              type="text"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
            />
            {errors.address2 && <p className="mypage-errors">{errors.address2}</p>}
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
