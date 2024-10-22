import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logoPage from "../HomePage/images/logoPage.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa thông tin khỏi localStorage
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    
    // Cập nhật trạng thái (nếu cần, có thể là setName('') nếu bạn có sử dụng useState cho name)
    // setName('');

    // Điều hướng về trang đăng nhập hoặc trang chính
    navigate('/'); // Hoặc điều hướng đến trang đăng nhập
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <img src={logoPage} alt="Logo" />
        <div className='sidebar-content'>
          <ul>
            <li><a href="/Admin/Dashboard">Overview</a></li>
            <li><a href="/Admin/Dashboard/Customers">Customers</a></li>
            <li><a href="/Admin/Dashboard/Products">Products</a></li>
            <li><a href="#" onClick={handleLogout}>Log out</a></li> {/* Thay đổi ở đây */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
