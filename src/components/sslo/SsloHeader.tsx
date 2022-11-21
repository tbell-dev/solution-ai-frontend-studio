import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sslologo from '../../assets/images/sslo/sslo-logo.svg';
import icnogoto from '../../assets/images/sslo/icon-goto.svg';
import '../../css/sslo/sslo_main.scoped.css';
import '../../css/sslo/sslo_common.scoped.css';

const SsloHeader = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleIsOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };
  return (
    <header id="sslo-header">
      <nav>
        <div className="gnb container">
          <div className="logobox">
            <Link to="/sslo/main">
              <img src={sslologo} alt="sslo-logo" />
            </Link>
          </div>
          <ul className="menubox">
            <li>
              <Link to="/sslo/service">서비스</Link>
            </li>
            <li>
              <Link to="/sslo/solution">솔루션</Link>
            </li>
            <li>
              <Link to="/sslo/price">가격</Link>
            </li>
            <li>
              <Link to="/sslo/company">회사소개</Link>
            </li>
            <li>
              <Link to="/sslo/notice">고객지원</Link>
            </li>
          </ul>
          <div className="loginbox">
            <ul>
              <li className="platform">
                <div className="goto">
                  <Link to="/dashboard/list">통합 플랫폼 바로가기</Link>
                  <img src={icnogoto} alt="" />
                </div>
              </li>
              <li className="login">
                <Link to="/login">로그인</Link>
                <div className="h-profile" onClick={toggleIsOpen} />
                {isOpen && (
                  <ul className="my-list">
                    <li>
                      <a href="qna-detail.html">문의내역</a>
                    </li>
                    <li>
                      <a href="personal-set.html">개인정보설정</a>
                    </li>
                    <li>
                      <button id="logout">
                        <span>로그아웃</span>
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SsloHeader;
