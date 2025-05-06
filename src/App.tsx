import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.tsx";
import SignUp from "./components/SignUp.tsx";
import Mypage from "./components/Mypage.tsx";
import MyOrder from "./components/MyOrder.tsx";
import OrderDone from "./components/OrderDone.tsx";
import Main from "./components/Main.tsx";
import Category from "./components/Category.tsx";
import Cart from "./components/Cart.tsx";
import Order from "./components/Order.tsx";
import ProductDetail from "./components/ProductDetail.tsx";
import "../src/css/app.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="body">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/main' element={<Main />}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/order' element={<Order/>}/>
          <Route path='/productDetail' element={<ProductDetail/>}/>
          <Route path='/category' element= {<Category/>}/>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/myorder" element={<MyOrder />} />
          <Route path="/orderdone" element={<OrderDone />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
