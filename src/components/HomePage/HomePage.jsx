import React from 'react';
import { Layout, Menu, Row, Col, Card, Input, Button } from 'antd';
import './HomePage.css';
import logoPage from "../HomePage/images/logoPage.png";
import studioPage from "../HomePage/images/studioPage.png";
import newBackground2 from '../HomePage/images/newBackground.png';
import camerasBackground from "../HomePage/images/camerasBackground.png"
import EOSR1 from "../HomePage/images/EOSR1.jpg"
import EOSR50 from "../HomePage/images/EOSR50.png"
import EOSR100 from "../HomePage/images/EOSR100.png"
import EOSR5 from "../HomePage/images/EOSR5.png"
import { Navigate, useNavigate } from 'react-router-dom';
import sony from "../HomePage/images/sony.jpg"
const { Header, Content, Footer } = Layout;

const menuItems = [
  { label: 'GIỚI THIỆU', key: 'about' },
  { label: 'CHO THUÊ MÁY ẢNH', key: 'rent' },
  { label: 'DỊCH VỤ', key: 'services' },
  { label: 'BÁO GIÁ', key: 'pricing' },
  { label: 'WORKSHOP VIDEO', key: 'workshop' },
  { label: 'COMBO', key: 'combo' },
  { label: 'GIỎ HÀNG', key: 'cart' },
{ label: 'ĐĂNG NHẬP', key: 'login' },
];

const products = [
  { id: 1, name: 'EOS R1', price: '550,000đ', imgSrc: EOSR1 },
  { id: 2, name: 'EOS R5 Mark II', price: '700,000đ', imgSrc: EOSR50 },
  { id: 3, name: 'EOS R100', price: '800,000đ', imgSrc: EOSR100 },
  { id: 4, name: 'EOS R50', price: '400,000đ', imgSrc: EOSR5 },

  
];

const productExample = [
    { id: 1, name: 'Body Sony A6400', price: '550,000đ', imgSrc: sony },
    { id: 2, name: 'Body Sony ZV-E10', price: '700,000đ', imgSrc: sony },
    { id: 3, name: 'Body Sony A7III', price: '800,000đ', imgSrc: sony },
    { id: 4, name: 'Gimbal DJI RS 2 Pro', price: '400,000đ', imgSrc: sony },
   
  ];
  
function HomePage() {
  return (
    <Layout className="layout">
      
        <div className='home-canon mx-auto'>
            <img src={newBackground2}></img>
        </div>
        <div className='home-camera mx-auto'>
            <img src={camerasBackground}></img>
        </div>
      {/* Main Content */}
      <Content style={{ padding: '0 50px' }}>
      
        
        {/*Product*/}
        <div className="site-product">
          <h2 className="section-titl">Sản Phẩm Được Ưa Chuộng  </h2>
          <Row gutter={[2, 99]} justify="center">
            {products.map(product => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card className="custom-cards"  cover={<img alt={product.name} src={product.imgSrc} />}>
                  <Card.Meta title={product.name}  />
                  
                </Card>
              </Col>
            ))}
          </Row>
        </div>

       
      </Content>

     
    </Layout>
  );
}

export default HomePage;
