import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Button, Typography, List, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import './Checkout.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

function Checkout() {
  const { state } = useLocation();
  const [wallet, setWallet] = useState(null);
  const [cartItems, setCartItems] = useState(state?.cartItems || []);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const [user, setUser] = useState(null);
  const [orderId, setOrderId] = useState(null);
  useEffect(() => {
    fetchWalletInfo();
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUser(JSON.parse(storedUser)); 
  }, []);

  const fetchWalletInfo = async () => {
    try {
      const { data } = await api.get("/Wallet/user-wallet");
      if (data.success && data.data.length > 0) {
        setWallet(data.data[0]);
      } else {
        message.error(data.message || "Lỗi khi lấy thông tin ví");
      }
    } catch (error) {
        // message.info("Please log in to access your profile information.");
    }
  };

  const getLatestOrderId = async () => {
    try {
      const response = await fetch(`https://merent.uydev.id.vn/api/ProductOrder/user/${user.id}/latest`);
      if (!response.ok) throw new Error("Failed to fetch latest Order ID");

      const result = await response.json();
      setOrderId(result.id);
      console.log(result.id);
      return result.id;
    } catch (error) {
      console.error("Error fetching latest Order ID:", error);
      throw error;
    }
  };

  const createOrderAndDetails = async (note) => {
    if (!user) {
      Swal.fire('Thất bại', 'Vui lòng đăng nhập để tiếp tục.', 'error');
      return;
    }
  
    try {
      // Kiểm tra số dư ví
      if (wallet.cash < totalAmount) {
        Swal.fire('Thất bại', 'Số dư ví không đủ để thanh toán.', 'error');
        return;
      }
  
      // Tạo đơn hàng
      const orderData = {
        description: note || "Đơn hàng mới",
        orderDate: new Date().toISOString(),
        totalAmount: cartItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: totalAmount,
        userID: user.id,
      };
  
      const orderResponse = await fetch("https://merent.uydev.id.vn/api/ProductOrder", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (!orderResponse.ok) throw new Error("Order creation failed");
  
      const orderId = await getLatestOrderId();
      const orderDetailPromises = cartItems.map((item) => {
        const orderDetailData = {
          productID: item.id,
          orderId: orderId,  
          quantity: item.quantity,
          unitPrice: item.price,
        };
  
        return fetch("https://merent.uydev.id.vn/api/ProductOrderDetail", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderDetailData),
        });
      });
  
      const orderDetailResponses = await Promise.all(orderDetailPromises);
  
      if (orderDetailResponses.some(response => !response.ok)) {
        throw new Error("One or more OrderDetails creation failed");
      }
  
    
      const walletUpdateData = {
        cash: wallet.cash - totalAmount,  
      };
  
      const walletResponse = await fetch(`https://merent.uydev.id.vn/api/Wallet/${wallet.id}`, {
        method: "PUT", 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletUpdateData),
      });
  
      if (!walletResponse.ok) {
        throw new Error("Wallet update failed");
      }
  
      Swal.fire('Thành công', 'Đơn hàng đã được tạo thành công và số dư ví đã được trừ!', 'success');
    } catch (error) {
      console.error("Error creating order or order details:", error);
      Swal.fire('Thất bại', 'Không thể tạo đơn hàng. Vui lòng thử lại.', 'error');
    }
  
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };
  

  const onFinish = (values) => {
    createOrderAndDetails(values.note);
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
