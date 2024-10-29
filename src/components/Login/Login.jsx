import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios'; 
import '../Login/Login.css';
import loginPic from "../HomePage/images/loginPic.png";
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiConfig';
import {jwtDecode} from 'jwt-decode'; // Sửa import jwt-decode

const Login = () => {
  const [decoded, setDecoded] = useState();
  const navigate = useNavigate(); // Gọi useNavigate dưới dạng hàm

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      // Điều hướng tới trang Admin hoặc trang chính
      if (decodedToken.Email === 'khoidnse172013@fpt.edu.vn') {
        navigate("/Admin/Dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const response = await api.post("/Authentication/Login", {
        email: values.email,
        password: values.password
      });
      const user = response.data;
      console.log(user);
      console.log(user.token);
      localStorage.setItem('token', user.token);
      if (response.status === 200) {
        message.success('Đăng nhập thành công');
        const decodedToken = jwtDecode(user.token);
        // Gọi API /api/User/me để lấy thêm thông tin user
        await fetchUserInfo(user.token);

        // Điều hướng
        if (decodedToken.Email === 'khoidnse172013@fpt.edu.vn') {
          navigate("/Admin/Dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin');
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await api.get("/User/me", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      });
      
      const userInfo = response.data; // response.data chứa toàn bộ thông tin người dùng
      console.log('User Info:', userInfo);
      
      // Lấy và lưu name từ response.data
      const userName = userInfo.data.name; // Lấy trường name từ bên trong data
      const email = userInfo.data.email;
      const phone = userInfo.data.phoneNumber;
      console.log(userName);
      
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo.data)); // Lưu toàn bộ data vào localStorage
      localStorage.setItem('name', userName); // Lưu name riêng vào localStorage
      localStorage.setItem('phoneNumer',phone);
      localStorage.setItem('email',email);q
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='form-body'>
      <div className="form-container">
        <div className="form-title">
          <p>Đăng Nhập</p>
        </div>
        <p className='info-title'>Nhập thông tin của bạn để truy cập vào tài khoản</p>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Địa chỉ email"
            name="email"
            rules={[{ required: true, message: 'Nhập địa chỉ email của bạn' }]}
          >
            <Input placeholder="Nhập địa chỉ email của bạn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Nhập mật khẩu của bạn' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu của bạn" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ trong 30 ngày</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="login-link">
          <p>Bạn chưa có tài khoản? <span onClick={() => {
            navigate('/Register');
          }}>Đăng ký</span></p>
        </div>
      </div>
      <div className="form-pic">
        <img src={loginPic} className='camera-pic' alt="Login visual" />
      </div>
    </div>
  );
};

export default Login;
