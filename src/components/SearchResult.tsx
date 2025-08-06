import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/Types.ts';
import { searchProducts, getLoggedInUser } from '../api/Api.ts';
import Header from './Common.tsx';
import '../css/search_result.css';
import { LoginUser } from '../types/Types.ts';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<LoginUser | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const navigate = useNavigate();

  useEffect(() => {
    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    searchProducts(query)
      .then((res) => {
        setResults(res);
      })
      .catch(() => {
        setError('검색 중 오류가 발생했습니다.');
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <Header
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <div className="search-result-container">
        <h2>검색 결과: "{query}"</h2>

        {loading && <p className="info-message">검색 중...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="info-message">검색 결과가 없습니다.</p>
        )}

        {!loading && results.length > 0 && (
          <ul className="product-list">
            {results.map((item) => (
              <li key={item.id}>
                <div className="product-image-wrapper">
                  <img
                    src={item.imgUrl}
                    alt={item.altText || item.nm}
                    loading="lazy"
                    onClick={() => navigate(`/productDetail/${item.id}`)}
                  />
                </div>
                <h3 className="product-name">{item.nm}</h3>
                <p className="product-price">{item.price?.toLocaleString()}원</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchResult;
