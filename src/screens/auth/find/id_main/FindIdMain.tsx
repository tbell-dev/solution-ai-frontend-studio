import React from 'react';
import { AuthGlobalStyles } from '../../../../globals';
import logo from '../../../../assets/images/signup_login/logo.svg';
import iconWarning from '../../../../assets/images/signup_login/icon-warning.svg';
import '../../../../css/signup_login.scoped.css';
const FindIdMain = () => {
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
              <h4>회원정보상의 이메일을 입력하세요.</h4>
            </div>
            <ul>
              <li>
                <div className="login-title">
                  <span />
                </div>
              </li>
              <li>
                <div className="login-input-wrap">
                  <input type="text" id="login-id" required />
                  <label htmlFor="login-id">이메일</label>
                  <div className="warning">
                    <img src={iconWarning} alt="" />
                    <span> 이메일 주소를 입력하세요.</span>
                  </div>
                </div>
              </li>
              <li className="login-btn-wrap">
                <a href="front-login.html" className="cancel">
                  취소
                </a>
                <a href="front-reset-id-mail.html" className="confirmation">
                  확인
                </a>
              </li>
              <div className="login-title">
                <span />
              </div>
            </ul>

            <div className="contentbox">
              <div className="member-info">
                <p>
                  회원정보가 기억나지 않거나 이메일 주소가 불일치하여 <br />
                  아이디 찾기가 어려운 경우에는 관리자에게 문의해주세요. <br />
                  <b>관리자 이메일 : abc1234@tbell.co.kr</b>
                </p>
              </div>
            </div>
          </div>
        </main>
        <footer id="footer" />
      </div>
    </>
  );
};

export default FindIdMain;
