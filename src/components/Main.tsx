import '../css/main.css';
import { useState, useEffect } from 'react';
import { getBanners, getLoggedInUser, fetchProductsInfo } from '../api/Api.ts';
import { useNavigate } from 'react-router-dom';
import { LoginUser, Product } from '../types/Types.ts';

const Main = () => {
  const [banners, setBanners] = useState<Product[]>([]);
  const [productInfo, setProductInfo] = useState<Product[]>([]);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getBanners()
      .then(setBanners)
      .catch((err) => console.error(err));

    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));

    fetchProductsInfo()
      .then(setProductInfo)
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <header>
        <div className="container">
          <a href="#" className="logo">
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
        <a href="#">메뉴1</a>
        <a href="#">메뉴2</a>
        <a href="#">메뉴3</a>
        <a href="#">메뉴4</a>
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

      <section className="product-section">
        <div className="container">
          {[
            {
              title: '베스트 상품',
              description: '많은 고객들이 선택한 인기 상품들을 소개합니다.',
              products: productInfo.slice(0, 3),
              boxClass: 'best',
            },
            {
              title: 'NEW 상품',
              description: '새롭게 등록된 따끈따끈한 상품들을 만나보세요!',
              products: productInfo.slice(3, 6),
              boxClass: 'new',
            },
          ].map((section, idx) => (
            <div key={idx} className="product-row">
              <div className={`product-description-box ${section.boxClass}`}>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <ul className="product-list three-cols">
                {section.products.map((e, i) => (
                  <li key={i} className="product-item" onClick={() => navigate(`/productDetail/${e.id}`)}>
                    <div className="product-image-container">
                      <img src={e.imgUrl} alt={e.altText} loading="lazy" />
                    </div>
                    <div className="product-info">
                      <p className="product-name">{e.nm}</p>
                      <p className="price">₩{e.price.toLocaleString()}</p>
                    </div>
              </li>
            ))}
          </ul>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <div className="container">© 2025 쇼핑몰. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Main;
