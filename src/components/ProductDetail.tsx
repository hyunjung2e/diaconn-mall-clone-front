import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/product_detail.css';

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState({
    id: 1,
    name: 'P8',
    price: 10000,
    description: '굿굿...',
    image: './img/product.jpg',
  });

  const handleAddToCart = () => {
    console.log(`${product.name}이(가) 장바구니에 추가되었습니다.`);
    // 장바구니에 상품을 추가하는 로직을 여기에 작성할 수 있습니다.
  };

  const handleBuyNow = () => {
    console.log(`${product.name}을(를) 바로 구매합니다.`);
    // 바로 구매 로직을 여기에 작성할 수 있습니다.
  };

  return (
    <div>
      <header>
        <div className="container">
          <a href="#" className="logo">
            <img src="./img/logo.png" alt="로고" />
          </a>
          <div className="header-right">
            <input type="text" placeholder="검색어를 입력해주세요." />
            <a href="#" className="login">
              로그인
            </a>
            <a href="#" className="cart">
              장바구니
            </a>
          </div>
        </div>
      </header>

      <nav className="menu">
        <a href="#">메뉴1</a>
        <a href="#">메뉴2</a>
        <a href="#">메뉴3</a>
        <a href="#">메뉴4</a>
      </nav>

      <div className="product-container">
        <div className="product-image">
          <img src={product.image} alt="상품 이미지" />
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="price">가격: {product.price.toLocaleString()}원</p>
          <p>설명: {product.description}</p>

          <button className="btn add-to-cart" onClick={handleAddToCart}>
            장바구니 담기
          </button>
          <button className="btn buy-now" onClick={handleBuyNow}>
            바로 구매
          </button>
        </div>
      </div>

      <footer>
        <p>© 2025 쇼핑몰. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProductDetail;
