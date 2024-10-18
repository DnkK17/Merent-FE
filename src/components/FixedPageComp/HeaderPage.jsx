import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import './FixedComp.css';
import { useNavigate } from 'react-router-dom';
import logoPage from "../HomePage/images/logoPage.png";

const { Header } = Layout;

function HeaderPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const userID = localStorage.getItem('Id');
    if (userID) {
      fetch(`https://merent.uydev.id.vn/api/User/id?id=${userID}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setName(data.data.name);
            localStorage.setItem('name', data.data.name);
          }
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    } else {
      const storedUsername = localStorage.getItem('name');
      if (storedUsername) {
        setName(storedUsername);
      }
    }
  }, []); 

  const handleMenuClick = (e) => {
    if (e.key === 'Logout') {
      localStorage.removeItem('name');
      localStorage.removeItem('token');
      localStorage.removeItem('cartItems');
      setName('');
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
     localStorage.getItem('token')?{
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
