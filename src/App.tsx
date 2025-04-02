import React from 'react';
import Login from './components/Login.tsx';
import SignUp from './components/SignUp.tsx';
import Mypage from './components/Mypage.tsx';
import MyOrder from './components/MyOrder.tsx';
import '../src/css/app.css';

const App: React.FC = () => {
  return (
    <div className="body">
      {/* <Login /> */}
      {/* <SignUp /> */}
      {/* <Mypage /> */}
      <MyOrder />
    </div>
  );
};

export default App;
