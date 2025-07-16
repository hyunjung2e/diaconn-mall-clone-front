import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/product_detail.css';
import { getProductDetail } from '../api/Api.ts';
import { LoginUser } from '../types/Types.ts';

interface Product {
  id: number;
  nm: string;
  price: number;
  contentDesc: string;
  imgUrl: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 추가된 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<LoginUser | null>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError('유효하지 않은 상품 ID입니다.');
      setLoading(false);
      return;
    }

    getProductDetail(Number(id))
      .then((data) => setProduct(data))
      .catch((err: any) =>
        setError(err.message || '상품 정보를 불러오는 데 실패했습니다.')
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>오류: {error}</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  return (
    <>
      <header>
        <div className="container">
          <a className="logo" onClick={() => navigate('/')}>
            <img src="/img/logo.png" alt="로고" />
          </a>
          <div className="header-right">
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <button onClick={handleSearch}>검색</button>

            {user ? (
              <>
                <span
                  onClick={() => navigate('/mypage')}
                  style={{ cursor: 'pointer' }}
                >
                  {user.name}님
                </span>
                <a onClick={() => alert('로그아웃 기능 구현 필요')}>로그아웃</a>
              </>
            ) : (
              <a className="login" onClick={() => navigate('/login')}>
                로그인
              </a>
            )}
            <a className="cart" onClick={() => navigate('/cart')}>
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
          <p>설명: {product.contentDesc}</p>

          <button
            className="btn add-to-cart"
            onClick={() => alert(`${product.nm} 장바구니 담기`)}
          >
            장바구니 담기
          </button>
          <button
            className="btn buy-now"
            onClick={() => alert(`${product.nm} 바로 구매`)}
          >
            바로 구매
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
