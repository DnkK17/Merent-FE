import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import './FixedComp.css';
import { useNavigate } from 'react-router-dom';
import logoPage from "../HomePage/images/logoPage.png";

const { Header } = Layout;

function HeaderPage() {
  const navigate = useNavigate();
  const storedName = localStorage.getItem('name');
  console.log(storedName); // Sẽ hiển thị tên của người dùng
  const handleClick = () => {
    navigate('/'); // Điều hướng về trang chủ
  };
  const handleMenuClick = (e) => {
    if (e.key === 'Logout') {
      localStorage.removeItem('name');
      localStorage.removeItem('token');
      localStorage.removeItem('cartItems');
      navigate('/');
    } else {
      navigate(`/${e.key}`);
    }
  };

  const menuItems = [
    { label: 'GIỚI THIỆU', key: 'About' },
    { 
      label: 'CHO THUÊ MÁY ẢNH', 
      key: 'submenu', 
      children: [
        { label: 'Máy ảnh', key: 'Rent/Cameras' },
        { label: 'Ống kính', key: 'Rent/Lens' },
        { label: 'Ánh sáng', key: 'Rent/Lighting' },
      ],
    },
    { label: 'DỊCH VỤ',
      key: 'Services',
      children: [
        { label: 'Cho thuê studio', key: 'Services/Studio' }
        // { label: 'Chụp hình concept', key: 'Services/Concept' },
        // { label: 'Quay vlog', key: 'Services/Vlog' },
        // { label: 'Live stream', key: 'Services/Live-stream' },
      ],
    },
    { label: 'ĐIỀU KHOẢN', key: 'TermsOfUse' },
    { label: 'WORKSHOP', key: 'Workshop' },
    { label: 'COMBO', key: 'Combo' },
    { label: 'GIỎ HÀNG', key: 'Cart' },
     localStorage.getItem('name')?{
          label: `Hi, ${storedName}`,
          key: 'Profile',
          children: [
            { label: 'Thông tin cá nhân', key: 'Profile' },
            { label: 'Đăng xuất', key: 'Logout' },
          ],
        }
      : { label: 'ĐĂNG NHẬP', key: 'Login' }
  ];

  return (
    <Layout className='layout'>
     <div 
      className="page-logo flex items-center justify-center cursor-pointer" 
      onClick={handleClick}
    >
      <img src={logoPage} alt="Logo" />
    </div>
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
}

export default HeaderPage;
