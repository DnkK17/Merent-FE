import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
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
