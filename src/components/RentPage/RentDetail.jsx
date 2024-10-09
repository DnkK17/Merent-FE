import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Button, message, Card } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import sony from "../HomePage/images/sony.jpg";
import EOSR1 from "../HomePage/images/EOSR1.jpg";
import EOSR50 from "../HomePage/images/EOSR50.png";
import EOSR100 from "../HomePage/images/EOSR100.png";
import EOSR5 from "../HomePage/images/EOSR5.png";
import EOSR1ngang from "../HomePage/images/EOSR1ngang.png"
import EOSR1sau from "../HomePage/images/EOSR1sau.png"
import EOSR1tren from "../HomePage/images/EOSR1tren.png"
import './Rent.css';

const { Content } = Layout;
// const products = [
//   { id: 1, name: "EOS R1", price: 350000, description: "Là mẫu máy ảnh thế hệ thứ 4 thuộc dòng máy ảnh EOS full-frame bán chạy nhất của Canon, EOS 5D Mark IV là sự kết hợp của tính chuyên nghiệp đi kèm những cải tiến đáng giá. Cảm biến CMOS full-frame 30.4 megapixel được trang bị cùng với công nghệ Dual Pixel CMOS AF thời thượng giúp lấy nét tự động nhanh hơn và chính xác hơn không chỉ đối với ảnh tĩnh mà còn quay phim 4K và quay phim thể loại footage một cách chuyên nghiệp. ", imgSrc: EOSR1, images: [EOSR1ngang, EOSR1sau, EOSR1tren] },
//   { id: 2, name: "EOS R5 Mark II", price: 500000, description: "Mô tả chi tiết sản phẩm EOS R5 Mark II...", imgSrc: EOSR5, images: [sony, sony, sony] },
//   { id: 3, name: "EOS R100", price: 700000, description: "Mô tả chi tiết sản phẩm EOS R100", imgSrc: EOSR100, images: [sony, sony, sony] },
//   { id: 4, name: "EOS R50", price: 800000, description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: EOSR50, images: [sony, sony, sony] },
// ];

function RentDetail({ cartItems, setCartItems }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
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
    navigate(`/Rent/Camera/${product.name}`, { state: { product } }); // Passing product as state
  };
  // Retrieve the passed product from the state
  const selectedProduct = location.state?.product;
  const [quantity, setQuantity] = useState(1);

  // If no product is passed in, redirect back to the Rent page
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
      <div className='selected-product'>
              <Row className='camera-detail' gutter={[16, 16]} justify="center">
                <Col  xs={24} sm={24} md={12} lg={12}>
                  <img alt={selectedProduct.name} src={selectedProduct.urlCenter} className="product-image-large" />
                  <Row gutter={[16, 16]} justify="space-between" className="small-images-row">
                    
                      <Col  xs={6}>
                        <img alt={`${selectedProduct.name} `} src={selectedProduct.urlLeft} className="product-image-small" />
                      </Col>
                      <Col  xs={6}>
                        <img alt={`${selectedProduct.name} `} src={selectedProduct.urlRight} className="product-image-small" />
                      </Col>
                      <Col xs={6}>
                        <img alt={`${selectedProduct.name} `} src={selectedProduct.urlSide} className="product-image-small" />
                      </Col>
                    
                  </Row>
                </Col>
                <Col  xs={24} sm={24} md={12} lg={6}>
                <div className='camera-description'>
                  <h1>{selectedProduct.name}</h1>
                  <h2 style={{ color: 'red' }}>{`${selectedProduct.price} VNĐ`}</h2>
                  <p>{selectedProduct.description}</p>
                  <div>
                  <Button 
                  onClick={handleDecrease} 
                  style={{ backgroundColor: 'white', border: '1px solid #d9d9d9' }}>
                  -
                  </Button>
                  <span style={{ margin: '0 10px' }}>{quantity}</span>
                  <Button 
                  onClick={handleIncrease} 
                  style={{ backgroundColor: 'white', border: '1px solid #d9d9d9' }}>
                    +
                  </Button>
                  </div>
                  <Button type="primary" style={{ marginTop: '10px' }} onClick={() => {handleAddToCart();}}>Thêm vào giỏ</Button>

                  </div>
                </Col>
              </Row>
              
            </div>
            <div className='related-products-section'>
          <h2 className="section-title">CÁC SẢN PHẨM LIÊN QUAN</h2>
          <Row gutter={[16, 50]} justify="center">
            {products.map(product => (
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
