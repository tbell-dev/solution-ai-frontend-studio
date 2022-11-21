import React from 'react';
import '../../css/sslo/sslo_main.scoped.css';
import '../../css/sslo/sslo_common.scoped.css';
import sslologo from '../../assets/images/sslo/main-sslo-logo.svg';
import sslologok from '../../assets/images/sslo/sslo-logo(k).svg';
import iconcheck from '../../assets/images/sslo/icon-check.svg';
import labeling01 from '../../assets/images/sslo/labeling01.png';
import buttonleft from '../../assets/images/sslo/button-left.png';
import buttonright from '../../assets/images/sslo/button-right.png';
import imageboxing from '../../assets/images/sslo/image-boxing.png';
import mouseover from '../../assets/images/sslo/mouseover.png';

const SsloMainPresenter = () => {
  return (
    <>
      <main id="main">
        {/* 메인 */}
        <div className="main-wrap">
          <div className="inner-text container">
            <h3>
              데이터로 새로운
              <br />
              미래를 펼치는
            </h3>
            <img src={sslologo} alt="" className="sslo-logo" />
          </div>
        </div>
        {/*  섹션1  */}
        <section className="section1 container">
          <h3>
            <img src={sslologok} alt="sslo-logo" />는
          </h3>
          <p>
            글로벌 시장을 선도하는 데이터 통합 플랫폼입니다.
            <br />
            전문 인력이 개발한 뛰어난 AI 기술력으로
            <br />
            데이터 가공 및 분석에 있어 획기적인 아이템을 제공합니다.
          </p>
          <div className="under-bar" />
        </section>
        {/*  섹션2  */}
        <section className="section2">
          <h2>
            <b>데이터 수집</b>에서
            <b>정제, 전처리, 분석, 가공, 시각화, 배포, 관리</b>까지! <br />
            원하는 기능을 <b>선택하여 활용 가능</b>합니다.
          </h2>
          {/*  슬라이드1  */}
          <div className="slide-wrap slide-wrap1 container">
            <h3>
              Data <br />
              Labeling
            </h3>
            <div className="content-box">
              <ul className="slide-text">
                <li>
                  <div className="text-top">
                    <h4>데이터 분석/가공</h4>
                    <b>
                      수동 · 반자동 라벨링을 통해 여러 분야의 정형 · 비정형
                      데이터를 편리한 작업 환경에서 체계적인 프로세스로 가공할
                      수 있어 효과적인 산출물을 제공합니다.
                    </b>
                  </div>
                  <ul className="check-list">
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>다양한 주석도구 제공</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>학습 데이터 셋 커스터마이징</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>가공 및 검수 단계 설정</p>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="text-top">
                    <h4>학습 데이터 셋 커스터마이징</h4>
                    <b>
                      모델 개발에 필요한 다양한 학습 데이터 셋 제공을 위해 파일
                      내의 클래스 값, 속성 값, 파일 형식, 파일 경로 등 고객이
                      원하는 데이터 셋으로 산출 가능합니다.
                    </b>
                  </div>
                  <ul className="check-list">
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>데이터 및 클래스 선택 추출</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>파일 형식 변환</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>파일 경로 변경</p>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="text-top">
                    <h4>인공지능 모델 배포</h4>
                    <b>
                      인공지능 개발에 따른 Auto-Labeling을 수행하며 개발된
                      인공지능 모델을 물체인식 인공지능 서비스로 배포하고 활용할
                      수 있도록 다운로드 형식으로 제공합니다.
                    </b>
                  </div>
                  <ul className="check-list">
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>텐서플로(TensorFlow)</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>파이토치(PyTorch)</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>오픈 뉴럴 네트워크 익스체인지(ONNX)</p>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="slide-img slide-img1">
                <li>
                  <img src={labeling01} alt="" />
                </li>
                <li>
                  <img src={labeling01} alt="" />
                </li>
                <li>
                  <img src={labeling01} alt="" />
                </li>
              </ul>
              <div className="slide-button slide-button1">
                <button className="button-left">
                  <img src={buttonleft} alt="" />
                </button>
                <button className="button-right">
                  <img src={buttonright} alt="" />
                </button>
              </div>
              <div className="slide-bar slide-bar1">
                <div className="slide-bar-box">
                  <div className="bar1" />
                  <div className="bar2" />
                  <div className="bar3" />
                </div>
              </div>
            </div>
          </div>
          {/*  슬라이드2  */}
          <div className="slide-wrap slide-wrap2 container">
            <h3>
              Data collection <br />& purification
            </h3>
            <div className="content-box">
              <ul className="slide-img slide-img2">
                <li>
                  <img src={labeling01} alt="" />
                </li>
                <li>
                  <img src="" alt="" />
                </li>
                <li>
                  <img src="" alt="" />
                </li>
              </ul>
              <div className="slide-button slide-button2">
                <button className="button-left">
                  <img src={buttonleft} alt="" />
                </button>
                <button className="button-right">
                  <img src={buttonright} alt="" />
                </button>
              </div>
              <div className="slide-bar slide-bar1">
                <div className="slide-bar-box">
                  <div className="bar1" />
                  <div className="bar2" />
                  <div className="bar3" />
                </div>
              </div>
              <ul className="slide-text">
                <li>
                  <div className="text-top">
                    <h4>데이터 수집</h4>
                    <b>
                      다양한 사이트의 데이터를 수집 플랫폼을 통해 수집 가능하며,
                      필요한 데이터는 수집 의뢰를 이용하여 저렴한 비용으로 빠른
                      시간 안에 수집할 수 있습니다.
                    </b>
                  </div>
                  <ul className="check-list">
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>고객 맞춤형 데이터 수집(포털, 쇼핑몰, SNS)</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>특성에 맞는 세분화된 분야 의뢰</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>필요한 데이터를 빠르게 수집</p>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="text-top">
                    <h4>데이터 정제</h4>
                    <b>
                      수집 완료 리스트에서 정제할 데이터를 선택하여 무효한
                      데이터나 중복되는 데이터를 제거하거나 개인 정보 비식별화
                      처리를 통해 핵심 데이터를 선정합니다.
                    </b>
                  </div>
                  <ul className="check-list">
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>무효 데이터 제거</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>중복 데이터 제거</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>개인 정보 비식별화</p>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="text-top">
                    <h4>데이터 전처리</h4>
                    <b>
                      수집 완료 리스트에서 전처리할 데이터를 선택하여 혼합된
                      카테고리를 분류하고, 필요한 데이터로 변환하거나 축소하는
                      작업을 거쳐 고품질의 데이터를 제공합니다.
                    </b>
                  </div>
                  <ul className="check-list">
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>데이터 분류(카테고리, 주제, 형식)</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>특성에 맞는 세분화된 분야 선택</p>
                    </li>
                    <li>
                      <img src={iconcheck} alt="" />
                      <p>필요한 데이터를 빠르게 수집</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* 섹션3 */}
        <section className="section3 container">
          <div className="title-box">
            <h3>SSLO Tools</h3>
            <p>더 효율적이고 편리해진 주석도구를 제공합니다.</p>
            <div className="under-bar" />
          </div>
          <ul className="tool-bar">
            {/* onClick="button(1)" */}
            <li className="toolbar1">Image</li>
            {/* onClick="button(2)" */}
            <li className="toolbar2">Text</li>
            {/* onClick="button(3)" */}
            <li className="toolbar3">Video</li>
            {/* onClick="button(4)" */}
            <li className="toolbar4">Voice</li>
          </ul>
          <div className="tool-slide">
            <div className="toolslide1">
              <img src={imageboxing} alt="" />
            </div>
            <div className="toolslide2">박스2</div>
            <div className="toolslide3">박스3</div>
            <div className="toolslide4">박스4</div>
          </div>
        </section>
        {/* 섹션4 */}
        <section className="section4">
          <div className="title-box">
            <h3>구축 사례</h3>
            <p>
              다양한 기업들이 통합 플랫폼을 이용하여 데이터 셋을 구축하였습니다.
            </p>
            <div className="under-bar" />
          </div>
          <ul className="img-box container">
            <li className="case1">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>스마트 팜</h4>
                <p>곰팡이균 분석 시스템</p>
                <b>Polygon</b>
              </div>
            </li>
            <li className="case2">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>맞춤형 헬스케어</h4>
                <p>자세인식 운동자세 교정 솔루션</p>
                <b>Boxing, Keypoint</b>
              </div>
            </li>
            <li className="case3">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>생활-패션</h4>
                <p>발사이즈 분석 수제화 플랫폼</p>
                <b>Point</b>
              </div>
            </li>
            <li className="case4">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>스마트 시티</h4>
                <p>교통약자 인식 시스템</p>
                <b>keypoint, Boxing</b>
              </div>
            </li>
            <li className="case5">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>생활-코스메틱</h4>
                <p>피부상태인식 초개인화 화장품 솔루션</p>
                <b>Polygon</b>
              </div>
            </li>
            <li className="case6">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>스마트 팜</h4>
                <p>가축 행동 및 상태 인식 시스템</p>
                <b>Keypoint, Boxing</b>
              </div>
            </li>
            <li className="case7">
              <div className="bg-box">
                <img src={mouseover} alt="mouse-over" />
              </div>
              <div className="content-box">
                <h4>스마트 공장</h4>
                <p>공정과정에서의 검수 자동화</p>
                <b>Line, Boxing, Polygon</b>
              </div>
            </li>
          </ul>
        </section>
        <section className="question">
          <p>궁금하신 사항은 문의하시면 상세히 답변드리겠습니다.</p>
          <a href="sub6.html">문의하기</a>
        </section>
      </main>
    </>
  );
};

export default SsloMainPresenter;
