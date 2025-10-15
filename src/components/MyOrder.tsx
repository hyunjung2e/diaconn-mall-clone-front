import React, { useState, useEffect } from 'react';
import '../css/myorder.css';
import '../css/filterwidget.css';
import { OrderSummary, formatDate, formatPrice, formatProductCount } from '../types/Types.ts';
import { getOrderList } from '../api/Api.ts';

interface Props {
  itemsPerPage?: number;
  onOrderClick?: (orderId: number) => void;
}

export default function MyOrder({
  itemsPerPage = 5,
  onOrderClick,
}: Props) {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderList();
        setOrders(data);
      } catch (err: any) {
        if (err.message === 'UNAUTHORIZED') {
          setError('로그인이 필요합니다.');
        } else {
          setError('주문 목록을 불러오는데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = orders.slice(start, start + itemsPerPage);

  function getPageRange(current: number, total: number) {
    const delta = 1;
    const range: (number | '...')[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);
    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push('...');
    if (total > 1) range.push(total);
    return range;
  }
  const pageItems = getPageRange(currentPage, totalPages);

  if (loading) {
    return (
      <div className="myorder">
        <div className="order-loading">주문 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="myorder">
        <div className="order-error">{error}</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="myorder">
        <div className="order-empty">주문 내역이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="myorder">
      <table>
        <thead>
          <tr>
            {['주문번호', '주문날짜', '상품명', '배송지', '총 결제금액'].map((th) => (
              <th key={th}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order) => (
            <tr
              key={order.id}
              onClick={() => onOrderClick?.(order.id)}
              style={{ cursor: onOrderClick ? 'pointer' : 'default' }}
            >
              <td className="td">{order.id}</td>
              <td className="td">{formatDate(order.regDate)}</td>
              <td className="td align-left">
                <div className="order-product-info">
                  <img
                    src={order.firstProductImgUrl}
                    alt={order.firstProductName}
                    className="order-product-thumb"
                  />
                  <span>{formatProductCount(order.firstProductName, order.totalProductCount)}</span>
                </div>
              </td>
              <td className="td">{order.address}</td>
              <td className="td strong">{formatPrice(order.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination" role="navigation" aria-label="페이지네이션">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          aria-label="이전 페이지"
        >
          ‹
        </button>

        <div className="page-list">
          {pageItems.map((it, idx) =>
            it === '...' ? (
              <span key={`dots-${idx}`} className="page-num dots">…</span>
            ) : (
              <button
                key={it}
                className={`page-num ${currentPage === it ? 'active' : ''}`}
                onClick={() => setCurrentPage(it)}
                aria-current={currentPage === it ? 'page' : undefined}
              >
                {it}
              </button>
            )
          )}
        </div>

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          aria-label="다음 페이지"
        >
          ›
        </button>
      </div>
    </div>
  );
}
