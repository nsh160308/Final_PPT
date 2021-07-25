import React from 'react'
import { Carousel} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { BrowserRouter as Link } from "react-router-dom";
import '../../App.css';
import './Sections/Footer.css';

function DefaultPage(props) {
    return (
        <div>
            <Carousel autoplay>
                <div className="img1">
                    <div className="content">
                        <h1 style={{color:"dimgray"}}>환영합니다!</h1>
                        <h3 style={{color:"darkslategray"}}>
                            <strong>
                                'Noh : C'는 <br/>쇼핑과 영상을<br/>함께<br/>즐길 수 있어요!
                            </strong>
                        </h3>
                    </div>
                    <div className="img-cover">
                    </div>
                </div>
                <div className="img2">
                    <Link to="Shop">
                        <div className="content">
                            <h1 style={{color:"darkslategray"}}>
                                <strong>쇼핑<br/>하러가기!</strong> 
                                <SmileOutlined />
                            </h1>
                        </div>
                        <div className="img-cover">
                        </div>
                    </Link>
                </div>
                <div className="img3">
                    <Link to="Mytube">
                        <div className="content">
                            <h1 style={{color:"black"}}>
                                <strong>20 F/W, 21 S/S<br/>
                                LookBook 영상
                                </strong>
                            </h1>
                        </div>
                        <div className="img-cover">
                        </div>
                    </Link>
                </div>
            </Carousel>
        {/* Footer */}
        <div className="footer" style={{padding:"20px"}}>
            <div className="outer-margin">
                <div className="footer-info">
                    <div className="footer-helpdesk">
                        <h3 className="desk-number">010 0000 0000</h3>
                        <div className="desk-info">
                            문자 메세지 수신불가 / 카톡 상담, Q & A 게시판 이용<br />
                            10:00 AM ~ 4:00 PM (Lunch time 12:00 PM ~ 1:00 PM)<br />
                            토,일요일 및 공휴일 휴무
                        </div>
                        <div className="desk-links">
                            <a href="#"><strong>개인정보취급방침</strong></a>
                            <a href="#">약관</a>
                            <a href="#">자주묻는질문</a>
                            <a href="#">문의게시판</a>
                        </div>
                    </div>
                    <div className="footer-menu">
                        <div className="item account">
                            <div className="title">My Account</div>
                            <ul>
                            <li><a href="#">마이페이지</a></li>
                            <li><a href="#">주문내역</a></li>
                            <li><a href="#">회원등급 및 혜택</a></li>
                            </ul>
                        </div>
                        <div className="item shipping-returns">
                            <div className="title">Shipping & Returns</div>
                            <ul>
                            <li><a href="#">문의게시판</a></li>
                            <li><a href="#">교환반품안내</a></li>
                            <li><a href="#" target="_blank">우체국택배 반품접수</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="corp-info">
                    <ul>
                        <li>상호: Noh:C </li>
                        <li>대표: 노승환</li>
                        <li></li>
                        <li>사업자등록번호: <a href="#" target="_blank">000-00-00000</a></li>
                        <li>통신판매업신고번호: 제2021-성남분당-0000호 </li>
                        <li>개인정보담당자: 노승환 <a href="#"> business160308@gmail.com</a></li>
                    </ul>
                    <ul>
                        <li>반품주소: </li>
                        <li>입금계좌: KR한국은행 000000-00-0000000 노승환</li>
                    </ul>
                </div>
                <div className="copyright">
                    &copy; 2021 Noh:C, Inc. All rights reserved.
                </div>
            </div>
            {/* outer-margin End. */}
        </div>
        {/* Footer End. */}
    </div>
    )
}

export default DefaultPage
