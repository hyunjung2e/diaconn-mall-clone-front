import React, { useState } from 'react';
import '../css/cart.css';

const Cart = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, description: '상품 설명 1', price: 10000, quantity: 1, selected: false },
    { id: 2, description: '상품 설명 2', price: 20000, quantity: 1, selected: false },
    { id: 3, description: '상품 설명 3', price: 15000, quantity: 1, selected: false }
  ]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setCartItems(cartItems.map(item => ({ ...item, selected: !selectAll })));
  };

  const handleItemSelect = (id: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const handleQuantityChange = (id: number, value: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: value } : item
    ));
  };

  const totalPrice = cartItems.reduce((total, item) => item.selected ? total + item.price * item.quantity : total, 0);

  return (
    <>
      <header>
        <div className="container">
          <a href="#" className="logo"><img src="./img/logo.png" alt="로고" /></a>
          <div className="header-right">
            <input type="text" placeholder="검색어를 입력해주세요." />
            <a href="#" className="login">로그인</a>
            <a href="#" className="cart">장바구니</a>
          </div>
        </div>
      </header>

      <nav className="menu">
        <a href="#">메뉴1</a>
        <a href="#">메뉴2</a>
        <a href="#">메뉴3</a>
        <a href="#">메뉴4</a>
      </nav>

      <main className="cart-container">
        <div className="cart-header">
          <input
            type="checkbox"
            className="select-all"
            id="select-all"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <label htmlFor="select-all">전체 선택</label>
        </div>

        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <input
                type="checkbox"
                className="item-select"
                checked={item.selected}
                onChange={() => handleItemSelect(item.id)}
              />
              <img src="상품이미지.jpg" alt="상품 이미지" />
              <div className="item-info">
                <p className="item-description">{item.description}</p>
                <p className="item-price">₩{item.price.toLocaleString()}</p>
              </div>
              <div className="item-price-detail">
                <p className="price">₩{(item.price * item.quantity).toLocaleString()}</p>
                <input
                  type="number"
                  value={item.quantity}
                  className="quantity"
                  onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <p className="total-price">총 금액: ₩{totalPrice.toLocaleString()}</p>
          <button className="checkout-btn">결제하기</button>
        </div>
      </main>

      <footer>
        <div className="container">
          © 2025 쇼핑몰. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Cart;
