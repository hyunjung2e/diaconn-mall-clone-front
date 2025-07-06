import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Product } from '../types/Types.ts';  
import { searchProducts } from '../api/Api.ts';

import '../css/search_result.css';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  return (
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
            <li key={item.id} className="product-item" onClick={() => navigate(`/productDetail/${item.id}`)}>
              <div className="product-name">{item.nm}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResult;
