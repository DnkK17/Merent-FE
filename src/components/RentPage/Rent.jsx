import React, { useState } from 'react';
import { Layout, Row, Col, Card, Button } from 'antd';
import './Rent.css';
import sony from "../HomePage/images/sony.jpg";

const { Content } = Layout;

const products = [
  { id: 1, name: "EOS R1", price: "350.000VNĐ", description: "Là mẫu máy ảnh thế hệ thứ 4 thuộc dòng máy ảnh EOS full-frame bán chạy nhất của Canon, EOS 5D Mark IV là sự kết hợp của tính chuyên nghiệp đi kèm những cải tiến đáng giá. Cảm biến CMOS full-frame 30.4 megapixel được trang bị cùng với công nghệ Dual Pixel CMOS AF thời thượng giúp lấy nét tự động nhanh hơn và chính xác hơn không chỉ đối với ảnh tĩnh mà còn quay phim 4K và quay phim thể loại footage một cách chuyên nghiệp. ", imgSrc: sony, images: [sony, sony, sony] },
  { id: 2, name: "EOS R5 Mark II", price: "500.000VNĐ", description: "Mô tả chi tiết sản phẩm EOS R5 Mark II...", imgSrc: sony, images: [sony, sony, sony] },
  { id: 3, name: "EOS R100", price: "700.000VNĐ", description: "Mô tả chi tiết sản phẩm EOS R100", imgSrc: sony, images: [sony, sony, sony] },
  { id: 4, name: "EOS R50", price: "800.000VNĐ", description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: sony, images: [sony, sony, sony] },
  { id: 5, name: "Sony A7III", price: "350.000VNĐ",description: "Mô tả chi tiết sản phẩm Sony A7III", imgSrc: sony, images: [sony, sony, sony] },
  { id: 6, name: "Sony A7IV", price: "500.000VNĐ", description: "Mô tả chi tiết sản phẩm Sony A7IV", imgSrc: sony, images: [sony, sony, sony] },
];
const categories = [
  { id: 1, name: "Máy ảnh" },
  { id: 2, name: "Ống kính" },
  { id: 3, name: "Chân máy" },
  { id: 4, name: "Ánh sáng" },
  { id: 5, name: "Fly Cam" }
];
function Rent() {
  const [selectedProduct, setSelectedProduct] = useState(null); // Không chọn sản phẩm mặc định

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Khi nhấn vào sản phẩm, set nó thành selectedProduct
    window.scrollTo({
      top: 240  ,
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
        <div className="category-section">
          <Row gutter={[16, 16]} justify="center">
            {categories.map(category => (
              <Col key={category.id}>
                <Button type="default" className="category-button">
                  {category.name}
                </Button>
              </Col>
            ))}
          </Row>
        </div>
        {selectedProduct && (
          <div className='selected-product'>
            <Row gutter={[16, 16]} justify="center">
              <Col xs={24} sm={24} md={12} lg={12}>
                <img alt={selectedProduct.name} src={selectedProduct.imgSrc} className="product-image-large" />
                <Row gutter={[16, 16]} justify="center" className="small-images-row">
                  {selectedProduct.images.map((img, index) => (
                    <Col key={index} xs={6}>
                      <img alt={`${selectedProduct.name} - ${index}`} src={img} className="product-image-small" />
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col  xs={24} sm={24} md={12} lg={6}>
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
              </Col>
            </Row>
          </div>
        )}

        {/* Hiển thị các sản phẩm khác */}
        <div className='related-products-section'>
          <h2 className="section-title">MÁY ẢNH / MÁY CHỤP HÌNH</h2>
          <Row gutter={[16, 50]} justify="center">
            {products
              .filter(product => product !== selectedProduct)
              .map(product => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className="custom-card"
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
