import React, { useState } from 'react';
import '../css/filterwidget.css';

export default function FilterWidget({
  onFilter,
}: {
  onFilter: (filters: any) => void;
}) {
  const [orderDate, setOrderDate] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');

  const applyFilters = () => {
    onFilter({ orderDate, price, status });
  };

  return (
    <div className="filter-widget-wrapper">
      <div style={{ display: 'flex' }}>
        <div className="p-4 w-full max-w-md border rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium filter-group">주문일자</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium filter-group">상품금액</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="상품금액 입력"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium filter-group">처리상태</label>
            <select
              className="w-full p-2 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">처리상태 선택</option>
              <option value="pending">대기중</option>
              <option value="shipped">배송중</option>
              <option value="delivered">배송완료</option>
            </select>
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="w-full p-2 bg-blue-500 text-white rounded filter-apply-btn"
        >
          필터 적용
        </button>
      </div>
    </div>
  );
}
