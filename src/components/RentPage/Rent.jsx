import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebaseConfig';
import {api} from '../../services/apiConfig';
import sony from "../HomePage/images/sony.jpg";
import EOSR1 from "../HomePage/images/EOSR1.jpg"
import EOSR50 from "../HomePage/images/EOSR50.png"
import EOSR100 from "../HomePage/images/EOSR100.png"
import EOSR5 from "../HomePage/images/EOSR5.png"
import EOSR1ngang from "../HomePage/images/EOSR1ngang.png"
import EOSR1sau from "../HomePage/images/EOSR1sau.png"
import EOSR1tren from "../HomePage/images/EOSR1tren.png"
import './Rent.css';

const { Content } = Layout;
const products = [
  { id: 1, name: "EOS R1", price: 350000, description: "Là mẫu máy ảnh thế hệ thứ 4 thuộc dòng máy ảnh EOS full-frame bán chạy nhất của Canon, EOS 5D Mark IV là sự kết hợp của tính chuyên nghiệp đi kèm những cải tiến đáng giá. Cảm biến CMOS full-frame 30.4 megapixel được trang bị cùng với công nghệ Dual Pixel CMOS AF thời thượng giúp lấy nét tự động nhanh hơn và chính xác hơn không chỉ đối với ảnh tĩnh mà còn quay phim 4K và quay phim thể loại footage một cách chuyên nghiệp. ", imgSrc: EOSR1, images: [EOSR1ngang, EOSR1sau, EOSR1tren] },
  { id: 2, name: "EOS R5 Mark II", price: 500000, description: "Mô tả chi tiết sản phẩm EOS R5 Mark II...", imgSrc: EOSR5, images: [sony, sony, sony] },
  { id: 3, name: "EOS R100", price: 700000, description: "Mô tả chi tiết sản phẩm EOS R100", imgSrc: EOSR100, images: [sony, sony, sony] },
  { id: 4, name: "EOS R50", price: 800000, description: "Mô tả chi tiết sản phẩm EOS R50", imgSrc: EOSR50, images: [sony, sony, sony] },
];
function Rent({ cartItems, setCartItems }) {
  // const [products, setProducts] = useState([null]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  // const [loading, setLoading] = useState(true); 
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await api.get('/Product');
  //       console.log(response.data); 
  //       console.log(response.data.data); 
  //       if (Array.isArray(response.data)) {
  //         setProducts(response.data.data);  
  //       } else {
  //         setProducts([response.data.data]);  
  //       }
  //     } catch (error) {
  //       message.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };
  console.log(products);

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => quantity > 1 && setQuantity(prev => prev - 1);

  const handleUpload = async ({ file }) => {
    const storageRef = ref(storage, `products/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        message.error('Upload failed: ' + error.message);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        message.success('Upload thành công!');
        setUploadedImage(downloadURL);  
      }
    );
  };
  const handleAddToCart = () => {
    if (selectedProduct && quantity > 0) { // Kiểm tra có sản phẩm được chọn và số lượng lớn hơn 0
      const newItem = {
        ...selectedProduct,
        quantity: quantity
      };
  
      const itemExists = cartItems.find(item => item.id === newItem.id);
  
      if (itemExists) {
        // Cập nhật số lượng nếu sản phẩm đã tồn tại trong giỏ
        const updatedCartItems = cartItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity } // Cộng dồn số lượng
            : item
        );
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Lưu giỏ hàng vào localStorage
      } else {
        // Thêm sản phẩm mới vào giỏ
        const updatedCartItems = [...cartItems, newItem];
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Lưu giỏ hàng vào localStorage
      }
  
      // Thông báo cho người dùng
      message.success(`${newItem.name} đã được thêm vào giỏ hàng!`);
    } else {
      // Thông báo lỗi nếu số lượng không hợp lệ
      message.error('Số lượng không hợp lệ. Vui lòng nhập số lượng lớn hơn 0.');
    }
  };
  
  
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        
          <>{selectedProduct && (
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
                  <Button type="primary" style={{ marginTop: '10px' }} onClick={() => {handleAddToCart();}}>Thêm vào giỏ</Button>

                  </div>
                </Col>
              </Row>
              
            </div>
            
          )}
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
                    <Card.Meta title={product.name} description={`${product.price} VNĐ`} />
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
          </>
        
      </Content>
    </Layout>
  );
}

export default Rent;
