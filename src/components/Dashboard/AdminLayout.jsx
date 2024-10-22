import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx'; // Sidebar của bạn

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar cố định bên trái */}
      <div style={{ flexGrow: 1 }}>
        <Outlet /> {/* Nội dung sẽ thay đổi dựa trên route */}
      </div>
    </div>
  );
};

export default AdminLayout;
