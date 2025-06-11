import '../css/main.css';
import { useState, useEffect } from 'react';
import { getBanners, getLoggedInUser } from '../api/Api.ts';
import { useNavigate } from 'react-router-dom';

type Banner = {
  id: number;
  imageUrl: string;
  altText: string;
};

type LoginUser = {
  id: number;
  name: string;
  email: string;
};

const Main = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [user, setUser] = useState<LoginUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getBanners()
      .then((data) => setBanners(data))
      .catch((err) => console.error(err));

    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <header>
        <div className="container">
          <a href="#" className="logo">
            <img src="/img/logo.png" alt="로고" />
          </a>
          <div className="header-right">
            <input type="text" placeholder="검색어를 입력해주세요." />
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
              <a>로그인</a>
            )}
            <a href="#" className="cart" onClick={() => navigate('/cart')}>
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
              src={`http://localhost:8080${banner.imageUrl}?v=${banner.id}`}
              alt={banner.altText}
            />
          ))}
        </div>
      </main>

      <section>
        <div className="container">
          <h2>베스트 상품</h2>
          <ul className="product-list">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i}>
                <img
                  src={`/images/product${i + 1}.jpg`}
                  alt={`상품 ${i + 1}`}
                />
                <h3>{`상품 ${i + 1}`}</h3>
                <p>{`₩${(i + 1) * 10000}`}</p>
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
