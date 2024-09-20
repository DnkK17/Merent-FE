import React from 'react';
import { Layout, Menu, Row, Col, Card, Input, Button } from 'antd';
import './FixedComp.css';
import logoPage from "../HomePage/images/logoPage.png";
import studioPage from "../HomePage/images/studioPage.png";
import { Navigate, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

function FooterPage(){
    return(
        <Layout className='layout'>
        <div className="newsletter-section">
        <Row justify="center" align="middle">
          <Col span={12}>
            <Input placeholder="Địa chỉ email của bạn" />
          </Col>
          <Col span={4}>
            <Button type="primary">Nhận các cập nhật</Button>
          </Col>
        </Row>
      </div>


    <Footer className="footer">
    <Row className="footer-content" justify="center">
      <Col xs={24} md={6}>
        <h2 className="footer-title">MERENT</h2>
        <p></p>
        <button className="footer-btn">Get started</button>
      </Col>
     
      <Col xs={24} md={4}>
        <h3>Company</h3>
        <ul className="footer-list">
          <li>About Us</li>
          <li>Teams</li>
          <li>Contact Us</li>
        </ul>
      </Col>
    </Row>
    
  </Footer>
  </Layout>
    );
};
export default FooterPage;