import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../Rent.css';

const { Content } = Layout;


function LightingRent() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
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
  const handleProductClick = (product) => {
    navigate(`/Rent/Items/${product.name}`, { state: { product } }); // Passing product as state
  };
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className='related-products-section'>
          <h2 className="section-title">ÁNH SÁNG</h2>
          <Row gutter={[16, 50]} justify="center">
            {products
              .filter(product => product.productType === 'Lightning') 
              .map(product => (
                <Col key={product.id} xs={24} sm={24} md={12} lg={6}>
                  <Card
                    className="custom-cardz"
                    hoverable
                    cover={<img alt={product.name} src={product.urlCenter} className="product-image" />}
                    onClick={() => handleProductClick(product)}
                  >
                    <Card.Meta title={product.name} description={`${product.price.toLocaleString("vi-VN")} VNĐ`}
 />
                  </Card>
                </Col>
              ))}
          </Row>

        </div>
      </Content>
    </Layout>
  );
}

export default LightingRent;
