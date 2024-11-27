import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import {jwtDecode} from 'jwt-decode';
import '../Login/Login.css';
import loginPic from "../HomePage/images/loginPic.png";
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiConfig';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        message.warning('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        return;
      }

      if (decodedToken.Email === 'khoidnse172013@fpt.edu.vn') {
        navigate("/Admin/Dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const response = await api.post("/Authentication/login", {
        email: values.email,
        password: values.password
      });
      const user = response.data;

      if (!user.token) {
        throw new Error('Token không hợp lệ. Vui lòng kiểm tra API.');
      }

      localStorage.setItem('token', user.token);
      message.success('Đăng nhập thành công');

      const decodedToken = jwtDecode(user.token);
      await fetchUserInfo(user.token);

      if (decodedToken.Email === 'khoidnse172013@fpt.edu.vn') {
        navigate("/Admin/Dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin';
      message.error(errorMessage);
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const response = await api.get("/User/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { id, name, email, phoneNumber } = response.data.data;

      localStorage.setItem('userInfo', JSON.stringify(response.data.data));
      localStorage.setItem('id', id);
      localStorage.setItem('name', name);
      localStorage.setItem('phoneNumber', phoneNumber);
      localStorage.setItem('email', email);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      message.error('Không thể lấy thông tin người dùng.');
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
            rules={[
              { required: true, message: 'Nhập địa chỉ email của bạn' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
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
          <p>
            Bạn chưa có tài khoản?{' '}
            <span className="register-link" onClick={() => navigate('/Register')}>
              Đăng ký
            </span>
          </p>
        </div>
      </div>
      <div className="form-pic">
        <img src={loginPic} className='camera-pic' alt="Login visual" />
      </div>
    </div>
  );
};

export default Login;
