import React, { useEffect, useState } from 'react';
import '../css/orderdetailmodal.css';
import { OrderDetail, formatDate, formatPrice } from '../types/Types.ts';
import { getOrderDetail } from '../api/Api.ts';

interface Props {
  orderId: number;
  onClose: () => void;
}

export default function OrderDetailModal({ orderId, onClose }: Props) {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderDetail(orderId);
        setOrderDetail(data);
      } catch (err: any) {
        if (err.message === 'UNAUTHORIZED') {
          setError('로그인이 필요합니다.');
        } else if (err.message === 'NOT_FOUND') {
          setError('주문 정보를 찾을 수 없습니다.');
        } else {
          setError(err.message || '주문 상세 정보를 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>주문 상세정보</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="modal-loading">
              <p>주문 정보를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="modal-error">
              <p>{error}</p>
              <button onClick={onClose} className="modal-error-btn">닫기</button>
            </div>
          )}

          {!loading && !error && orderDetail && (
            <>
              <div className="order-info-section">
                <h3>주문 정보</h3>
                <div className="info-row">
                  <span className="info-label">주문번호:</span>
                  <span className="info-value">{orderDetail.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">주문일자:</span>
                  <span className="info-value">{formatDate(orderDetail.regDate)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">총 결제금액:</span>
                  <span className="info-value total-price">{formatPrice(orderDetail.totalPrice)}</span>
                </div>
              </div>

              <div className="delivery-info-section">
                <h3>배송 정보</h3>
                <div className="info-row">
                  <span className="info-label">받는 분:</span>
                  <span className="info-value">{orderDetail.name || '-'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">연락처:</span>
                  <span className="info-value">{orderDetail.phone || '-'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">주소:</span>
                  <span className="info-value">
                    {orderDetail.address}
                    {orderDetail.addressDetail && ` (${orderDetail.addressDetail})`}
                  </span>
                </div>
                {orderDetail.memo && (
                  <div className="info-row">
                    <span className="info-label">배송 메모:</span>
                    <span className="info-value">{orderDetail.memo}</span>
                  </div>
                )}
              </div>

              <div className="products-section">
                <h3>주문 상품</h3>
                <div className="products-list">
                  {orderDetail.orderDetails.map((item, index) => (
                    <div key={index} className="product-item">
                      <img
                        src={item.productImgUrl}
                        alt={item.productName}
                        className="product-image"
                      />
                      <div className="product-info">
                        <p className="product-name">{item.productName}</p>
                        <p className="product-category">{item.productCategory || '-'}</p>
                        <p className="product-quantity">수량: {item.productQuantity}개</p>
                      </div>
                      <div className="product-price">
                        <p className="unit-price">{formatPrice(item.productPrice)}</p>
                        <p className="total-price">
                          {formatPrice(item.productPrice * item.productQuantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="modal-close-bottom-btn">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
