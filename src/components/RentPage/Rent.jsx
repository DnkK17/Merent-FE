import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card } from 'antd';


import { useNavigate } from 'react-router-dom';


const { Content } = Layout;
function Rent() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
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
 

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const handleProductClick = (product) => {
    navigate(`/Rent/Camera/${product.name}`, { state: { product } }); // Passing product as state
  };
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className='related-products-section'>
          <h2 className="section-title">MÁY ẢNH / MÁY QUAY PHIM</h2>
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

export default Rent;