import React, { useState, useEffect } from 'react';
import '../css/order.css';
import Header from './Common.tsx';
import { LoginUser, Product } from '../types/Types.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLoggedInUser, getProductDetail, order } from '../api/Api.ts';

const OrderDone: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const productNo = searchParams.get('productNo');

  // 상태관리
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<Product[]>([]);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientAddressDetail: '',
  });
  const totalPrice = selectedPrices.reduce((sum, p) => sum + p.price, 0);

  const handleHome = () => {
    navigate('/');
  };

  const handleOrderList = () => {
    navigate('/myorder');
  };

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <Header
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      <div className="body">
        <div
          style={{
            width: '35%',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '80px',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            결제가 완료되었습니다
          </div>
          <div
            style={{
              display: 'flex',
              gap: '15px',
              width: '80%',
            }}
          >
            <button
              className="order-done"
              style={{
                backgroundColor: '#f0f0f0',
                color: '#333',
              }}
              onClick={handleHome}
            >
              홈으로
            </button>
            <button
              className="order-done"
              style={{
                backgroundColor: '#1fc4bf',
                color: 'white',
              }}
              onClick={handleOrderList}
            >
              주문내역 가기
            </button>
          </div>
        </div>
      </div>
      <footer>
        <div className="container">© 2025 쇼핑몰. All rights reserved.</div>
      </footer>
    </>
  );
};

export default OrderDone;
