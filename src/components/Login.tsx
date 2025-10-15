import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, login } from '../api/Api.ts';
import '../css/login.css';
import { getLoggedInUser } from '../api/Api.ts';
import Header from './Common.tsx';
import { LoginUser } from '../types/Types.ts';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState<LoginUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPwForgotModalOpen, setIsPwForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, [categoryId]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  const handleLogin = async () => {
    try {
      const data = await login({ email, password });

      alert(`${data.user.name}님 환영합니다!🤗`);
      setEmail('');
      setPassword('');
      navigate('/');
    } catch (error: any) {
      alert(error.message || '로그인 실패! 이메일과 비밀번호를 확인해주세요.');
      console.error(error);
    }
  };
  // 비밀번호 찾기
  const handleOpenPwForgot = () => {
    setIsPwForgotModalOpen(true);
  };
  const handleClosePwForgot = () => {
    if (isSending) return;
    setIsPwForgotModalOpen(false);
    setForgotEmail('');
    setForgotPhone('');
  };
  const handleSendTempPwPassword = async () => {
    if (!forgotEmail.trim() || !forgotPhone.trim()) {
      alert('이메일과 휴대폰 번호를 입력해주세요.');
      return;
    }
    try {
      setIsSending(true);
      const data = await forgotPassword({ email: forgotEmail, phone: forgotPhone });
      if (data.success) {
        alert(data.message || '임시 비밀번호가 전송되었습니다. 이메일을 확인해주세요.');
      }
      handleClosePwForgot();
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Header
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <nav className="menu">
        <a onClick={() => handleCategory('0')}>간편식</a>
        <a onClick={() => handleCategory('1')}>식단</a>
        <a onClick={() => handleCategory('2')}>음료</a>
        <a onClick={() => handleCategory('3')}>의료기기</a>
      </nav>

      <div className="body">
        <div className="login-box">
          <img className="logo" src="/img/logo.png" alt="디아콘몰 로고" />
          <input
            type="email"
            className="login-signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
            autoComplete="username"
          />
          <input
            type="password"
            className="login-signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
            autoComplete="current-password"
          />
          <div className="login-signup-button-box">
            <button
              className="kakao-button"
              onClick={() => alert('카카오 로그인 기능은 추후 구현 예정입니다.')}
            >
              <img src="/img/kakao-login-button.png" alt="카카오 로그인 버튼" />
            </button>

            <button className="email-button" onClick={handleLogin}>
              <img src="/img/email_icon.png" alt="이메일 아이콘" />
              이메일 로그인
            </button>
          </div>

          {/* 회원가입, 비밀번호 찾기 */}
          <div>
            <Link className="signup_link" to="/signup">
              회원이 아니신가요?
            </Link>
            <button className="forgot-password" onClick={handleOpenPwForgot}>
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>

      {isPwForgotModalOpen && (
        <div className="modal-overlay" onClick={handleClosePwForgot}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">비밀번호 찾기</h3>
            <input
              type="email"
              className="modal-input"
              placeholder="이메일을 입력해주세요."
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              disabled={isSending}
            />
            <input
              type="tel"
              className="modal-input"
              placeholder="휴대폰 번호를 입력해주세요."
              value={forgotPhone}
              onChange={(e) => setForgotPhone(e.target.value)}
              disabled={isSending}
            />
            <div className="modal-actions">
              <button
                className="modal-button secondary"
                onClick={handleClosePwForgot}
                disabled={isSending}
              >
                취소
              </button>
              <button
                className="modal-button primary"
                onClick={handleSendTempPwPassword}
                disabled={isSending}
              >
                {isSending ? '전송 중...' : '전송'}
              </button>
            </div>
          </div>
        </div>
      )}
      {isSending && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </>
  );
};

export default Login;
