import React, { useState, useEffect,useRef } from 'react';
import { Layout, Row, Col, Button, message, Card, Tooltip } from 'antd'; // Import Tooltip
import { useLocation, useNavigate } from 'react-router-dom';
import './Rent.css';

const { Content } = Layout;

function RentDetail({ cartItems, setCartItems }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const productDetailRef = useRef(null);
  useEffect(() => {
    fetch('https://merent.uydev.id.vn/api/Product')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data.data) ? data.data : []);
      })
      .catch((error) => setError(error));
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleProductClick = (product) => {
    navigate(`/Rent/Items/${product.name}`, { state: { product } });
    setTimeout(() => {
      // Cuộn đến vị trí chi tiết sản phẩm
      productDetailRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, -1);
  };
  const selectedProduct = location.state?.product;
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) {
    navigate('/Rent');
    return null;
  }

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => quantity > 1 && setQuantity(prev => prev - 1);

  const handleAddToCart = () => {
    if (selectedProduct && quantity > 0) {
      const newItem = { ...selectedProduct, quantity };

      const itemExists = cartItems.find(item => item.id === newItem.id);
      const updatedCartItems = itemExists
        ? cartItems.map(item =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...cartItems, newItem];

      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      message.success(`${newItem.name} đã được thêm vào giỏ hàng!`);
    } else {
      message.error('Số lượng không hợp lệ. Vui lòng nhập số lượng lớn hơn 0.');
    }
  };

  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className='selected-product' ref={productDetailRef}>
        <Row className='camera-detail' gutter={[16, 16]} justify="center">
  <Col xs={24} sm={24} md={12} lg={12}>
    <img 
      alt={selectedProduct.name} 
      src={selectedProduct.urlCenter} 
      className="product-image-large" 
      style={{ margin: '0 auto' }} 
    />

    {selectedProduct.productType === "Camera" && (
      <Row gutter={[16, 16]} justify="space-between" className="small-images-row">
        {/* Tooltip for the small images */}
        <Col xs={6}>
          <Tooltip
            title={<img src={selectedProduct.urlLeft} alt="zoom" className="zoom-image" />}
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
            overlayClassName="custom-tooltip"
            placement="top"
          >
            <img 
              alt={`${selectedProduct.name} `} 
              src={selectedProduct.urlLeft} 
              className="product-image-small" 
            />
          </Tooltip>
        </Col>

        <Col xs={6}>
          <Tooltip
            title={<img src={selectedProduct.urlRight} alt="zoom" className="zoom-image" />}
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
            overlayClassName="custom-tooltip"
            placement="top"
          >
            <img 
              alt={`${selectedProduct.name} `} 
              src={selectedProduct.urlRight} 
              className="product-image-small" 
            />
          </Tooltip>
        </Col>

        <Col xs={6}>
          <Tooltip
            title={<img src={selectedProduct.urlSide} alt="zoom" className="zoom-image" />}
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
            overlayClassName="custom-tooltip"
            placement="top"
          >
            <img 
              alt={`${selectedProduct.name} `} 
              src={selectedProduct.urlSide} 
              className="product-image-small" 
            />
          </Tooltip>
        </Col>
      </Row>
    )}
  </Col>


            
            <Col xs={24} sm={24} md={12} lg={6}>
              <div className='camera-descriptionss' style={{marginTop:'40px'}}>
                <h1>{selectedProduct.name}</h1>
                <h2 style={{ color: 'red', fontSize:'20px',marginTop:'10px' }}>{`${selectedProduct.price} VNĐ`}</h2>
                <p>{selectedProduct.description}</p>
                <div style={{display:'flex',justifyContent:'center',marginTop:'10px'}}>
                  <Button onClick={handleDecrease} style={{ backgroundColor: 'white', border: '1px solid #d9d9d9', width:'20px' }}>-</Button>
                  <span style={{ marginTop:'5px',marginLeft:'10px',marginRight:'10px' }}>{quantity}</span>
                  <Button onClick={handleIncrease} style={{ backgroundColor: 'white', border: '1px solid #d9d9d9', width:'20px' }}>+</Button>
                </div>
                <Button type="primary" style={{ marginTop: '10px' }} onClick={handleAddToCart}>Thêm vào giỏ</Button>
              </div>
            </Col>
          </Row>
        </div>
        
        <div className='related-products-section'>
          <h2 className="section-title">CÁC SẢN PHẨM LIÊN QUAN</h2>
          <Row gutter={[16, 50]} justify="center">
          {products.filter(product => product.productType === selectedProduct.productType) 
              .map(product => (
              <Col key={product.id} xs={24} sm={24} md={12} lg={6}>
                <Card
                  className="custom-cardz"
                  hoverable
                  cover={<img alt={product.name} src={product.urlCenter} className="product-image" />}
                  onClick={() => handleProductClick(product)}
                >
                  <Card.Meta title={product.name} description={`${product.price} VNĐ`} />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default RentDetail;
