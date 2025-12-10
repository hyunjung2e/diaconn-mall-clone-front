import '../css/main.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBanners,
  getLoggedInUser,
  fetchProductsInfo,
  fetchCategoryProducts,
} from '../api/Api.ts';
import Header from './Common.tsx';
import { LoginUser, Product, Banner } from '../types/Types.ts';

const Main = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [productInfo, setProductInfo] = useState<Product[]>([]);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

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

  // 배너 롤링
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

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

      <main>
        <div className="banner-container">
          {banners.length > 0 && (
            <div
              className="banner-slider"
              style={{
                transform: `translateX(-${currentBannerIndex * 100}%)`,
              }}
            >
              {banners.map((banner, index) => (
                <div key={banner.id} className="banner-slide">
                  <img src={banner.imageUrl} alt="배너" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <section>
        <div className="container">
          <h2>🔥 베스트 상품</h2>
          <ul className="product-list highlight-list">
            {productInfo.slice(0, 4).map((e, i) => (
              <li key={i}>
                <div className="product-image-wrapper">
                  <img
                    src={e.imgUrl}
                    alt={e.altText}
                    loading="lazy"
                    onClick={() => navigate(`/productDetail/${e.id}`)}
                  />
                  <span className="product-badge">지금 특가!</span>
                </div>
                <h3 className="product-name">{e.nm}</h3>
                <p className="product-price">{e.price.toLocaleString()}원</p>
              </li>
            ))}
          </ul>
          <h2>🛍 전체 상품</h2>
          <ul className="product-list">
            {productInfo.map((e, i) => (
              <li key={i}>
                <img
                  src={e.imgUrl}
                  alt={e.altText}
                  loading="lazy"
                  onClick={() => navigate(`/productDetail/${e.id}`)}
                />
                <h3 className="product-name">{e.nm}</h3>
                <p className="product-price">{e.price.toLocaleString()}원</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Main;
