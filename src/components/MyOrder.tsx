import React, { useMemo, useState } from 'react';
import '../css/myorder.css';
import '../css/filterwidget.css';

export interface Order {
  orderId: string;
  date: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
}

interface Props {
  orders?: Order[];
  itemsPerPage?: number;
  onRowClick?: (orderId: string) => void;
}

export default function MyOrder({
  orders: ordersProp,
  itemsPerPage = 5,
  onRowClick,
}: Props) {
  const demoOrders: Order[] = useMemo(
    () => [
      { orderId: 'ORD12345', date: '2025-03-25', productName: '상품1', quantity: 2, price: 5000, total: 10000, status: '배송중' },
      { orderId: 'ORD12346', date: '2025-03-26', productName: '상품2', quantity: 1, price: 15000, total: 15000, status: '배송완료' },
      { orderId: 'ORD12347', date: '2025-03-27', productName: '상품3', quantity: 3, price: 2000, total: 6000, status: '배송중' },
    ],
    []
  );

  const orders = ordersProp ?? demoOrders;

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

  return (
    <div className="myorder">

      <table>
        <thead>
          <tr>
            {['주문 ID','주문 날짜','상품명','수량','단가 (원)','총액 (원)','처리상태'].map((th) => (
              <th key={th}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order) => (
            <tr
              key={order.orderId}
              onClick={() => onRowClick?.(order.orderId)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <td className="td">{order.orderId}</td>
              <td className="td">{order.date}</td>
              <td className="td align-left">{order.productName}</td>
              <td className="td">{order.quantity}</td>
              <td className="td">{order.price.toLocaleString()}</td>
              <td className="td strong">{order.total.toLocaleString()}</td>
              <td className="td">{order.status}</td>
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
