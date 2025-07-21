// components/common.tsx
import { useNavigate } from 'react-router-dom';
import { LoginUser } from '../types/Types';
import '../css/common.css';
import { logout } from '../api/Api.ts';

type HeaderProps = {
  user: LoginUser | null;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  handleSearch: () => void;
};

const Header = ({ user, searchQuery, setSearchQuery, handleSearch }: HeaderProps) => {
  const navigate = useNavigate();

  // 로그아웃 확인
  const confirmLogout = async () => {
    const confirmLogout = window.confirm('로그아웃 하시겠습니까?');
    if (confirmLogout) {
      try {
        await logout();
        window.location.href = '/login';
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <header>
      <div className="container">
        <a href="/" className="logo">
          <img src="/img/logo.png" alt="로고" />
        </a>
        <div className="header-right">
          <input
            type="text"
            placeholder="원하는 제품을 입력해주세요."
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
              <a onClick={confirmLogout}>로그아웃</a>
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
  );
};

export default Header;
