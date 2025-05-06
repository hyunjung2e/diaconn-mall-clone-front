import React from 'react';
import '../css/main.css';

const Main = () => {
  return (
    <>
      <header>
        <div className="container">
          <a href="#" className="logo">
            <img src="/img/logo.png" alt="로고" />
          </a>
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

      <main>
        <div className="container">
          <img src="/images/banner.jpg" alt="배너 이미지" className="banner" />
        </div>
      </main>

      <section>
        <div className="container">
          <h2>베스트 상품</h2>
          <ul className="product-list">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i}>
                <img src={`/images/product${i + 1}.jpg`} alt={`상품 ${i + 1}`} />
                <h3>{`상품 ${i + 1}`}</h3>
                <p>{`₩${(i + 1) * 10000}`}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer>
        <div className="container">
          © 2025 쇼핑몰. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Main;
