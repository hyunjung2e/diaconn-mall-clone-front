import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/Api.ts'; 
import '../css/login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await login({ email, password });

      alert(`${data.user.name}님 환영합니다!`);
      setEmail('');
      setPassword('');
      navigate('/main');
    } catch (error: any) {
      alert(error.message || '로그인 실패! 이메일과 비밀번호를 확인해주세요.');
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
