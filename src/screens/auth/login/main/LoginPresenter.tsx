import React from 'react';
import '../../../../css/signup_login.scoped.css';
import logotype from '../../../../assets/images/signup_login/logotype.svg';
import logo from '../../../../assets/images/signup_login/logo.svg';
import googlelogo from '../../../../assets/images/signup_login/google.svg';
import kakaologo from '../../../../assets/images/signup_login/kakao.svg';
import naverlogo from '../../../../assets/images/signup_login/naver.svg';
import iconwarning from '../../../../assets/images/signup_login/icon-warning.svg';
import iconview1 from '../../../../assets/images/signup_login/icon-view1.svg';
import iconautoinput1 from '../../../../assets/images/signup_login/icon-auto-input1.svg';
import iconautoinput2 from '../../../../assets/images/signup_login/icon-auto-input2.svg';
import { Link } from 'react-router-dom';
import { AuthGlobalStyles } from '../../../../globals';

const LoginPresenter = () => {
  return (
    <>
      <AuthGlobalStyles />
      <div id="wrap">
        <main id="main">
          <section id="login-container">
            <article className="container-bg">
              <div className="login-wrap">
                <div className="login-left">
                  <p>
                    데이터로 새로운 <br />
                    미래를 펼치는
                  </p>
                  <div id="logotype">
                    <img src={logotype} alt="" />
                  </div>
                </div>
                <ul className="login-right">
                  <li>
                    <div id="logo">
                      <img src={logo} alt="" />
                    </div>
                  </li>
                  <li>
                    <div className="login-title">
                      <span />
                      <p>소셜 로그인</p>
                      <span />
                    </div>
                    <div className="social-login">
                      <button className="google">
                        <img src={googlelogo} alt="" />
                      </button>
                      <button className="kakao">
                        <img src={kakaologo} alt="" />
                      </button>
                      <button className="naver">
                        <img src={naverlogo} alt="" />
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="login-title">
                      <span />
                      <p>또는</p>
                      <span />
                    </div>
                    <div className="login-input-wrap">
                      <input type="text" id="login-id" required />
                      <label htmlFor="login-id">아이디</label>
                      <div className="warning">
                        <img src={iconwarning} alt="" />
                        <span> 아이디를 입력하세요.</span>
                      </div>
                    </div>
                    <div className="login-input-wrap">
                      <input type="password" id="login-pw" required />
                      <label htmlFor="login-pw">비밀번호</label>
                      <img className="pw-view" src={iconview1} alt="" />
                      {/* <img className="pw-view" src="../assets/images/signup_login/icon-view2.svg" alt=""> */}
                      <div className="warning">
                        <img src={iconwarning} alt="" />
                        <span> 비밀번호를 입력하세요.</span>
                      </div>
                      {/* <div className="warning"><img src={iconwarning} alt=""><span> 비밀번호는 최소 8자 이상입니다.</span></div>
                                  <div className="warning"><img src={iconwarning} alt=""><span> 아이디를 입력하세요.</span></div>  */}
                    </div>
                  </li>
                  <li className="auto-input">
                    <ul>
                      <li />
                      <li>
                        <button className="sound">
                          <img src={iconautoinput1} alt="" />
                          <span>음성듣기</span>
                        </button>
                        <button className="refresh">
                          <img src={iconautoinput2} alt="" />
                          <span>새로고침</span>
                        </button>
                      </li>
                    </ul>
                    <input type="text" placeholder="자동입력 방지" />
                  </li>
                  <li>
                    <ul className="checkbox-wrap2">
                      <li>
                        <input type="checkbox" id="save-id" />
                        <label htmlFor="save-id">아이디 저장</label>
                      </li>
                      <li>
                        <input type="checkbox" id="maintain-login" />
                        <label htmlFor="maintain-login">로그인 상태 유지</label>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <button className="login-btn">로그인</button>
                    {/* @click="login" */}
                    <button className="login-btn2">로그인</button>
                    <div className="login-option">
                      <Link to={'/'}>아이디 찾기</Link>
                      <span />
                      <Link to={'/'}>아이디 비밀번호 찾기</Link>
                      <span />
                      <Link to={'/'}>회원가입</Link>
                    </div>
                  </li>
                </ul>
              </div>
            </article>
          </section>
        </main>
      </div>
    </>
  );
};

export default LoginPresenter;
