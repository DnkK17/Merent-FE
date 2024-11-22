import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal, Table, Button, Typography,message } from 'antd';
import { useNavigate } from 'react-router-dom';
import "../RentPage/PhotoServices.css";
import Swal from 'sweetalert2'; 
const { Text } = Typography;
const Combo = ({ cartItems, setCartItems }) => {
  
  const [combos, setCombos] = useState([]);
  const [selectedComboProducts, setSelectedComboProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const quantity = 1;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://merent.uydev.id.vn/api/ComboOfProduct/All-Product-ByCombo')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Lọc ra các combo có products khác rỗng và urlImg không phải là "string"
        const validCombos = (Array.isArray(data.data) ? data.data : []).filter(
          (combo) => 
            Array.isArray(combo.products) && combo.products.length > 0 &&
            combo.urlImg && combo.urlImg !== "string" // Kiểm tra urlImg không phải là "string"
        );
  
        setCombos(validCombos);
      })
      .catch((error) => console.error(error));
  }, []);
  

  const fetchComboDetails = (id) => {
    fetch(`https://merent.uydev.id.vn/api/ComboOfProduct/ByCombo/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch combo details');
        }
        return response.json();
      })
      .then((data) => {
        setSelectedComboProducts(data.data.products || []);
        const fetchedTotalPrice = data.data.totalPrice || 0;
  
        // Cập nhật state
        setTotalPrice(fetchedTotalPrice);
  

        // Cập nhật lại localStorage
       
        setIsModalVisible(true);
      })
      .catch((error) => console.error(error));
  };
  
  
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedComboProducts([]);
  };

  const handleAddToCart = (combo) => {
 if (combo) {
      const newItem = { ...combo, quantity };

      const itemExists = cartItems.find(item => item.comboID === newItem.comboID);
      const updatedCartItems = itemExists
        ? cartItems.map(item =>
            item.comboID === newItem.comboID ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...cartItems, newItem];

      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      message.success(`${newItem.comboName} đã được thêm vào giỏ hàng!`);
    } else {
      message.error('Số lượng không hợp lệ. Vui lòng nhập số lượng lớn hơn 0.');
    }
  };


  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'productType',
      key: 'productType',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'urlCenter',
      key: 'urlCenter',
      render: (url) => <img src={url} alt="Product" style={{ width: 100 }} />,
    },
  ];

  return (
    <div>

    <div style={{ textAlign: 'center',paddingBottom:'40px',marginTop:'-50px'}}>
      <p style={{ fontSize: '16px', color: '#fa541c' }}><strong>Lưu ý</strong></p>
      <ul style={{ listStyleType: 'none', padding: 0, fontSize: '14px', color: '#000' }}>
        <li>+ Vui lòng đọc kỹ chi tiết trước khi đặt hàng</li>
      </ul>
    </div>
    <h2 className="header-title" style={{ textAlign: 'center' }}>
  CÁC COMBO HIỆN CÓ
</h2>
      <Row className="row-services" gutter={[0, 16]} justify="center">
        {combos.map((combo) => (
          <Col
            className="column-services"
            key={combo.comboID}
            xs={24}
            sm={12}
            md={8}
            lg={8}
          >
            <Card
              hoverable
              cover={
                <img
                  alt={combo.comboName}
                  src={combo.urlImg}
                  style={{ width: '100%', height: '350px' }}
                />
              }
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.35)',
                width: '100%',
                height: '450px',
                paddingLeft: '20px',
                paddingRight: '20px',
              }}
            >
              <p style={{marginTop:'-10px',fontSize:'18px'}}>{combo.description}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop:'15px' }}>
                <Button type="primary" onClick={() => fetchComboDetails(combo.comboID)}>
                  Xem chi tiết
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => handleAddToCart(combo)} 
                   // Disable if totalPrice is not in localStorage
                >
                  Thêm vào giỏ hàng
                </Button>

              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Chi tiết sản phẩm trong Combo"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button type='primary' style={{width:'60%',marginRight:'20%'}} key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        <Table
          dataSource={selectedComboProducts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
         <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Text strong>Tổng giá combo: </Text>
          <Text style={{ fontSize: '16px', color: '#fa541c' }}>
            {totalPrice.toLocaleString()} VND
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default Combo;
