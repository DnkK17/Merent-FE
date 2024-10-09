import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import './FixedComp.css';
import { useNavigate } from 'react-router-dom';
import logoPage from "../HomePage/images/logoPage.png";

const { Header } = Layout;
console.log(localStorage.getItem('name'));
function HeaderPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');

  useEffect(() => {

    const storedUsername = localStorage.getItem('name');
    if (storedUsername) {
      setName(storedUsername);
    }
  }, []); 

  const handleMenuClick = (e) => {
    if (e.key === 'Logout') {
      localStorage.removeItem('name');
      setName('');
      navigate('/');

    } else {
      // Navigate to other routes
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
        { label: 'Cho thuê studio', key: 'Services/Studio' },
        { label: 'Chụp hình concept', key: 'Services/Concept' },
        { label: 'Quay vlog', key: 'Services/Vlog' },
        { label: 'Live stream', key: 'Services/Live-stream' },
      ],
      },
    { label: 'ĐIỀU KHOẢN', key: 'TermsOfUse' },
    { label: 'WORKSHOP', key: 'Workshop' },
    { label: 'COMBO', key: 'Combo' },
    { label: 'GIỎ HÀNG', key: 'Cart' },
    name
    ? {
        label: `Hi, Khoi`,
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
      <a href='/' className='page-logo'>
        <img src={logoPage} alt="Logo" />
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
}

export default HeaderPage;
