import '../css/signup.css';
import '../css/main.css';
import { register, checkEmailDuplicate, getLoggedInUser } from '../api/Api.ts';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Common.tsx';
import { LoginUser } from '../types/Types.ts';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
    address: '',
  });

  const [user, setUser] = useState<LoginUser | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categoryId, setCategoryId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getLoggedInUser()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => setUser(null));
  }, [categoryId]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleCategory = (categoryId: string) => {
    setCategoryId(categoryId);
    navigate(`/${categoryId}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = '이름을 입력하세요';
    if (!formData.email) newErrors.email = '이메일을 입력하세요';
    if (!formData.phone) newErrors.phone = '휴대폰 번호를 입력하세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요';
    if (!formData.password2) newErrors.password2 = '비밀번호 확인을 입력하세요';
    if (formData.password !== formData.password2)
      newErrors.password2 = '비밀번호가 일치하지 않습니다.';
    if (!formData.address) newErrors.address = '주소를 입력하세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckEmail = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const result = await checkEmailDuplicate(formData.email);
      alert(result.message);
      if (result.isDuplicate === false) handleOpenModal(); // 인증번호 모달 열기
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await register(formData);
        console.log('회원가입 성공:', response);
        alert('회원가입이 완료되었습니다!');
        navigate('/login');
      } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  // 인증번호 입력
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCode('');
  };

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

      <div className="body">
        <div className="signup-box">
          <h2 className="signup-title">회원가입</h2>

          <form className="signup-submit" onSubmit={handleSubmit}>
            {/* 이름 */}
            <div>
              <label className="signup-label">이름</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="signup-input"
              />
              {errors.name && <p className="signup-error">{errors.name}</p>}
            </div>

            {/* 이메일 */}
            <div>
              <label className="signup-label">이메일</label>
              <div className="signup-email-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="signup-email-input"
                />
                <button type="button" onClick={handleCheckEmail} className="signup-email-button">
                  이메일 중복검사
                </button>
              </div>
              {errors.email && <p className="signup-error">{errors.email}</p>}
            </div>

            {/* 휴대폰번호 */}
            <div>
              <label className="signup-label">휴대폰번호</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="signup-input"
              />
              {errors.phone && <p className="signup-error">{errors.phone}</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="signup-label">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="signup-input"
              />
              {errors.password && <p className="signup-error">{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="signup-label">비밀번호 확인</label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                className="signup-input"
              />
              {errors.password2 && <p className="signup-error">{errors.password2}</p>}
            </div>

            {/* 주소 */}
            <div>
              <label className="signup-label">주소</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="signup-input"
              />
              {errors.address && <p className="signup-error">{errors.address}</p>}
            </div>

            {/* 이메일 인증번호 모달창 */}
            {isModalOpen && (
              <div className="modal-overlay" onClick={handleCloseModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3 className="modal-title">인증번호 입력</h3>
                  <input
                    type="tel"
                    className="modal-input"
                    placeholder="이메일로 전달받은 인증번호를 입력해주세요."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <div className="modal-actions">
                    <button className="modal-button secondary" onClick={handleCloseModal}>
                      취소
                    </button>
                    <button className="modal-button primary" onClick={() => alert('구현 예정')}>
                      인증
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="signup-submit-button">
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
