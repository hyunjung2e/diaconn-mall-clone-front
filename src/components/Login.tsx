import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      navigate('/');
    } catch (error: any) {
      alert(error.message || '로그인 실패! 이메일과 비밀번호를 확인해주세요.');
      console.error(error);
    }
  };
 return (
    <div className="body">
      <div className="login-signup-box">
        <img className='logo' src="/img/logo.png" alt="디아콘몰 로고" />
        

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

        <Link className='signup_link' to="/signup">회원이 아니신가요?</Link>
      </div>
    </div>
  );
};

export default Login;

