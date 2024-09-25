import React, { useState } from 'react';
import { Layout, Row, Col, Card, Button } from 'antd';
import './Rent.css';
import sony from "../HomePage/images/sony.jpg";
import camerasBackground from "../HomePage/images/camerasBackground.png"
import EOSR1 from "../HomePage/images/EOSR1.jpg"
import EOSR50 from "../HomePage/images/EOSR50.png"
import EOSR100 from "../HomePage/images/EOSR100.png"
import EOSR5 from "../HomePage/images/EOSR5.png"
import EOSR1ngang from "../HomePage/images/EOSR1ngang.png"
import EOSR1sau from "../HomePage/images/EOSR1sau.png"
import EOSR1tren from "../HomePage/images/EOSR1tren.png"
const { Content } = Layout;

const products = [
  { id: 1, name: "EOS R1", price: "350.000VNĐ", description: "Là mẫu máy ảnh thế hệ thứ 4 thuộc dòng máy ảnh EOS full-frame bán chạy nhất của Canon, EOS 5D Mark IV là sự kết hợp của tính chuyên nghiệp đi kèm những cải tiến đáng giá. Cảm biến CMOS full-frame 30.4 megapixel được trang bị cùng với công nghệ Dual Pixel CMOS AF thời thượng giúp lấy nét tự động nhanh hơn và chính xác hơn không chỉ đối với ảnh tĩnh mà còn quay phim 4K và quay phim thể loại footage một cách chuyên nghiệp. ", imgSrc: EOSR1, images: [EOSR1ngang, EOSR1sau, EOSR1tren] },
  { id: 2, name: "EOS R5 Mark II", price: "500.000VNĐ", description: "Mô tả chi tiết sản phẩm EOS R5 Mark II...", imgSrc: EOSR5, images: [sony, sony, sony] },
  { id: 3, name: "EOS R100", price: "700.000VNĐ", description: "Mô tả chi tiết sản phẩm EOS R100", imgSrc: EOSR100, images: [sony, sony, sony] },
  { id: 4, name: "EOS R50", price: "800.000VNĐ", description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: EOSR50, images: [sony, sony, sony] },
];

function Rent() {
  const [selectedProduct, setSelectedProduct] = useState(null); // Không chọn sản phẩm mặc định

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Khi nhấn vào sản phẩm, set nó thành selectedProduct
    window.scrollTo({
      top: 350  ,
      behavior: 'smooth' // Tạo hiệu ứng cuộn mượt
    });
  };
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        {/* Hiển thị sản phẩm được chọn */}
        {selectedProduct && (
          <div className='selected-product'>
            <Row className='camera-detail' gutter={[16, 16]} justify="center">
              <Col  xs={24} sm={24} md={12} lg={12}>
                <img alt={selectedProduct.name} src={selectedProduct.imgSrc} className="product-image-large" />
                <Row gutter={[16, 16]} justify="space-between" className="small-images-row">
                  {selectedProduct.images.map((img, index) => (
                    <Col key={index} xs={6}>
                      <img alt={`${selectedProduct.name} - ${index}`} src={img} className="product-image-small" />
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col  xs={24} sm={24} md={12} lg={6}>
              <div className='camera-description'>
                <h1>{selectedProduct.name}</h1>
                <h2 style={{ color: 'red' }}>{selectedProduct.price}</h2>
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
                <Button type="primary" style={{ marginTop: '10px' }}>Thêm vào giỏ</Button>
                </div>
              </Col>
            </Row>
            
          </div>
          
        )}

        {/* Hiển thị các sản phẩm khác */}
        <div className='related-products-section'>
          <h2 className="section-title">MÁY ẢNH / MÁY QUAY PHIM</h2>
          <Row gutter={[16, 50]} justify="center">
            {products
              .filter(product => product !== selectedProduct)
              .map(product => (
                <Col key={product.id} xs={24} sm={24} md={12} lg={6}>
                  <Card
                    className="custom-cardz"
                    hoverable
                    cover={<img alt={product.name} src={product.imgSrc} className="product-image" />}
                    onClick={() => handleProductClick(product)}
                  >
                    <Card.Meta title={product.name} description={product.price} />
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
