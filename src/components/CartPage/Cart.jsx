import React, { useEffect, useState } from 'react';
import { List, Button, Typography, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './Cart.css';

const { Title, Text } = Typography;

function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate();  // Initialize useNavigate
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
  };
  const handleIncreaseQuantity = (id) => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const handleDecreaseQuantity = (id) => {
    const updatedCart = cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCart);
  };

  // Hàm xử lý khi nhấn nút "Thanh Toán"
  const handleCheckout = () => {
    navigate('/Cart/Checkout', { state: { cartItems } });  // Truyền cartItems qua state
  };

  return (
    <div className="cart-container">
      <div className='cart-title'>
        <Title level={2}>Giỏ hàng của bạn</Title>
        <Text>{cartItems.length} sản phẩm trong giỏ hàng</Text>
      </div>

      <Row gutter={24}>
        <Col span={20}>
          <List
            itemLayout="vertical"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item
                style={{
                  border: '1px solid #d9d9d9',
                  marginLeft: '17%',
                  marginBottom: '80px',
                  borderRadius: '8px',
                  width:'85%'
                }}
              >
                <Row align="middle">
                  <Col span={6}>
                    <img alt={item.name} src={item.urlCenter} style={{ width: '100%', borderRadius: '8px' }} />
                  </Col>
                  <Col span={12}>
                    <div className='items-information'>
                      <Title level={4}>{item.name}</Title>
                      <Text>{item.price.toLocaleString()} VNĐ</Text>
                    </div>
                  </Col>
                  <Col span={6}>
                    <Row align="middle" justify="center">
                      <Button
                        icon={<MinusOutlined />}
                        onClick={() => handleDecreaseQuantity(item.id)}
                        size="large"
                        style={{ marginRight: '8px', backgroundColor: "white", borderStyle: 'solid', borderWidth: '1px' }}
                      />
                      <Text style={{ fontSize: '20px', marginLeft: '10px', marginRight: '10px' }}>{item.quantity}</Text>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => handleIncreaseQuantity(item.id)}
                        size="large"
                        style={{ marginLeft: '8px', backgroundColor: '#082C44', color: 'white' }}
                      />
                      <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(item.id)}
                    style={{marginLeft:'60px'}}
                  />
                    </Row>
                  </Col>
                  

                </Row>
              </List.Item>
            )}
          />
        </Col>
      </Row>

      <Button 
        className="summary-container-button"
        style={{ width: '20%', backgroundColor: '#BF1414' }} 
        type="primary"
        onClick={handleCheckout}  // Bắt sự kiện nhấn nút
      >
        Đi đến trang thanh toán
      </Button>
    </div>
  );
}

export default Cart;
