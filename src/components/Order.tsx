import React, { useState } from 'react';
import '../css/order.css';
import Header from './Common.tsx';
import { LoginUser } from '../types/Types.ts';
import { useNavigate } from 'react-router-dom';

const Order: React.FC = () => {
  const [products, setProducts] = useState([
    { id: 1, name: '상품명 1', price: 10000, quantity: 1 },
    { id: 2, name: '상품명 2', price: 20000, quantity: 1 },
  ]);

  const navigate = useNavigate();
  const [user, setUser] = useState<LoginUser | null>(null);
  const [recipient, setRecipient] = useState('아콘이');
  const [address, setAddress] = useState('서울시 강남구 테헤란로 123');
  const [phone, setPhone] = useState('010-1234-5678');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  const totalPrice = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

  return (
    <div>
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

      <div className="container">
        {products.map((product) => (
          <div className="order-list" key={product.id}>
            <div>
              <input type="checkbox" />
            </div>
            <div>
              <img src={`./img/product${product.id}.jpg`} alt="상품 이미지" />
            </div>
            <div>
              {product.name}
              <br />
              가격: {product.price.toLocaleString()}원
            </div>
            <div>{(product.price * product.quantity).toLocaleString()}원</div>
            <div>
              <input
                type="number"
                value={product.quantity}
                min="1"
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
              />
            </div>
          </div>
        ))}

        <div className="order-info">받는이: {recipient}</div>
        <div className="order-info">주소: {address}</div>
        <div className="order-info">개인정보: {phone}</div>
        <div className="order-info">
          <input
            type="text"
            placeholder="배송 메시지를 입력해주세요."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="pay-button">
          총 금액: {totalPrice.toLocaleString()}원 <button>결제하기</button>
        </div>
      </div>
    </div>
  );
};

export default Order;
