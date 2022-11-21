import React from 'react';
import '../../../../css/signup_login.scoped.css';
import { AuthGlobalStyles } from '../../../../globals';
import logo from '../../../../assets/images/signup_login/logo.svg';
import googlesvg from '../../../../assets/images/signup_login/google.svg';
import kakaosvg from '../../../../assets/images/signup_login/kakao.svg';
import naversvg from '../../../../assets/images/signup_login/naver.svg';
import warningsvg from '../../../../assets/images/signup_login/icon-warning.svg';
import iconview1 from '../../../../assets/images/signup_login/icon-view1.svg';
import { Link } from 'react-router-dom';

const SignupMainPresenter = () => {
  return (
    <>
      <AuthGlobalStyles />
      <div id="wrap">
        <header id="header" />
        <main>
          <div id="container2">
            <div className="title-wrap">
              <a href="front-login.html" className="title-logo">
                <img src={logo} alt="" />
              </a>
              <h4>회원가입을 해주셔서 감사합니다.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                  <h4>소셜 간편 가입</h4>
                  <span />
                </div>
                <div className="social-signup">
                  <button className="google">
                    <img src={googlesvg} alt="" />
                    <span>구글 계정으로 회원가입</span>
                  </button>
                  <button className="kakao">
                    <img src={kakaosvg} alt="" />
                    <span>카카오 계정으로 회원가입</span>
                  </button>
                  <button className="naver">
                    <img src={naversvg} alt="" />
                    <span>네이버 계정으로 회원가입</span>
                  </button>
                </div>
                <div className="login-title">
                  <span />
                  <p>또는</p>
                  <span />
                </div>
              </li>
              <li>
                <div className="login-title">
                  <span />
                  <h4>회원 정보를 입력하세요.</h4>
                  <span />
                </div>
                <div className="login-text">
                  <p>*는 필수 입력 정보입니다.</p>
                </div>
              </li>
              <li>
                <div className="login-input-wrap">
                  <div className="login-input-check">
                    <div className="left">
                      <input
                        type="text"
                        id="login-id"
                        required
                        className="check-data"
                      />
                      <label htmlFor="login-id">
                        <span className="star">*</span> 이메일
                      </label>
                      <span className="check-result">사용 가능</span>
                    </div>
                    <button>중복체크</button>
                  </div>
                  <div className="warning">
                    <img src={warningsvg} alt="" />
                    <span> 이메일을 입력하세요.</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="login-input-wrap">
                  <div className="login-input-check">
                    <div className="left">
                      <input
                        type="text"
                        id="login-id"
                        required
                        className="check-data"
                      />
                      <label htmlFor="login-id">
                        <span className="star">*</span> 아이디{' '}
                        <span className="small">(6-12자 이내 영문/숫자)</span>
                      </label>
                      <span className="check-result">사용 가능</span>
                    </div>
                    <button>중복체크</button>
                  </div>
                  <div className="warning">
                    <img src={warningsvg} alt="" />
                    <span> 아이디를 입력하세요.</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="login-input-wrap">
                  <input type="password" id="login-pw" required />
                  <label htmlFor="login-pw">
                    <span className="star">*</span> 비밀번호{' '}
                    <span className="small">
                      (8-20자 이내 영문/숫자/특수문자)
                    </span>
                  </label>
                  <img className="pw-view" src={iconview1} alt="" />
                  {/* <img className="pw-view" src="../assets/images/signup_login/icon-view2.svg" alt=""> */}
                  <div className="warning">
                    <img src={warningsvg} alt="" />
                    <span> 비밀번호를 입력하세요.</span>
                  </div>
                  {/* <div className="warning"><img src={warningsvg} alt=""><span> 비밀번호는 최소 8자 이상입니다.</span></div>
                            <div className="warning"><img src={warningsvg} alt=""><span> 아이디를 입력하세요.</span></div> */}
                </div>
              </li>
              <li>
                <div className="login-input-wrap">
                  <input type="password" id="login-pw" required />
                  <label htmlFor="login-pw">
                    <span className="star">*</span> 비밀번호 확인
                  </label>
                  <img className="pw-view" src={iconview1} alt="" />
                  {/* <img className="pw-view" src="../assets/images/signup_login/icon-view2.svg" alt="">*/}
                  <div className="warning">
                    <img src={warningsvg} alt="" />
                    <span> 비밀번호를 입력하세요.</span>
                  </div>
                  {/* <div className="warning"><img src={warningsvg} alt=""><span> 비밀번호는 최소 8자 이상입니다.</span></div>
                            <div className="warning"><img src={warningsvg} alt=""><span> 아이디를 입력하세요.</span></div> */}
                </div>
              </li>
              <li>
                <div className="login-input-wrap">
                  <input type="text" id="login-id" required />
                  <label htmlFor="login-id">
                    <span className="star">*</span> 이름
                  </label>
                  <div className="warning">
                    <img src={warningsvg} alt="" />
                    <span> 이름을 입력하세요.</span>
                  </div>
                </div>
              </li>
              <li>
                <div className="login-title">
                  <span />
                  <h4>추가 정보를 입력하세요.</h4>
                  <span />
                </div>
                <div className="login-text">
                  <p>*는 필수 입력 정보입니다.</p>
                </div>
                <div className="login-text">
                  <p>
                    더 나은 서비스 제공을 위해 <br />
                    가입경로 및 가입사유를 제공받고 있습니다.
                  </p>
                </div>
              </li>
              <li>
                <div className="login-title">
                  <h4>
                    <span className="star">*</span> 가입경로(복수 선택 가능)
                  </h4>
                </div>
                <div className="signup-board">
                  <ul className="checkbox-wrap">
                    <li className="checkbox-wrap">
                      <input type="checkbox" id="signup-path1" />
                      <label htmlFor="signup-path1">
                        <span>홈페이지</span>
                      </label>
                    </li>
                    <li className="checkbox-wrap">
                      <input type="checkbox" id="signup-path1" />
                      <label htmlFor="signup-path1">
                        <span>SNS</span>
                      </label>
                    </li>
                    <li className="checkbox-wrap">
                      <input type="checkbox" id="signup-path1" />
                      <label htmlFor="signup-path1">
                        <span>광고</span>
                      </label>
                    </li>
                    <li className="checkbox-wrap">
                      <input type="checkbox" id="signup-path1" />
                      <label htmlFor="signup-path1">
                        <span>블로그</span>
                      </label>
                    </li>
                  </ul>
                  <ul className="checkbox-wrap">
                    <li className="checkbox-wrap">
                      <input type="checkbox" id="signup-path1" />
                      <label htmlFor="signup-path1">
                        <span>지인추천</span>
                      </label>
                    </li>
                    <li className="checkbox-wrap">
                      <input type="checkbox" id="signup-path1" />
                      <label htmlFor="signup-path1">
                        <span>인터넷 검색</span>
                      </label>
                    </li>
                    <li className="checkbox-wrap">
                      <input type="checkbox" id="signup-path1" />
                      <label htmlFor="signup-path1">
                        <span>협력업체</span>
                      </label>
                    </li>
                  </ul>
                  <ul className="checkbox-wrap">
                    <li className="checkbox-wrap">
                      <input type="checkbox" id="signup-path1" />
                      <label htmlFor="signup-path1">
                        <span>기타 (직접입력)</span>
                      </label>
                      <input type="text" />
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="login-title">
                  <h4>
                    <span className="star">*</span> 가입사유
                  </h4>
                </div>
                <div className="signup-board2">
                  <textarea name="" id="" cols={30} rows={10} />
                </div>
              </li>
              <li className="service-agree">
                <div className="checkbox-wrap">
                  <input type="checkbox" id="service-agree1" />
                  <label htmlFor="service-agree1">
                    <span>
                      <Link to={'/'}>서비스 이용약관</Link>에 동의합니다.
                    </span>
                  </label>
                </div>
                <div className="checkbox-wrap">
                  <input type="checkbox" id="service-agree2" />
                  <label htmlFor="service-agree2">
                    <span>
                      <Link to={'/'}>개인정보 처리방침</Link>에 동의합니다.
                    </span>
                  </label>
                </div>
                <div className="checkbox-wrap">
                  <input type="checkbox" id="service-agree3" />
                  <label htmlFor="service-agree3">
                    <span>
                      <Link to={'/'}>개인정보 수집 및 이용</Link>에 동의합니다.
                    </span>
                  </label>
                </div>
              </li>
              <li className="login-btn-wrap">
                <button className="confirmation2">회원가입</button>
              </li>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="logout-wrap">
                <p>이미 계정이 있으세요?</p>
                <a href="front-login.html" className="login">
                  로그인
                </a>
              </li>
            </ul>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default SignupMainPresenter;
