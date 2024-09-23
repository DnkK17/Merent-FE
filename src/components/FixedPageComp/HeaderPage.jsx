import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import './FixedComp.css';
import { useNavigate } from 'react-router-dom';
import logoPage from "../HomePage/images/logoPage.png";

const { Header } = Layout;

function HeaderPage() {
  const navigate = useNavigate();

  // State để lưu trạng thái đăng nhập và tên người dùng
  const [name, setName] = useState('');

  useEffect(() => {
    // Lấy tên người dùng từ localStorage
    const storedUsername = localStorage.getItem('name');
    if (storedUsername) {
      setName(storedUsername);
    }
  }, []); // Chỉ chạy khi component được render lần đầu

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
  };

  // Cập nhật menuItems dựa trên trạng thái đăng nhập
  const menuItems = [
    { label: 'GIỚI THIỆU', key: 'About' },
    { label: 'CHO THUÊ MÁY ẢNH', key: 'Rent' },
    { label: 'DỊCH VỤ', key: 'Services' },
    { label: 'BÁO GIÁ', key: 'Pricing' },
    { label: 'WORKSHOP VIDEO', key: 'Workshop' },
    { label: 'COMBO', key: 'Combo' },
    { label: 'GIỎ HÀNG', key: 'Cart' },
    { 
      label: name ? `Hi, ${name}` : 'ĐĂNG NHẬP', 
      key: name ? 'Profile' : 'Login' 
    }
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
