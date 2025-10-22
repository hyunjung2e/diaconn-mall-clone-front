import React, { useState, useEffect, Suspense } from 'react';
import '../css/mypage.css';
import { LoginUser, Product, OrderSummary, formatDate, formatPrice, formatProductCount, formatYearMonth } from '../types/Types.ts';
import Header from './Common.tsx';
import { useNavigate } from 'react-router-dom';
import {
  getLoggedInUser,
  fetchProductsInfo,
  fetchCategoryProducts,
  updateUser,
  getOrderList,
  getCartItems,
} from '../api/Api.ts';

const MyOrder = React.lazy(() => import('./MyOrder.tsx'));
const OrderDetailModal = React.lazy(() => import('./OrderDetailModal.tsx'));

export default function Mypage() {
  const navigate = useNavigate();

  const [productInfo, setProductInfo] = useState<Product[]>([]);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTab, setSelectedTab] = useState<'home' | 'edit' | 'orders'>('home');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

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
        if (data) {
          setUser(data);
          // 로그인된 사용자의 장바구니 조회
          setCartLoading(true);
          getCartItems(data.id)
            .then((items) => setCartItems(items))
            .catch((err) => console.error('장바구니 조회 실패:', err))
            .finally(() => setCartLoading(false));
        }
      })
      .catch(() => setUser(null));

    // 주문 목록 조회
    setOrdersLoading(true);
    getOrderList()
      .then((data) => setOrders(data))
      .catch((err) => console.error('주문 목록 조회 실패:', err))
      .finally(() => setOrdersLoading(false));
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

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
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

              {ordersLoading ? (
                <p>주문 정보를 불러오는 중...</p>
              ) : (
                <>
                  <section className="mypage-home-section">
                    <h3>최근 주문 정보</h3>
                    {orders.length === 0 ? (
                      <p className="no-orders">최근 주문 정보가 없습니다.</p>
                    ) : (() => {
                      // 가장 최근 달의 주문만 필터링
                      if (orders.length === 0) return null;

                      const mostRecentYearMonth = formatYearMonth(orders[0].regDate);
                      const recentMonthOrders = orders.filter(
                        (order) => formatYearMonth(order.regDate) === mostRecentYearMonth
                      );

                      // 페이지네이션 계산
                      const totalPages = Math.ceil(recentMonthOrders.length / ordersPerPage);
                      const startIndex = (currentPage - 1) * ordersPerPage;
                      const endIndex = startIndex + ordersPerPage;
                      const currentOrders = recentMonthOrders.slice(startIndex, endIndex);

                      return (
                        <div className="recent-orders-grouped">
                          <div className="order-month-group">
                            <h4 className="order-month-title">{mostRecentYearMonth}</h4>
                            <div className="recent-orders-list">
                              {currentOrders.map((order) => (
                                <div
                                  key={order.id}
                                  className="recent-order-item"
                                  onClick={() => handleOrderClick(order.id)}
                                >
                                  <img
                                    src={order.firstProductImgUrl}
                                    alt={order.firstProductName}
                                    className="recent-order-img"
                                  />
                                  <div className="recent-order-info">
                                    <p className="recent-order-product">
                                      {formatProductCount(order.firstProductName, order.totalProductCount)}
                                    </p>
                                    <p className="recent-order-date">{formatDate(order.regDate)}</p>
                                  </div>
                                  <p className="recent-order-price">{formatPrice(order.totalPrice)}</p>
                                </div>
                              ))}
                            </div>
                            {totalPages > 1 && (
                              <div className="pagination">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                  <button
                                    key={page}
                                    className={currentPage === page ? 'page-btn active' : 'page-btn'}
                                    onClick={() => setCurrentPage(page)}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </section>

                  <section className="mypage-home-section">
                    <h3>최근 본 상품</h3>
                    {productInfo.length === 0 ? (
                      <p className="no-items">최근 본 상품이 없습니다.</p>
                    ) : (
                      <div className="horizontal-scroll-container">
                        {productInfo.slice(0, 4).map((product) => (
                          <div
                            key={product.id}
                            className="recent-product-card"
                            onClick={() => navigate(`/productDetail/${product.id}`)}
                          >
                            <img
                              src={product.imgUrl}
                              alt={product.altText}
                              className="recent-product-img"
                            />
                            <div className="recent-product-info">
                              <p className="recent-product-name">{product.nm}</p>
                              <p className="recent-product-price">{formatPrice(product.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
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
              <MyOrder onOrderClick={handleOrderClick} />
            </Suspense>
          )}
        </div>
      </div>

      {isModalOpen && selectedOrderId && (
        <Suspense fallback={null}>
          <OrderDetailModal orderId={selectedOrderId} onClose={handleCloseModal} />
        </Suspense>
      )}
    </>
  );
}
