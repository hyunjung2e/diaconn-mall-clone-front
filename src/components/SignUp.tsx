import React from 'react';
import '../css/signup.css';
import '../css/main.css';
import {
  register,
  checkEmailDuplicate,
  getLoggedInUser,
  sendEmailAuthCode,
  verifyEmailAuthCode,
} from '../api/Api.ts';
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
    code: '',
  });

  const [user, setUser] = useState<LoginUser | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categoryId, setCategoryId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태
  const [timer, setTimer] = useState<number>(0); // 인증번호 유효시간(초)
  const TIMER_DURATION = 180; // 유효시간(초)
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
    if (!isEmailVerified) newErrors.email = '이메일 인증을 완료해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 이메일 중복 체크 및 인증번호 발송
  const handleCheckEmail = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const result = await checkEmailDuplicate(formData.email);
      console.log('이메일 중복 체크 결과:', result);
      alert(result.message);
      if (result.isDuplicate === false) {
        handleOpenModal();
        await sendEmailAuthCode(formData.email); // 인증번호 발송
      }
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 인증번호 검증
  const handleAuthCode = async (code: string) => {
    if (!code.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    try {
      const data = await verifyEmailAuthCode(formData.email, code);
      console.log('인증번호 검증 결과:', data);
      alert(data.message);
      setIsEmailVerified(true); // 인증 성공 상태로 변경
      handleCloseModal();
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    }
  };

  // 회원가입 제출
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
    setTimer(TIMER_DURATION); // 모달 표시 직전, 게이지를 가득 찬 상태로 설정
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCode('');
    setTimer(0);
  };

  // 모달 열리면 유효시간 카운트 시작
  useEffect(() => {
    if (!isModalOpen) return;

    // 1초마다 실행할 일을 intervalId 함수에 예약
    const intervalId = window.setInterval(() => {
      setTimer((prev) => {
        // 남은시간 1초 이하일 경우
        if (prev <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 클린업 함수: unmount 되거나 isModalOpen 상태 변경 시 실행
    // 즉, 모달 닫힐 때(isModalOpen == false) 타이머도 정리
    return () => window.clearInterval(intervalId);
  }, [isModalOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${secs}`;
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
                    type="text"
                    name="code"
                    value={formData.code}
                    className="modal-input"
                    placeholder="이메일로 전달받은 인증번호를 입력해주세요."
                    onChange={handleChange}
                  />
                  <p className="modal-timer">유효시간: {formatTime(timer)}</p>
                  <div
                    className="modal-progress"
                    role="progressbar"
                    aria-label="남은 시간 진행 상태"
                    aria-valuemin={0}
                    aria-valuemax={TIMER_DURATION}
                    aria-valuenow={timer}
                  >
                    <div
                      className="modal-progress-bar"
                      style={{
                        width: `${Math.max(0, Math.min(100, (timer / TIMER_DURATION) * 100))}%`,
                      }}
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="modal-button secondary"
                      onClick={handleCloseModal}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="modal-button primary"
                      onClick={() => handleAuthCode(formData.code)}
                    >
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
