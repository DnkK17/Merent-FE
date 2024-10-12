import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import EightCorner from "../../HomePage/images/EightCorner.jpg"
import ThreeKMonoLight from '../../HomePage/images/ThreeKMonoLight.png';
import FiveKMonoLight from "../../HomePage/images/FiveKMonoLight.png"
import SoftBox from "../../HomePage/images/SoftBox.jpg"
import Wistro from "../../HomePage/images/Wistro.jpeg"
import CSALed from "../../HomePage/images/CSALed.jpg"
import '../Rent.css';

const { Content } = Layout;
const products = [
  { id: 1, name: "Softbox bát giác Godox", price: 350000, description: "Mô tả chi tiết sản phẩm EOS R5 Mark II...", imgSrc: EightCorner},
  { id: 2, name: "Led Nanlite Forza 300 Monolight", price: 500000, description: "Mô tả chi tiết sản phẩm EOS R5 Mark II...", imgSrc: ThreeKMonoLight },
  { id: 3, name: "Led Nanlite Forza 500 Monolight", price: 700000, description: "Mô tả chi tiết sản phẩm EOS R100", imgSrc: FiveKMonoLight },
  { id: 4, name: "Softbox Aputure Lantern", price: 800000, description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: SoftBox },
  { id: 5, name: "Flash ngoại cảnh GODOX Wistro AD600BM", price: 800000, description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: Wistro },
  { id: 6, name: "Nanguang CN-1200 CSA Led light", price: 800000, description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: CSALed },
];

function LightingRent() {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/Rent/Camera/${product.name}`, { state: { product } }); // Passing product as state
  };
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className='related-products-section'>
          <h2 className="section-title">ÁNH SÁNG</h2>
          <Row gutter={[16, 50]} justify="center">
            {products.map(product => (
              <Col key={product.id} xs={24} sm={24} md={12} lg={6}>
                <Card
                  className="custom-cardz"
                  hoverable
                  cover={<img alt={product.name} src={product.imgSrc} className="product-image" />}
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

export default LightingRent;
