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
  const [product, setProduct] = useState<Product | null>(null);
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
  const [price, setPrice] = useState('');

  useEffect(() => {
    // 바로 구매 요청한 상품 정보 가져오기
    if (productNo) {
      getProductDetail(Number(productNo))
        .then((data) => setProduct(data))
        .catch((err: any) => setErrors(err.message || '상품 정보를 불러오는 데 실패했습니다.'))
        .finally(() => setLoading(false));
    }
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

  // 수신자 정보 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecipientInfo = () => {
    setFormData({
      recipientName: user?.name ?? '',
      recipientPhone: user?.phone ?? '',
      recipientAddress: user?.address ?? '',
      recipientAddressDetail: user?.addressDetail ?? '',
    });
  };

  // 체크박스 클릭 이벤트
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setPrice(product?.price.toLocaleString() ?? '');
    } else {
      setPrice('');
    }
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
    return Object.keys(newErrors).length === 0;
  };

  // 주문 폼 제출 핸들러
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const updateData = {
          name: formData.recipientName,
          phone: formData.recipientPhone,
          address: formData.recipientAddress,
          addressDetail: formData.recipientAddressDetail,
          memo: message,
        };
        await order(updateData);
        alert('결제가 완료되었습니다!');
        navigate(`/orderdone`);
      } catch (error) {
        alert('결제 시도 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

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

      <div className="container">
        <h2>주문하기</h2>

        {/* 결제정보 */}
        <div className="order-list" key={product.id}>
          <input type="checkbox" onChange={handleCheckbox} />
          <img src={product.imgUrl} alt="상품 이미지" />
          <div>
            {product.nm}
            <br />
            가격: {product.price.toLocaleString()}원
          </div>
        </div>

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
          <div className="pay-button" onClick={handleOrder}>
            총 금액: {price}원 결제하기
          </div>
        </form>
      </div>
    </>
  );
};

export default Order;
