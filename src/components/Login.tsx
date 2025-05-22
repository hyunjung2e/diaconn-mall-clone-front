import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // 추가
import '../css/login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // 페이지 이동 함수

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const data = await response.json();
      alert(`${data.user.name}님 환영합니다!`);

      setEmail('');
      setPassword('');

      // 로그인 성공 시 main 페이지로 이동
      navigate('/main');
    } catch (error) {
      alert('로그인 실패! 이메일과 비밀번호를 확인해주세요.');
      console.error(error);
    }
  };

  return (
    <div className="body">
      <div className="login-signup-box">
        <div className="login-logo">로고 들어가는 부분</div>
        <h3 className="login-welcome">디아콘몰에 오신 것을 환영합니다</h3>
        <input
          type="email"
          className="login-signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 입력"
          autoComplete="username"
        />
        <input
          type="password"
          className="login-signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          autoComplete="current-password"
        />
        <div className="login-signup-button-box">
          <button
            className="kakao-button"
            onClick={() => alert('카카오 로그인 기능은 추후 구현 예정입니다.')}
          >
            카카오 로그인
          </button>
          <button className="email-button" onClick={handleLogin}>
            이메일 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
