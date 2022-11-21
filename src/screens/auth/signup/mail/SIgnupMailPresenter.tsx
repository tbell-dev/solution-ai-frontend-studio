import React from "react";
import "../../../../css/signup_login.scoped.css";
import logo from "../../../../assets/images/signup_login/logo.svg";
import { AuthGlobalStyles } from "../../../../globals";

const SignupMailPresenter = () => {
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
                </div>
              </li>
              <li className="mail-box">
                <div className="left">
                  <b>이메일 주소</b>
                </div>
                <div className="right">
                  <p>abc@abc.co.kr</p>
                </div>
              </li>
              <li className="login-text">
                <p>이메일로 회원가입 인증 메일이 발송되었습니다.</p>
                <p>인증 이후에 회원 가입이 완료됩니다.</p>
              </li>
              <li className="login-btn-wrap">
                <button className="confirmation2">인증메일 재발송하기</button>
              </li>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li className="logout-wrap">
                <button className="logout">
                  <span>로그아웃</span>
                </button>
              </li>
            </ul>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default SignupMailPresenter;
