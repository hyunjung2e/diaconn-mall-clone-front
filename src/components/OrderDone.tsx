import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderDone: React.FC = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/');
  };

  const handleOrderList = () => {
    navigate('/myorder');
  };

  const buttonStyle = {
    flex: 1,
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  };

  return (
    <div className="body">
      <div
        style={{
          width: '35%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '80px',
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          결제가 완료되었습니다
        </div>
        <div
          style={{
            display: 'flex',
            gap: '15px',
            width: '80%',
          }}
        >
          <button
            style={{
              ...buttonStyle,
              backgroundColor: '#f0f0f0',
              color: '#333',
            }}
            onClick={handleHome}
          >
            홈으로
          </button>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: '#1fc4bf',
              color: 'white',
            }}
            onClick={handleOrderList}
          >
            주문내역 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDone;
