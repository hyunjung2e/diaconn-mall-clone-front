import React, { useState, useEffect } from 'react';
import '../css/order.css';
import Header from './Common.tsx';
import { LoginUser, Product } from '../types/Types.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLoggedInUser, getProductDetail, order } from '../api/Api.ts';

const Order: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const productNo = searchParams.get('productNo');

  // 상태관리
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<Product[]>([]);
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
  const totalPrice = selectedPrices.reduce((sum, p) => sum + p.price, 0);

  useEffect(() => {
    // 바로 구매 요청한 상품 정보 가져오기
    // if (productNo) {
    //   getProductDetail(Number(productNo))
    //     .then((data) => setProducts([data]))
    //     .catch((err: any) => setErrors(err.message || '상품 정보를 불러오는 데 실패했습니다.'))
    //     .finally(() => setLoading(false));
    // }

    // 장바구니에서 이관된 상품 정보 가져오기
    setProducts([
      {
        id: 1,
        nm: '상품1',
        contentDesc: '설명',
        price: 20000,
        imgUrl:
          'https://mall-clone.s3.ap-northeast-2.amazonaws.com/devices/3_%5B%EB%B0%94%EB%A1%9C%EC%9E%B0%5D+%ED%8E%84%EC%8A%A4%ED%94%8C%EB%9F%AC%EC%8A%A4+%EC%9E%90%EB%8F%99%EC%A0%84%EC%9E%90%ED%98%88%EC%95%95%EA%B3%84_120000.png',
        altText: '',
        quantity: 1,
        totalPrice: 20000,
      },
      {
        id: 2,
        nm: '상품2',
        contentDesc: '설명',
        price: 10000,
        imgUrl:
          'https://mall-clone.s3.ap-northeast-2.amazonaws.com/devices/3_%5B%EB%B0%94%EB%A1%9C%EC%9E%B0%5D%EB%B0%94%EB%A1%9C%EC%9E%B02+%ED%98%88%EB%8B%B9%EC%8B%9C%ED%97%98%EC%A7%80+50%EB%A7%A4_12000.png',
        altText: '',
        quantity: 1,
        totalPrice: 10000,
      },
    ]);

    // 로그인한 유저 정보 가져오기
    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, [productNo]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  // 체크박스 클릭 이벤트
  const handleCheckbox = (checked: boolean, product: Product) => {
    setSelectedPrices((prev) =>
      checked ? [...prev, product] : prev.filter((p) => p.id !== product.id)
    );
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
    if (totalPrice === 0) return false;
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
            orderDetails: products.map((item) => ({
              productId: item.id,
              productPrice: item.price,
              productQuantity: item.quantity,
              productTotalPrice: item.price * item.quantity,
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

  // if (loading) return <div>로딩 중...</div>;
  if (!products) return <div>상품을 찾을 수 없습니다.</div>;

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
        {products.map((product) => (
          <div className="order-list" key={product.id}>
            <input type="checkbox" onChange={(e) => handleCheckbox(e.target.checked, product)} />
            <img src={product.imgUrl} alt="상품 이미지" />
            <div>
              {product.nm}
              <br />
              가격: {product.price.toLocaleString()}원
            </div>
          </div>
        ))}
        <form
          onSubmit={handleOrder}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
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
                value={user?.phone}
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
                value={user?.address}
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
                value={user?.addressDetail}
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
                value={formData.recipientPhone}
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
                value={formData.recipientAddress}
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
                value={formData.recipientAddressDetail}
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
                value={message}
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
      <footer>
        <div className="container">© 2025 쇼핑몰. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Order;
