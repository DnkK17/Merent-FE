import React from 'react';
import { Layout, Menu, Row, Col, Card, Input, Button } from 'antd';
import './HomePage.css';
import logoPage from "../HomePage/images/logoPage.png";
import studioPage from "../HomePage/images/studioPage.png";
import newBackground from '../HomePage/images/newBackground.png';
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
  { id: 1, name: 'Body Sony A6400', price: '550,000đ', imgSrc: sony },
  { id: 2, name: 'Body Sony ZV-E10', price: '700,000đ', imgSrc: sony },
  { id: 3, name: 'Body Sony A7III', price: '800,000đ', imgSrc: sony },
  { id: 4, name: 'Gimbal DJI RS 2 Pro', price: '400,000đ', imgSrc: sony },
  { id: 5, name: 'Gimbal DJI RSC 2', price: '250,000đ', imgSrc: sony },
  { id: 6, name: 'DJI Mavic Mini 2', price: '900,000đ', imgSrc: sony },
  { id: 7, name: 'Gimbal DJI RSC 2', price: '250,000đ', imgSrc: sony },
  { id: 8, name: 'Gimbal DJI RSC 2', price: '250,000đ', imgSrc: sony },
  
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
      
        <div className='home-studio'>
            <img src={newBackground}></img>
        </div>
      {/* Main Content */}
      <Content style={{ padding: '0 50px' }}>
       <div className='product-example'>
      <Row gutter={[16, 16]} justify="center">
            {productExample.map(product => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card  className="custom-card" hoverable cover={<img className="camera-sony" alt={product.name} src={product.imgSrc} />}>
                  <Card.Meta title={product.name} description={product.price} />
                </Card>
              </Col>
            ))}
          </Row>
          </div>
        
        {/*Product*/}
        <div className="site-product-section">
          <h2 className="section-title">Sản Phẩm Thuê Nhiều</h2>
          <Row gutter={[2, 99]} justify="center">
            {products.map(product => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card className="custom-card"  hoverable cover={<img alt={product.name} src={product.imgSrc} />}>
                  <Card.Meta title={product.name} description={product.price} />
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
