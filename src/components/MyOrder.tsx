import React, { useState } from 'react';
import '../css/app.css';

interface Order {
  orderId: string;
  date: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export default function MyOrder() {
  // 주문 내역 예시 데이터
  const [orders] = useState<Order[]>([
    {
      orderId: 'ORD12345',
      date: '2025-03-25',
      productName: '상품1',
      quantity: 2,
      price: 5000,
      total: 10000,
    },
    {
      orderId: 'ORD12346',
      date: '2025-03-26',
      productName: '상품2',
      quantity: 1,
      price: 15000,
      total: 15000,
    },
    {
      orderId: 'ORD12347',
      date: '2025-03-27',
      productName: '상품3',
      quantity: 3,
      price: 2000,
      total: 6000,
    },
  ]);

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
