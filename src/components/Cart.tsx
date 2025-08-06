import '../css/cart.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Common.tsx';
import { getCartItems, getLoggedInUser, deleteCartItem } from '../api/Api.ts';
import { CartItem, LoginUser } from '../types/Types.ts';

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getLoggedInUser()
      .then((data) => {
        if (!data || !data.id) {
          navigate(`/login?redirectTo=/cart`);
          return;
        }

        setUser(data);
        return getCartItems(data.id);
      })
      .then((cartData) => {
        if (!cartData) return;

        const items = cartData.map((item) => ({
          ...item,
          selected: false,
          quantity: item.count || 1,
        }));
        setCartItems(items);
      })
      .catch((err) => {
        console.error('장바구니 불러오기 실패', err);
        navigate(`/login?redirectTo=/cart`);
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
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, value) } : item))
    );
  };

  const increaseQuantity = (id: number) => {
    handleQuantityChange(id, getQuantity(id) + 1);
  };

  const decreaseQuantity = (id: number) => {
    handleQuantityChange(id, getQuantity(id) - 1);
  };

  const getQuantity = (id: number) => {
    return cartItems.find((item) => item.id === id)?.quantity || 1;
  };

  const handleDelete = (productId: number) => {
    if (!user) return;

    const confirmed = window.confirm('정말로 이 상품을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteCartItem(user.id, productId)
      .then(() => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      })
      .catch((err) => {
        console.error('삭제 실패:', err);
        alert('상품 삭제에 실패했습니다.');
      });
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  const handleOrder = () => {
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }

    navigate('/order', {
      state: {
        items: selectedItems,
      },
    });
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
        <a onClick={() => handleCategory('0')}>간편식</a>
        <a onClick={() => handleCategory('1')}>식단</a>
        <a onClick={() => handleCategory('2')}>음료</a>
        <a onClick={() => handleCategory('3')}>의료기기</a>
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
                <div className="quantity-control">
                  <button className="quantity-btn" onClick={() => decreaseQuantity(item.id)}>
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    className="quantity"
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  />
                  <button className="quantity-btn" onClick={() => increaseQuantity(item.id)}>
                    +
                  </button>
                </div>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                삭제
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <p className="total-price">총 금액: ₩{totalPrice.toLocaleString()}</p>
          <button className="checkout-btn" onClick={handleOrder}>
            주문하기
          </button>
        </div>
      </main>

      <footer>
        <div className="container">© 2025 쇼핑몰. All rights reserved.</div>
      </footer>
    </>
  );
};

export default Cart;
