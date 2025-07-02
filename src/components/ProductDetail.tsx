import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/product_detail.css';
import { getProductDetail } from '../api/Api.ts';

interface Product {
  id: number;
  nm: string;
  price: number;
  desc: string;
  imgUrl: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams(); // URL에서 id 추출
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;

    getProductDetail(Number(id))
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error('상품 정보 불러오기 실패:', err);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      console.log(`${product.nm}이(가) 장바구니에 추가되었습니다.`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      console.log(`${product.nm}을(를) 바로 구매합니다.`);
    }
  };

  if (!product) return <div>로딩 중...</div>;

  return (
    <div>
      <header>
        <div className="container">
          <a href="#" className="logo">
            <img src="/img/logo.png" alt="로고" />
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
          <img src={product.imgUrl} alt={product.nm} />
        </div>

        <div className="product-details">
          <h1>{product.nm}</h1>
          <p className="price">가격: {product.price.toLocaleString()}원</p>
          <p>설명: {product.desc}</p>

          <button className="btn add-to-cart" onClick={handleAddToCart}>
            장바구니 담기
          </button>
          <button className="btn buy-now" onClick={handleBuyNow}>
            바로 구매
          </button>
        </div>
      </div>

      <footer>
        <p>© 2025 쇼핑몰</p>
      </footer>
    </div>
  );
};

export default ProductDetail;
