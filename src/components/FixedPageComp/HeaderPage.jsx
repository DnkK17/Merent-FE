import React from 'react';
import { Layout, Menu, Row, Col, Card, Input, Button } from 'antd';
import './FixedComp.css';
import { useNavigate } from 'react-router-dom';
import logoPage from "../HomePage/images/logoPage.png";
const { Header, Content, Footer } = Layout;
const menuItems = [
    { label: 'GIỚI THIỆU', key: 'About' },
    { label: 'CHO THUÊ MÁY ẢNH', key: 'Rent' },
    { label: 'DỊCH VỤ', key: 'Services' },
    { label: 'BÁO GIÁ', key: 'Pricing' },
    { label: 'WORKSHOP VIDEO', key: 'Workshop' },
    { label: 'COMBO', key: 'Combo' },
    { label: 'GIỎ HÀNG', key: 'Cart' },
  { label: 'ĐĂNG NHẬP', key: 'Login' },
  ];


function HeaderPage(){
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
  };
    return(
        <Layout className='layout'>
        <a href='/' className='page-logo'>
        <img src={logoPage} ></img>
      </a>
        <div className='Menu'>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['']}
          items={menuItems}
          onClick={handleMenuClick}
        />
        </div>
        </Layout>
    );
};
export default HeaderPage;