import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import CanonEF from "../../HomePage/images/CanonEF.jpg"
import CanonRF from "../../HomePage/images/CanonRF.png"
import NikonAF from "../../HomePage/images/NikonAF.jpg"
import NikonZS from "../../HomePage/images/NikonZS.jpg"
import TamronDiIIVCHLD from "../../HomePage/images/TamronDiIIVCHLD.jpg"
import '../Rent.css';

const { Content } = Layout;
const products = [
  { id: 1, name: "Canon EF IS USM", price: 350000, description: "Mô tả chi tiết sản phẩm EOS R5 Mark II...", imgSrc: CanonEF},
  { id: 2, name: "Canon EF IS USM", price: 500000, description: "Mô tả chi tiết sản phẩm EOS R5 Mark II...", imgSrc: CanonRF },
  { id: 3, name: "Nikon AF-S ED VR", price: 700000, description: "Mô tả chi tiết sản phẩm EOS R100", imgSrc: NikonAF },
  { id: 4, name: "Nikon Z S", price: 800000, description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: NikonZS },
  { id: 5, name: "Tamron Di II VC HLD", price: 800000, description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: TamronDiIIVCHLD }
];

function LensRent() {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/Rent/Camera/${product.name}`, { state: { product } }); // Passing product as state
  };
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className='related-products-section'>
          <h2 className="section-title">ỐNG KÍNH</h2>
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

export default LensRent;
