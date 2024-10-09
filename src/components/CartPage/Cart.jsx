import React from 'react';
import { List, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './Cart.css'
const { Title, Text } = Typography;

function Cart({ cartItems, setCartItems }) {
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <div className='cart-title'>
      <Title level={1}>Giỏ hàng của tôi</Title>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item
          actions={[
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveItem(item.id)}
            />,
          ]}
          style={{
            border: '2px solid #d9d9d9', // Thay đổi màu sắc border nếu cần
            borderRadius: '5px', // Tùy chọn bo góc
            margin: '0 auto', // Khoảng cách giữa các item
            marginBottom:'30px',
            padding: '10px', // Khoảng cách bên trong item
            width:'80%'
          }}
        >
          <List.Item.Meta
            avatar={<img alt={item.name} src={item.urlCenter} style={{ width: '300px' }} />}
            title={
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h2 style={{ paddingTop:'50px' ,height: '50px'}}>{item.name}</h2>
              </div>
            }
            description={
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h2 style={{ margin: 0 }}>{`${item.quantity} x ${item.price} VNĐ`}</h2>
              </div>
            }
          />
          <Text strong style={{ color: 'red', fontSize: '1.2rem' }}>
            {(item.price * item.quantity)} VNĐ
          </Text>
        </List.Item>
        
        )}
      />
      <Title level={3}>Total: {totalAmount.toFixed(2)} VNĐ</Title>
    </div>
  );
}

export default Cart;
