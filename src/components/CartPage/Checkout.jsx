import React from 'react';
import { useLocation } from 'react-router-dom';  // Import useLocation để lấy state
import { Form, Input, Button, Typography, List, Row, Col } from 'antd';
import './Checkout.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

function Checkout() {
  const { state } = useLocation();  // Lấy state từ useLocation
  const cartItems = state?.cartItems || [];  // Nhận cartItems từ state
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const onFinish = (values) => {
    console.log('Form values: ', values);
  };

  return (
    <div className="checkout-container">
      <Title style = {{marginBottom:'50px'}} level={3}>Thông tin mua hàng</Title>

      {/* Hiển thị danh sách sản phẩm bên trái */}
      <Row gutter={24}>
        <Col span={12}>
          <List
            itemLayout="vertical"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <Row align="middle">
                  <Col span={6}>
                    <img alt={item.name} src={item.urlCenter} style={{ width: '100%' }} />
                  </Col>
                  <Col span={12}>
                    <div>
                      <Title level={4}>{item.name}</Title>
                      <Text>{item.price.toLocaleString()} VNĐ</Text>
                    </div>
                  </Col>
                  <Col span={6}>
                    <Text>Số lượng: {item.quantity}</Text>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
           <div className="summary-container" style={{ border: '1px solid #d9d9d9', borderRadius: '8px',paddingBottom:'30px',marginTop:'40px',paddingLeft:'20px',paddingRight:'20px' }}>
            <Title level={4}>Thông tin đơn hàng</Title>
            <div className="summary">
              <Row justify="space-between">
                <Text>Tổng tiền:</Text>
                <Text strong style={{ fontSize: '1.2rem', color: 'red' }}>{totalAmount.toLocaleString()} VNĐ</Text>
              </Row>
              <Row justify="space-between" style={{ marginTop: '10px' }}>
                <Text>Phí vận chuyển:</Text>
                <Text type="secondary">Sẽ được tính ở trang thanh toán</Text>
              </Row>
              
            </div>
          </div>
        
        </Col>

        {/* Form thông tin mua hàng */}
        <Col span={12}>
          <Form
            layout="vertical"
            onFinish={onFinish}
            className="checkout-form"
          >
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Tỉnh thành" name="city" rules={[{ required: true, message: 'Vui lòng nhập tỉnh thành' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Quận huyện" name="district" rules={[{ required: true, message: 'Vui lòng nhập quận huyện' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Phường xã" name="ward" rules={[{ required: true, message: 'Vui lòng nhập phường xã' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit" className="checkout-button">
              Thanh Toán
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Checkout;
