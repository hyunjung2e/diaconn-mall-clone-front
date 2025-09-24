import React, { useState } from 'react';
import FilterWidget from './FilterWidget.tsx';
import Pagination from './Pagination.tsx';
import Header from './Common.tsx';
import '../css/myorder.css';
import '../css/filterwidget.css';

interface Order {
  orderId: string;
  date: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
}

export default function MyOrder() {
  const [user] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    console.log('검색 실행:', trimmed);
  };

  const handleCategory = (categoryId: string) => {
    console.log('선택된 카테고리:', categoryId);
  };

  const [orders] = useState<Order[]>([
    {
      orderId: 'ORD12345',
      date: '2025-03-25',
      productName: '상품1',
      quantity: 2,
      price: 5000,
      total: 10000,
      status: '배송중',
    },
    {
      orderId: 'ORD12346',
      date: '2025-03-26',
      productName: '상품2',
      quantity: 1,
      price: 15000,
      total: 15000,
      status: '배송완료',
    },
    {
      orderId: 'ORD12347',
      date: '2025-03-27',
      productName: '상품3',
      quantity: 3,
      price: 2000,
      total: 6000,
      status: '배송중',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // YYYY-MM-DD 형식으로 변환하는 함수
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식 반환
  };

  // 페이지네이션 함수
  const paginate = <T,>(
    items: T[],
    currentPage: number,
    itemsPerPage: number
  ): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
      <>
      <Header
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <nav
        className="menu"
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <a onClick={() => handleCategory('0')}>간편식</a>
        <a onClick={() => handleCategory('1')}>식단</a>
        <a onClick={() => handleCategory('2')}>음료</a>
        <a onClick={() => handleCategory('3')}>의료기기</a>
      </nav>
      
     <div style={{ minWidth: '750px', padding: '20px' }}>

      <FilterWidget
        onFilter={function (filters: any): void {
          throw new Error('Function not implemented.');
        }}
      />
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        주문내역
      </h2>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              주문 ID
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              주문 날짜
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              상품명
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              수량
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              단가 (원)
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              총액 (원)
            </th>
            <th
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              처리상태
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                {order.orderId}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                {order.date}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                {order.productName}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                {order.quantity}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                {order.price.toLocaleString()}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                {order.total.toLocaleString()}
              </td>
              <td
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                {order.status.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        currentPage={0}
      />
    </div>
    </>
  );
}
