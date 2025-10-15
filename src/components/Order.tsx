import React, { useState, useEffect } from 'react';
import '../css/order.css';
import Header from './Common.tsx';
import { LoginUser, CartItem } from '../types/Types.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLoggedInUser, order } from '../api/Api.ts';

const Order: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상태관리
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<CartItem[]>([]);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientAddressDetail: '',
  });
  const totalPrice = selectedPrices.reduce((sum, p) => sum + p.totalPrice, 0);

  useEffect(() => {
    // 로그인한 유저 정보 가져오기
    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));

    // Cart에서 넘긴 상품들
    const itemsFromCart = location.state?.items ?? [];

    // ProductDetail에서 바로구매 상품
    const storedItem = sessionStorage.getItem('buyNowItem');
    const itemsFromBuyNow = storedItem ? [JSON.parse(storedItem)] : [];

    // 두 배열 합치기
    const mergedItems = [...itemsFromCart, ...itemsFromBuyNow];

    // ✅ 여기서 합친 배열을 state에 세팅해야 함
    setOrderItems(mergedItems);

    setLoading(false);
  }, [location.state]);

  // 화면 이탈(뒤로가기/새로고침/탭 닫기 등) 시 즉시 세션 제거
  useEffect(() => {
    const clearBuyNowItem = () => {
      sessionStorage.removeItem('buyNowItem');
    };

    const handlePopState = () => clearBuyNowItem();
    const handlePageHide = () => clearBuyNowItem();
    const handleBeforeUnload = () => clearBuyNowItem();

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // ***** 헤더 *****
  // 검색
  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  // 카테고리 이동
  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  // ***** 주문하기 *****
  // 체크박스 클릭 이벤트
  const handleCheckbox = (checked: boolean, orderItem: CartItem) => {
    setSelectedPrices((prev) =>
      checked ? [...prev, orderItem] : prev.filter((p) => p.id !== orderItem.id)
    );
  };

  // 상품 수량 감소
  const handleReduceCount = (itemId: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, 1),
              totalPrice: item.price * Math.max(item.quantity - 1, 1),
            }
          : item
      )
    );

    setSelectedPrices((prevSelected) =>
      prevSelected.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, 1),
              totalPrice: item.price * Math.max(item.quantity - 1, 1),
            }
          : item
      )
    );
  };

  // 상품 수량 증가
  const handleIncreaseCount = (itemId: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.price * (item.quantity + 1),
            }
          : item
      )
    );

    setSelectedPrices((prevSelected) =>
      prevSelected.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.price * (item.quantity + 1),
            }
          : item
      )
    );
  };

  // 상품 삭제
  const handleDelete = (itemId: number, nm: string) => {
    if (window.confirm(`${nm}를 주문 목록에서 삭제하시겠습니까?`)) {
      // 주문 목록에서 삭제
      setOrderItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

      // 선택된 상품 목록에서도 삭제
      setSelectedPrices((prevSelected) => prevSelected.filter((item) => item.id !== itemId));

      // 세션 스토리지에서 삭제
      sessionStorage.removeItem('buyNowItem');
    }
  };

  // 수신자 정보 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 주문자 정보와 동일하게 변경
  const handleRecipientInfo = () => {
    setFormData({
      recipientName: user?.name ?? '',
      recipientPhone: user?.phone ?? '',
      recipientAddress: user?.address ?? '',
      recipientAddressDetail: user?.addressDetail ?? '',
    });
  };

  // 유효성 검사
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.recipientName) newErrors.recipientName = '수신자 이름을 입력하세요.';
    if (!formData.recipientPhone) newErrors.recipientPhone = '수신자 번호를 입력하세요.';
    if (!formData.recipientAddress) newErrors.recipientAddress = '수신자 주소를 입력하세요.';
    if (!formData.recipientAddressDetail)
      newErrors.recipientAddressDetail = '수신자 주소 상세를 입력하세요.';
    setErrors(newErrors);
    if (totalPrice === 0) {
      window.alert('주문할 상품을 선택하세요.');
      return false;
    }
    return Object.keys(newErrors).length === 0;
  };

  // 주문 폼 제출 핸들러
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (window.confirm(`총 ${totalPrice.toLocaleString()}원 결제하시겠습니까?`)) {
        try {
          const updateData = {
            totalPrice: totalPrice,
            address: formData.recipientAddress,
            addressDetail: formData.recipientAddressDetail,
            phone: formData.recipientPhone,
            name: formData.recipientName,
            memo: message,
            orderDetails: orderItems.map((item) => ({
              productId: item.id,
              productName: item.nm,
              productPrice: item.price,
              productQuantity: item.quantity,
              productImgUrl: item.imgUrl,
            })),
          };
          await order(updateData);
          navigate(`/orderdone`);
        } catch (error) {
          alert('결제 시도 중 오류가 발생했습니다.');
        }
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;
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

      <div className="order-container">
        <h2>주문하기</h2>
        {/* 결제정보 */}
        {orderItems.length === 0 ? (
          <div className="order-empty-message">담은 상품이 없습니다.</div>
        ) : (
          orderItems.map((orderItem) => (
            <div className="order-list" key={orderItem.id}>
              {/* 체크박스 */}
              <input
                type="checkbox"
                onChange={(e) => handleCheckbox(e.target.checked, orderItem)}
              />

              {/* 이미지 */}
              <div className="order-img-wrapper">
                <img src={orderItem.imgUrl} alt="상품 이미지" />
              </div>

              {/* 상품명 */}
              <div>{orderItem.nm}</div>

              {/* 주문가격 */}
              <div className="order-totalprice-box">
                {/* 수량조절 */}
                <div className="order-count">
                  <button onClick={() => handleReduceCount(orderItem.id)}>-</button>
                  <div>{orderItem.quantity}</div>
                  <button onClick={() => handleIncreaseCount(orderItem.id)}>+</button>
                </div>

                {/* 총 합계 */}
                <div className="order-totalprice">
                  가격: {(orderItem.price * orderItem.quantity).toLocaleString()}원
                </div>
              </div>
              {/* 상품삭제 */}
              <div className="order-delete">
                <button onClick={() => handleDelete(orderItem.id, orderItem.nm)}>삭제</button>
              </div>
            </div>
          ))
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* 주문자 정보 */}
          <h3>주문자 정보</h3>

          <div>
            {/* 이름 */}
            <div className="order-row">
              <label className="order-label">이름</label>
              <input
                className="order-disabled-input"
                value={user?.name || ''}
                readOnly
                autoComplete="tel"
              />
            </div>

            {/* 휴대폰번호(필수) */}
            <div className="order-row">
              <label className="order-label">휴대폰 번호</label>
              <input
                className="order-disabled-input"
                value={user?.phone || ''}
                type="tel"
                name="phone"
                autoComplete="tel"
                readOnly
              />
            </div>

            {/* 주소 */}
            <div className="order-row">
              <label className="order-label">주소</label>
              <input
                className="order-disabled-input"
                type="text"
                name="address"
                value={user?.address || ''}
                readOnly
              />
            </div>

            {/* 주소상세 */}
            <div className="order-row">
              <input
                placeholder="상세주소를 입력하세요"
                className="order-disabled-input"
                type="text"
                name="addressDetail"
                value={user?.addressDetail || ''}
                readOnly
              />
            </div>
          </div>
          {/* 주문자 정보와 동일하게 변경하는 버튼 */}
          <button className="same-button" type="button" onClick={handleRecipientInfo}>
            주문자 정보와 동일
          </button>

          {/* 수신자 정보 */}
          <div>
            <h3>수신자 정보</h3>
            {/* 이름 */}
            <div className="order-row">
              <label className="order-label">이름</label>
              <input
                name="recipientName"
                placeholder="수신자 이름을 입력하세요"
                className="order-input"
                value={formData.recipientName || ''}
                onChange={handleChange}
                autoComplete="tel"
              />
              {errors.recipientName && <p className="order-errors">{errors.recipientName}</p>}
            </div>

            {/* 휴대폰번호(필수) */}
            <div className="order-row">
              <label className="order-label">휴대폰번호</label>
              <input
                name="recipientPhone"
                placeholder="010-1234-5678"
                value={formData.recipientPhone || ''}
                className="order-input"
                type="tel"
                onChange={handleChange}
                autoComplete="tel"
              />
              {errors.recipientPhone && <p className="order-errors">{errors.recipientPhone}</p>}
            </div>

            {/* 주소 */}
            <div className="order-row">
              <label className="order-label">주소</label>
              <input
                name="recipientAddress"
                placeholder="주소를 입력하세요"
                className="order-input"
                type="text"
                value={formData.recipientAddress || ''}
                onChange={handleChange}
              />
              {errors.recipientAddress && <p className="order-errors">{errors.recipientAddress}</p>}
            </div>

            {/* 주소상세 */}
            <div className="order-row">
              <input
                name="recipientAddressDetail"
                placeholder="상세주소를 입력하세요"
                className="order-input"
                type="text"
                value={formData.recipientAddressDetail || ''}
                onChange={handleChange}
              />
              {errors.recipientAddressDetail && (
                <p className="order-errors">{errors.recipientAddressDetail}</p>
              )}
            </div>

            {/* 배송메세지 */}
            <div className="order-row">
              <input
                className="order-input"
                type="text"
                placeholder="배송 메시지를 입력해주세요."
                value={message || ''}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          {/* 총 결제 금액 */}
          <div className={`pay-button${totalPrice === 0 ? ' disabled' : ''}`} onClick={handleOrder}>
            총 금액: {totalPrice.toLocaleString()}원 결제하기
          </div>
        </form>
      </div>
    </>
  );
};

export default Order;
