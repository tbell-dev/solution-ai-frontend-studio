import React from 'react';
import '../../css/sslo/sslo_common.scoped.css';
import '../../css/sslo/sslo_main.scoped.css';
import sslologo from '../../assets/images/sslo/main-sslo-logo.svg';
import { Link } from 'react-router-dom';

const SsloFooter = () => {
  return (
    <footer id="footer">
      <div className="footer-text" id="container">
        <div className="footer-left">
          <img src={sslologo} alt="" />
        </div>
        <div className="footer-right">
          <ul className="personal">
            <li>
              <Link to={'/'}>서비스 이용약관</Link>
            </li>
            <li className="bar">|</li>
            <li>
              <Link to={'/'}>개인정보처리방침</Link>
            </li>
            <li className="bar">|</li>
            <li>
              <Link to={'/'}>개인정보 수집 및 이용</Link>
            </li>
            <li className="bar">|</li>
            <li>
              <Link to={'/'}>제휴문의</Link>
            </li>
          </ul>
          <div className="info">
            (주)티벨&nbsp;&nbsp;|&nbsp;&nbsp;서울특별시 강남구 강남대로 354, 9층
            (역삼동, 혜천빌딩) <br />
            대표이사 : 김종균 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            사업자등록번호 : 376-81-00089 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            Tel : 070.7777.9113 / 070.7777.6368
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Fax : 070.7610.7540
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; E-mail :
            staff@tbell.co.kr(미정) <br />
            Copyright ⓒ (주)티벨. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SsloFooter;
