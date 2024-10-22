import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Button, Typography, List, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import { usePayOS } from 'payos-checkout'; 
import './Checkout.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

function Checkout() {
  const { state } = useLocation();
  const [cartItems, setCartItems] = useState(state?.cartItems || []);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isContainerRendered, setIsContainerRendered] = useState(false); 
  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: window.location.origin,
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: null,
    embedded: true,
    onSuccess: () => {
      Swal.fire('Thành công', 'Đơn hàng đã được thanh toán thành công!', 'success');
      setCartItems([]); 
    }
  });

  const { open, exit } = usePayOS(payOSConfig);

  const handleGetPaymentLink = async () => {
    setIsCreatingLink(true);
    exit(); 
    const response = await fetch("https://merent.uydev.id.vn/api/Wallet/create-payment-link-payos", {
      method: "POST",
      body: JSON.stringify({ totalAmount, cartItems }), 
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    setPayOSConfig((oldConfig) => ({
      ...oldConfig,
      CHECKOUT_URL: result.checkoutUrl,
    }));
    setIsContainerRendered(true); 
    setIsCreatingLink(false);
  };

  useEffect(() => {
    if (isContainerRendered && payOSConfig.CHECKOUT_URL) {
      open(); 
    }
  }, [payOSConfig, isContainerRendered]); 

  const onFinish = (values) => {
    handleGetPaymentLink(); 
    console.log('Form values: ', values);
  };

  return (
    <div className="checkout-container">
      <Title level={3}>Thông tin mua hàng</Title>

      <Row gutter={24}>
        <Col span={12}>
          <List
            itemLayout="vertical"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <Row align="middle">
                  <Col span={6}><img alt={item.name} src={item.urlCenter} style={{ width: '100%' }} /></Col>
                  <Col span={12}>
                    <Title level={4}>{item.name}</Title>
                    <Text>{item.price.toLocaleString()} VNĐ</Text>
                  </Col>
                  <Col span={6}><Text>Số lượng: {item.quantity}</Text></Col>
                </Row>
              </List.Item>
            )}
          />
          <div className="summary-container">
            <Title level={4}>Thông tin đơn hàng</Title>
            <Row justify="space-between">
              <Text>Tổng tiền:</Text>
              <Text strong>{totalAmount.toLocaleString()} VNĐ</Text>
            </Row>
            <Row justify="space-between" style={{ marginTop: '10px' }}>
              <Text>Phí vận chuyển:</Text>
              <Text type="secondary">Sẽ được tính ở trang thanh toán</Text>
            </Row>
          </div>
        </Col>

        <Col span={12}>
          <Form layout="vertical" onFinish={onFinish} className="checkout-form">
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
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={4} />
            </Form.Item>
            <Button type="primary" htmlType="submit" className="checkout-button" loading={isCreatingLink}>
              Thanh Toán
            </Button>
          </Form>
        </Col>
      </Row>


      {isContainerRendered && (
        <div id="embedded-payment-container" style={{ height: '350px', marginTop: '20px' }}></div>
      )}
    </div>
  );
}

export default Checkout;
