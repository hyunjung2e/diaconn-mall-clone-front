import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/product_detail.css';
import { getProductDetail, getLoggedInUser, addToCart } from '../api/Api.ts';
import { LoginUser, Product } from '../types/Types.ts';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<LoginUser | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [showCartPopup, setShowCartPopup] = useState(false);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError('유효하지 않은 상품 ID입니다.');
      setLoading(false);
      return;
    }

    getProductDetail(Number(id))
      .then((data) => setProduct(data))
      .catch((err: any) => setError(err.message || '상품 정보를 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false));

    getLoggedInUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [id]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  const handleBuyNow = () => {
    navigate(`/order?productNo=${product?.id}`);
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await addToCart(user.id, product!.id, 1);
      setShowCartPopup(true);
    } catch (err) {
      console.error('장바구니 담기 실패', err);
      alert('장바구니 담기에 실패했습니다.');
    }
  };

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
                <span onClick={() => navigate('/mypage')} style={{ cursor: 'pointer' }}>
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
        <a onClick={() => handleCategory('0')}>간편식</a>
        <a onClick={() => handleCategory('1')}>식단</a>
        <a onClick={() => handleCategory('2')}>음료</a>
        <a onClick={() => handleCategory('3')}>의료기기</a>
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
      {showCartPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{product?.nm} 장바구니에 담겼습니다.</p>
            <div className="popup-buttons">
              <button onClick={() => setShowCartPopup(false)}>계속 쇼핑</button>
              <button onClick={() => navigate('/cart')}>장바구니로 이동</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
