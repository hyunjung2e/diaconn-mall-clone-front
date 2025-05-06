import React, { useState } from 'react';
import '../css/category.css';

const CategoryPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<string>('best');

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
    };

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

            <div className="category-container">
                <div className="filter-toggle">
                    <button
                        className={`filter-btn ${activeFilter === 'best' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('best')}
                        data-filter="best"
                    >
                        베스트
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'popular' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('popular')}
                        data-filter="popular"
                    >
                        상품순
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'price' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('price')}
                        data-filter="price"
                    >
                        가격순
                    </button>
                </div>

                <div className="product-list">
                    <div className="product">
                        <img src="image.png" alt="상품 이미지" />
                        <h3>상품 제목</h3>
                        <p>₩20,000</p>
                    </div>
                    <div className="product">
                        <img src="image.png" alt="상품 이미지" />
                        <h3>상품 제목</h3>
                        <p>₩25,000</p>
                    </div>
                    <div className="product">
                        <img src="image.png" alt="상품 이미지" />
                        <h3>상품 제목</h3>
                        <p>₩30,000</p>
                    </div>
                </div>
            </div>

            <footer>
                <p>© 2025 쇼핑몰. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CategoryPage;
