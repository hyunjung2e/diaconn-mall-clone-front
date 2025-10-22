import React, { useState, useEffect } from 'react';
import '../css/order.css';
import Header from './Common.tsx';
import { LoginUser } from '../types/Types.ts';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUser } from '../api/Api.ts';

const OrderDone: React.FC = () => {
  const navigate = useNavigate();

  // 상태관리
  const [user, setUser] = useState<LoginUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  const handleHome = () => {
    navigate('/');
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleOrderList = () => {
    navigate('/mypage');
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

      <div className="order-body">
        <div className="order-done-container">
          <div className="order-done-title ">결제가 완료되었습니다</div>
          <div className="order-done-box">
            <button className="order-done home" onClick={handleHome}>
              홈으로
            </button>
            <button className="order-done list" onClick={handleOrderList}>
              주문내역 가기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDone;
