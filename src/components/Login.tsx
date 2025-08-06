import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/Api.ts';
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

          <Link className="signup_link" to="/signup">
            회원이 아니신가요?
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
