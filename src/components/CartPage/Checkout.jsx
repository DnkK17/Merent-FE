import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, List, Row, Col } from 'antd';
import Swal from 'sweetalert2';
import './Checkout.css';
import api from '../../services/apiConfig';

const { Title, Text } = Typography;
const { TextArea } = Input;

function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form] = Form.useForm(); // Sử dụng Ant Design Form instance
  const [wallet, setWallet] = useState(null);
  const [cartItems, setCartItems] = useState(state?.cartItems || []);
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity || total + item.totalPrice, 0);
  const [user, setUser] = useState(null);
  const [userID, setUserId] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const comboPrice = cartItems?.reduce((acc, item) => acc + (item.totalPrice || 0), 0) || 0;
  const singleOrdercheck = cartItems?.reduce((acc, item) => acc + (item.price || 0), 0) || 0;
  const [latestOrderId, setLatestOrderId] = useState([]);

  useEffect(() => {
    
    console.log(totalAmount);
    console.log(singleOrdercheck);
    fetchWalletInfo();
    const storedUser = localStorage.getItem('userInfo');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const a = localStorage.getItem('id');
      console.log(a);
      setUserId(a);
      // Tự động điền thông tin người dùng vào form
      form.setFieldsValue({
        email: parsedUser.email,
        name: parsedUser.name,
        phoneNumber: parsedUser.phoneNumber,
      });
    }

    // Tự động điền ghi chú dựa trên danh sách sản phẩm
    if (cartItems.length > 0) {
      const noteContent = cartItems
        .filter((item) => !item.comboName)  // Exclude items with a comboName
        .map((item) => `${item.quantity} x ${item.name}`)
        .join(', ');


      form.setFieldsValue({
        note: `${noteContent}`,
      });
    }
    
  }, [cartItems, form,latestOrderId]);

  const fetchWalletInfo = async () => {
    try {
      const { data } = await api.get('/Wallet/user-wallet');
      if (data.success && data.data.length > 0) {
        setWallet(data.data[0]);
      } else {
        message.error(data.message || 'Lỗi khi lấy thông tin ví');
      }
    } catch (error) {
      console.error('Error fetching wallet info:', error);
    }
  };

  const getLatestOrderId = async () => {
    const storedId = userID || localStorage.getItem('id'); // Lấy từ state hoặc localStorage
    if (!storedId) {
      console.error('User ID is missing or null');
      return;
    }
    try {
      const response = await fetch(
        `https://merent.uydev.id.vn/api/ProductOrder/user/${storedId}/latest`
      );
      if (!response.ok) throw new Error('Failed to fetch latest Order ID');
  
      const result = await response.json();
      setOrderId(result.id);
      return result.id;
    } catch (error) {
      console.error('Error fetching latest Order ID:', error);
      throw error;
    }
  };
  

  const createOrderAndDetails = async (note) => {
    // Lấy giá trị user từ localStorage nếu chưa có trong state
    const storedUser = localStorage.getItem('userInfo');
    const storedId = localStorage.getItem('id');
  
    if (!user && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  
    if (!userID && storedId) {
      setUserId(storedId);
    }
  
    // Kiểm tra điều kiện đăng nhập
    if (!storedId) {
      Swal.fire('Thất bại', 'Vui lòng đăng nhập để tiếp tục.', 'error');
      return;
    }
  
    try {
      // Kiểm tra số dư ví
      if (wallet.cash < totalAmount) {
        Swal.fire('Thất bại', 'Số dư ví không đủ để thanh toán.', 'error');
        return;
      }
  
      if (singleOrdercheck) {
        // Tạo dữ liệu đơn hàng
        const orderData = {
          description: note || 'Đơn hàng mới',
          orderDate: new Date().toISOString(),
          totalAmount: cartItems.reduce((total, item) => total + item.quantity, 0),
          totalPrice: totalAmount - comboPrice,
          userID: storedId, // Sử dụng storedId để đảm bảo không bị null
          statusOrder: 'Pending',
        };
  
        // Tạo đơn hàng
        const orderResponse = await fetch('https://merent.uydev.id.vn/api/ProductOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
  
        if (!orderResponse.ok) throw new Error('Order creation failed');
  
      
        
      }
      const orderIdLatest = await getLatestOrderId();
      console.log('Fetched Order ID:', orderIdLatest);
      // Tạo chi tiết đơn hàng
      const productItems = [];
      const comboItems = [];
      console.log(latestOrderId)
      cartItems.forEach((item) => {
        if (item.comboID) {
          comboItems.push(item.comboID);
        } else if(item.id){
          productItems.push({
            productID: item.id,
            orderId: orderIdLatest,
            quantity: item.quantity,
            unitPrice: item.price,
            productName: item.name,
          });
        }
      });
  
      // Xử lý các combo
      if (comboItems.length > 0) {
        const comboNote = cartItems
          .filter((item) => !item.name)
          .map((item) => `1 x ${item.comboName}`)
          .join(', ');
  
        const comboOrderData = {
          description: comboNote || 'Đơn hàng mới',
          orderDate: new Date().toISOString(),
          comboIds: comboItems,
          userID: storedId,
        };
  
        const comboResponse = await fetch('https://merent.uydev.id.vn/api/ProductOrder/create-for-combo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(comboOrderData),
        });
  
        if (!comboResponse.ok) {
          throw new Error('Combo order creation failed');
        }
      }
  
      // Xử lý chi tiết đơn hàng sản phẩm
      if (singleOrdercheck) {
        const orderDetailPromises = productItems.map((orderDetailData) => {
          return fetch('https://merent.uydev.id.vn/api/ProductOrderDetail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetailData),
          });
        });
  
        const orderDetailResponses = await Promise.all(orderDetailPromises);
  
        if (orderDetailResponses.some((response) => !response.ok)) {
          throw new Error('One or more OrderDetails creation failed');
        }
      }
  
      // Cập nhật số dư ví
      const walletUpdateData = {
        id: wallet.id,
        userId: wallet.userId,
        cash: wallet.cash - totalAmount,
        walletType: wallet.walletType,
      };
      console.log(walletUpdateData);
  
      const walletResponse = await fetch(
        `https://merent.uydev.id.vn/api/Wallet/${wallet.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(walletUpdateData),
        }
      );
  
      if (!walletResponse.ok) {
        throw new Error('Wallet update failed');
      }
  
      Swal.fire('Thành công', 'Đơn hàng đã được tạo thành công!', 'success');
    } catch (error) {
      console.error('Error creating order or order details:', error);
      Swal.fire('Thất bại', 'Có lỗi xảy ra khi tạo đơn hàng.', 'error');
    }

    setCartItems([]);
    localStorage.removeItem('cartItems');
  };
  

  const onFinish = async (values) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn thanh toán?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Không',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createOrderAndDetails(values.note);
          const latestOrderId = await getLatestOrderId();
          if (totalAmount > wallet.cash)
            navigate(
              `/payment?code=00&cancel=true&status=CANCELLED&id=${latestOrderId}&orderCode=${latestOrderId}&amount=${totalAmount}`
            );
          else {
            navigate(
              `/payment?code=00&cancel=false&status=PAID&id=${latestOrderId}&orderCode=${latestOrderId}&amount=${totalAmount}`
            );
          }
        } catch (error) {
          console.error('Error processing payment:', error);
        }
      } else {
        Swal.fire('Đã hủy', 'Đơn hàng đã bị hủy.', 'info');
        navigate('/cart');
      }
    });
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
                  <Col span={6}>
                    <img alt={item.name} src={item.urlImg || item.urlCenter} style={{ width: '100%' }} />
                  </Col>
                  <Col span={12}>
                  <Title level={4}>{item.name||item.comboName}</Title>
                      {/* Display totalPrice if available in localStorage */}
                      <Text>
                        {item.totalPrice ||
                          item.price.toLocaleString() } VNĐ
                      </Text>
                    
                  </Col>
                  <Col span={6}>
                    <Text>
                      Số lượng: {item.comboName ? 1 : item.quantity}
                    </Text>
                  </Col>

                </Row>
              </List.Item>
            )}
          />
          <div className="summary-container">
            <Title level={4}>Thông tin đơn hàng</Title>
            <Row justify="space-between">
              <Text>Tổng tiền:</Text>
              <Text strong>
                 {totalAmount.toLocaleString()}  VNĐ
              </Text>
                  
            </Row>
            <Row justify="space-between" style={{ marginTop: '10px' }}>
              <Text>Phí vận chuyển:</Text>
              <Text type="secondary">Sẽ được tính ở trang thanh toán</Text>
            </Row>
          </div>
        </Col>
        <Col span={12}>
          <Form layout="vertical" onFinish={onFinish} className="checkout-form" form={form}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Vui lòng nhập email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thanh toán
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Checkout;
