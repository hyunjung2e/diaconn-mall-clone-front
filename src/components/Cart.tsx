import '../css/cart.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Common.tsx';
import { getCartItems, getLoggedInUser } from '../api/Api.ts';
import { CartItem, LoginUser } from '../types/Types.ts';

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getLoggedInUser()
      .then((data) => {
        setUser(data);
        console.log('로그인된 사용자:', data);
        return getCartItems(data.id);
      })
      .then((cartData) => {
        const items = cartData.map((item) => ({
          ...item,
          selected: false,
          quantity: item.count || 1,
        }));
        setCartItems(items);
      })
      .catch((err) => {
        console.error('장바구니 불러오기 실패', err);
      });
  }, []);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    setCartItems(cartItems.map((item) => ({ ...item, selected: newState })));
  };

  const handleItemSelect = (id: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleQuantityChange = (id: number, value: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: value } : item)));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => (item.selected ? total + item.price * item.quantity : total),
    0
  );

  return (
    <>
      <Header
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <nav className="menu">
        <a href="#">메뉴1</a>
        <a href="#">메뉴2</a>
        <a href="#">메뉴3</a>
        <a href="#">메뉴4</a>
      </nav>

      <main className="cart-container">
        <div className="cart-header">
          <input
            type="checkbox"
            id="select-all"
            className="select-all"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <label htmlFor="select-all">전체 선택</label>
        </div>

        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <input
                type="checkbox"
                className="item-select"
                checked={item.selected}
                onChange={() => handleItemSelect(item.id)}
              />
              <img src={item.imgUrl || '상품이미지.jpg'} alt="상품 이미지" />
              <div className="item-info">
                <p className="item-description">{item.description || item.nm}</p>
                <p className="item-price">₩{item.price.toLocaleString()}</p>
              </div>
              <div className="item-price-detail">
                <p className="price">₩{(item.price * item.quantity).toLocaleString()}</p>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  className="quantity"
                  onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <p className="total-price">총 금액: ₩{totalPrice.toLocaleString()}</p>
          <button className="checkout-btn">결제하기</button>
        </div>
      </main>

      <footer>
        <div className="container">© 2025 쇼핑몰. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Cart;
