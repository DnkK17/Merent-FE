import { Button, Checkbox, Form, Input, message } from 'antd';
import React from 'react';
import { api } from '../../services/apiConfig';
import loginPic from "../HomePage/images/loginPic.png";
import { useNavigate } from 'react-router-dom';
import '../SignUp/SignUp.css';


const SignUp = () => {
  const navigate = useNavigate();
  const handleRegister = () => {
    navigate('/Register');
  }
  const handleLogin = () => {
    navigate('/Login');
  }
  const onFinish = async (values) => {
    try {
      const response = await api.post("/Authentication/Register", {
        name: values.name,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        gender: values.gender
      });
      if (response.status === 200) {
        message.success('Đăng ký thành công');
        console.log('Register successful:', response.data);
       
         
      }
    } catch (error) {
      console.error('Register failed:', error);
      message.error('Đăng ký thất bại, vui lòng kiểm tra lại thông tin');
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className='form-body'>
    <div className="form-container">
    <div className="form-title">
       <p>Đăng Ký</p> 
        </div>
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical" // Switch to vertical layout
    
    >
      
      <Form.Item
        label="Họ và tên"
        name="name"
        rules={[{ required: true, message: 'Nhập tên của bạn' }]}
      >
        <Input placeholder="Nhập tên của bạn" />
      </Form.Item>

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
      <Form.Item
        label="Số điện thoại"
        name="phoneNumber"
        rules={[{ required: true, message: 'Nhập sđt của bạn' }]}
      >
        <Input placeholder="Nhập sđt của bạn" />
      </Form.Item> 

      <Form.Item
        label="Giới tính"
        name="gender"
        rules={[{ required: true, message: 'Nhập giới tính của bạn' }]}
      >
        <Input placeholder="Nhập giới tính của bạn" />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
      >
        <Checkbox>Tôi đồng ý với các điều khoản và chính sách</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
    <div className="login-link">
      <p>Có một tài khoản? <a hover style={{color:'blue'}} onClick={handleLogin}>Đăng nhập</a></p>
    </div>
    </div>
    <div className="form-pic">
      <img
        src={loginPic}
        alt="Form Illustration"
      />
    </div>
  </div>
)
}
export default SignUp;