import React, { useState, useEffect, Suspense } from 'react';
import '../css/mypage.css';
import { LoginUser, Product } from '../types/Types.ts';
import Header from './Common.tsx';
import { useNavigate } from 'react-router-dom';
import {
  getLoggedInUser,
  fetchProductsInfo,
  fetchCategoryProducts,
  updateUser,
} from '../api/Api.ts';

const MyOrder = React.lazy(() => import('./MyOrder.tsx'));

export default function Mypage() {
  const navigate = useNavigate();

  const [productInfo, setProductInfo] = useState<Product[]>([]);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTab, setSelectedTab] = useState<'home' | 'edit' | 'orders'>('home');

  const [formData, setFormData] = useState({
    email: '',
    phone: user?.phone || '',
    password: '',
    password2: '',
    address: user?.address || '',
    addressDetail: user?.addressDetail || '',
  });

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

    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, [categoryId]);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        phone: user.phone || '',
        password: '',
        password2: '',
        address: user.address || '',
        addressDetail: user.addressDetail || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.phone) newErrors.phone = '휴대폰 번호를 입력하세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요';
    if (!formData.password2) newErrors.password2 = '비밀번호 확인을 입력하세요';
    if (formData.password !== formData.password2)
      newErrors.password2 = '비밀번호가 일치하지 않습니다.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const updateData = {
          email: user!.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
          addressDetail: formData.addressDetail,
        };
        await updateUser(updateData);
        const updatedUser = await getLoggedInUser();
        setUser(updatedUser);
        alert('회원정보가 성공적으로 수정되었습니다!');
      } catch (error) {
        alert('회원정보 수정중 오류가 발생했습니다.');
      }
    }
  };

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

      <div className="mypage-container">
        <div className="mypage-sidebar">
          <button
            className={selectedTab === 'home' ? 'tab active' : 'tab'}
            onClick={() => setSelectedTab('home')}
          >
            마이페이지 홈
          </button>
          <button
            className={selectedTab === 'edit' ? 'tab active' : 'tab'}
            onClick={() => setSelectedTab('edit')}
          >
            회원정보 수정
          </button>
          <button
            className={selectedTab === 'orders' ? 'tab active' : 'tab'}
            onClick={() => setSelectedTab('orders')}
          >
            주문내역
          </button>
        </div>

        <div className="mypage-content">
          {selectedTab === 'home' && user && (
            <div className="mypage-welcome">
              <h2>안녕하세요, {user.name}님! 반갑습니다!</h2>
              <p>진행중인 주문</p>
              <p>최근 주문 정보</p>
            </div>
          )}

          {selectedTab === 'edit' && (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              <div className="mypage-row">
                <label className="mypage-label">이름</label>
                <input
                  className="mypage-disabled-input"
                  value={user?.name || ''}
                  readOnly
                />
              </div>

              <div>
                <label className="mypage-label">이메일</label>
                <input
                  className="mypage-disabled-input"
                  value={user?.email || ''}
                  readOnly
                />
              </div>

              <div className="mypage-row">
                <label className="mypage-label">휴대폰번호</label>
                <input
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  className="mypage-input"
                  type="tel"
                  name="phone"
                  onChange={handleChange}
                />
                {errors.phone && <p className="mypage-errors">{errors.phone}</p>}
              </div>

              <div className="mypage-row">
                <label className="mypage-label">비밀번호</label>
                <input
                  placeholder="비밀번호를 입력하세요"
                  className="mypage-input"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="mypage-errors">{errors.password}</p>}
              </div>

              <div className="mypage-row">
                <label className="mypage-label">비밀번호 확인</label>
                <input
                  placeholder="비밀번호 확인을 입력하세요"
                  className="mypage-input"
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                />
                {errors.password2 && <p className="mypage-errors">{errors.password2}</p>}
              </div>

              <div className="mypage-row">
                <label className="mypage-label">주소</label>
                <input
                  placeholder="주소를 입력하세요"
                  className="mypage-input"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="mypage-row">
                <input
                  placeholder="상세주소를 입력하세요"
                  className="mypage-input"
                  type="text"
                  name="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleChange}
                />
              </div>

              <button className="submit-button" type="submit">
                회원정보 수정
              </button>
            </form>
          )}

          {selectedTab === 'orders' && (
            <Suspense fallback={<div style={{ padding: 20 }}>주문내역 불러오는 중…</div>}>
              <MyOrder
                // API 연동 시: orders={fetchedOrders}
                onRowClick={(orderId: string) => navigate(`/order/${orderId}`)}
              />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
}
