import '../css/main.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBanners,
  getLoggedInUser,
  fetchProductsInfo,
  fetchCategoryProducts,
} from '../api/Api.ts';
import { LoginUser, Product } from '../types/Types.ts';

const Main = () => {
  const [banners, setBanners] = useState<Product[]>([]);
  const [productInfo, setProductInfo] = useState<Product[]>([]);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (categoryId) {
      fetchCategoryProducts(categoryId)
        .then(setProductInfo)
        .catch((err) => console.error(err));
    } else {
      fetchProductsInfo()
        .then(setProductInfo)
        .catch((err) => console.error(err));
    }
    getBanners()
      .then(setBanners)
      .catch((err) => console.error(err));

    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, [categoryId]);

  // 검색 버튼 클릭 또는 Enter 키로 검색 시 /search 페이지로 이동
  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
  };

  return (
    <>
      <header>
        <div className="container">
          <a href="/" className="logo">
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
                <a>로그아웃</a>
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
        <a onClick={() => handleCategory('readymeal')}>간편식</a>
        <a onClick={() => handleCategory('food')}>식단</a>
        <a onClick={() => handleCategory('drink')}>음료</a>
        <a onClick={() => handleCategory('devices')}>의료기기</a>
      </nav>
      <main>
        <div className="container">
          {banners.map((banner) => (
            <img
              key={banner.id}
              src={banner.imgUrl}
              alt={banner.altText}
              loading="lazy"
              style={{ width: '100%', objectFit: 'cover' }}
            />
          ))}
        </div>
      </main>
      <section>
        <div className="container">
          <h2>베스트 상품</h2>
          <ul className="product-list">
            {productInfo.map((e, i) => (
              <li key={i}>
                <img
                  src={e.imgUrl}
                  alt={e.altText}
                  loading="lazy"
                  onClick={() => navigate(`/productDetail/${e.id}`)}
                />
                <h3>{e.nm}</h3>
                <p>{e.price}원</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <footer>
        <div className="container">© 2025 쇼핑몰. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Main;
