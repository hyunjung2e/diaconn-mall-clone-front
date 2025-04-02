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
      <div className="login-logo">결제가 완료되었습니다</div>
      <div>
        <button onClick={handleLogin}>홈으로</button>
        <button onClick={handleLogin}>주문내역 가기</button>
      </div>
    </div>
  );
};

export default Login;
