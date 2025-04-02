import React, { useEffect, useState } from 'react';
import '../css/app.css';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // await login(list);
    setId('');
    setPassword('');
  };

  return (
    <div className="login-signup-box">
      <div className="login-logo">로고 들어가는 부분</div>
      <h3 className="login-welcome">디아콘몰에 오신것을 환영합니다</h3>
      <input
        className="login-signup-input"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        className="login-signup-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="login-signup-button-box">
        <button className="kakao-button" onClick={handleLogin}>
          카카오 로그인
        </button>
        <button className="email-button" onClick={handleLogin}>
          이메일 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
