import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Button, Typography, List, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import './Checkout.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

function Checkout() {
  const { state } = useLocation();
  const [cartItems, setCartItems] = useState(state?.cartItems || []);  // Quản lý state của cartItems
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const onFinish = (values) => {
    // Hiển thị SweetAlert khi hoàn thành form
    Swal.fire({
      icon: 'success',
      title: 'Cảm ơn bạn đã mua hàng',
      text: 'Chúng tôi sẽ kiểm tra và tiến hành giao hàng trong vòng 24h',
      confirmButtonText: 'OK'
    }).then(() => {
      // Xóa tất cả item trong cart sau khi người dùng đóng SweetAlert
      setCartItems([]);
    });
    
    console.log('Form values: ', values);
  };

  return (
    <div className="checkout-container">
      <Title style={{ marginBottom: '50px' }} level={3}>Thông tin mua hàng</Title>

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
          <div className="summary-container" style={{ border: '1px solid #d9d9d9', borderRadius: '8px', paddingBottom: '30px', marginTop: '40px', paddingLeft: '20px', paddingRight: '20px' }}>
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
            <img
              style={{ width: '50%', marginTop: '40px' }}
              src='https://firebasestorage.googleapis.com/v0/b/merent-242d6.appspot.com/o/Screenshot%202024-10-15%20211210.png?alt=media&token=dd24b426-07a1-4fad-a354-ace03359b4c5' alt='qr-code' />
          </div>

        </Col>

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
