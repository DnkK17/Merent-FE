import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios'; 
import '../Login/Login.css';
import loginPic from "../HomePage/images/loginPic.png";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // Gọi useNavigate dưới dạng hàm

  const onFinish = async (values) => {
    try {
      const response = await axios.post('https://localhost:7253/api/Authentication/Login', {
        email: values.email,
        password: values.password
      });

      if (response.status === 200) {
        message.success('Đăng nhập thành công');
        console.log('Login successful:', response.data);

        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.token);
        
        // Điều hướng sau khi đăng nhập thành công
        navigate("/");
      }
    } catch (error) {
      console.error('Login failed:', error);
      message.error('Đăng nhập thất bại, vui lòng kiểm tra lại thông tin');
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
          <p>Bạn chưa có tài khoản? <a href="/register">Đăng ký</a></p>
        </div>
      </div>
      <div className="form-pic">
        <img src={loginPic} className='camera-pic' alt="Login visual" />
      </div>
    </div>
  );
};

export default Login;
