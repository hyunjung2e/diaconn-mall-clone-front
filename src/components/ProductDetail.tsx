import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/product_detail.css';
import { getProductDetail, getLoggedInUser, addToCart } from '../api/Api.ts';
import { LoginUser, Product, CartItem } from '../types/Types.ts';
import Header from './Common.tsx';

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
  const [count, setCount] = useState(1);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError('유효하지 않은 상품 ID입니다.');
      setLoading(false);
      return;
    }

    getProductDetail(Number(id))
      .then((data) => {
        setProduct(data);
        // 상품 정보가 로드되면 cartItem 초기화
        setCartItem({
          id: data.id,
          nm: data.nm,
          description: data.contentDesc,
          price: data.price,
          quantity: count,
          totalPrice: data.price * count,
          imgUrl: data.imgUrl,
        });
      })
      .catch((err: any) => setError(err.message || '상품 정보를 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false));

    getLoggedInUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [id]);

  // 수량 변경 시 cartItem 업데이트
  useEffect(() => {
    if (product && cartItem) {
      setCartItem({
        ...cartItem,
        quantity: count,
        totalPrice: product.price * count,
      });
    }
  }, [count]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  // 상품 수량변경
  const handleReduceCount = () => {
    setCount((prevCount) => {
      const newCount = Math.max(prevCount - 1, 1);
      return newCount;
    });
  };

  const handleIncreaseCount = () => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      return newCount;
    });
  };

  // 장바구니 담기
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

  // 바로 구매
  const handleBuyNow = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (window.confirm('바로 구매 하시겠습니까?')) {
      // 세션 스토리지 저장
      sessionStorage.setItem('buyNowItem', JSON.stringify(cartItem));
      navigate('/order');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>오류: {error}</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  console.log('cartitem', cartItem);

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

      <div className="product-container">
        <div className="product-image">
          <img src={product.imgUrl} alt={product.nm} />
        </div>

        <div className="product-details">
          <h1>{product.nm}</h1>
          {/* 수량 변경 */}
          <div className="product-details-count">
            <button onClick={handleReduceCount}>-</button>
            <div>{count}</div>
            <button onClick={handleIncreaseCount}>+</button>
          </div>
          <p className="price">가격: {cartItem?.totalPrice.toLocaleString()}원</p>
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
