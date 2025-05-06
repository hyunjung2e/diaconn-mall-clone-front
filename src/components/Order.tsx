import React, { useState } from 'react';
import '../css/order.css';

const Order: React.FC = () => {
    const [products, setProducts] = useState([
        { id: 1, name: '상품명 1', price: 10000, quantity: 1 },
        { id: 2, name: '상품명 2', price: 20000, quantity: 1 },
    ]);

    const [recipient, setRecipient] = useState('아콘이');
    const [address, setAddress] = useState('서울시 강남구 테헤란로 123');
    const [phone, setPhone] = useState('010-1234-5678');
    const [message, setMessage] = useState('');

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setProducts(products.map(product => 
            product.id === id ? { ...product, quantity: newQuantity } : product
        ));
    };

    const totalPrice = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

    return (
        <div>
            <header>
                <div className="container">
                    <a href="#" className="logo">
                        <img src="./img/logo.png" alt="로고" />
                    </a>
                    <div className="header-right">
                        <input type="text" placeholder="검색어를 입력해주세요." />
                        <a href="#" className="login">로그인</a>
                        <a href="#" className="cart">장바구니</a>
                    </div>
                </div>
            </header>

            <nav className="menu">
                <a href="#">메뉴1</a>
                <a href="#">메뉴2</a>
                <a href="#">메뉴3</a>
                <a href="#">메뉴4</a>
            </nav>

            <div className="container">
                {products.map(product => (
                    <div className="order-list" key={product.id}>
                        <div><input type="checkbox" /></div>
                        <div><img src={`./img/product${product.id}.jpg`} alt="상품 이미지" /></div>
                        <div>{product.name}<br />가격: {product.price.toLocaleString()}원</div>
                        <div>{(product.price * product.quantity).toLocaleString()}원</div>
                        <div>
                            <input 
                                type="number" 
                                value={product.quantity} 
                                min="1" 
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                ))}

                <div className="order-info">받는이: {recipient}</div>
                <div className="order-info">주소: {address}</div>
                <div className="order-info">개인정보: {phone}</div>
                <div className="order-info">
                    <input 
                        type="text" 
                        placeholder="배송 메시지를 입력해주세요." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <div className="pay-button">
                    총 금액: {totalPrice.toLocaleString()}원 <button>결제하기</button>
                </div>
            </div>
        </div>
    );
};

export default Order;
