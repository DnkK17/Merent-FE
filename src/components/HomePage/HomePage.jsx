import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, message } from "antd";
import "./HomePage.css";
import newBackground2 from "../HomePage/images/newBackground.png";
import camerasBackground from "../HomePage/images/camerasBackground.png";
import EOSR1 from "../HomePage/images/EOSR1.jpg";
import EOSR50 from "../HomePage/images/EOSR50.png";
import EOSR100 from "../HomePage/images/EOSR100.png";
import EOSR5 from "../HomePage/images/EOSR5.png";
import sony from "../HomePage/images/sony.jpg";
import api from "../../services/apiConfig";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;



function HomePage() {
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [products,setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem("id");
    console.log(storedUser)
    if (storedUser) {
      setUserID(storedUser);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
   if(userID){
    walletResponse(userID)
   }
    

   
  },[userID]); // Chỉ gọi lại nếu userID thay đổi
  const walletResponse = async (userID) => {
     
    try {
      const { data } = await api.post(
        `https://merent.uydev.id.vn/api/Wallet/check-or-create-wallet/${userID}`
      );

      if (data.success ) {
        message.success(data.message || "Thành công khi lấy thông tin ví");
      } else {
        message.error(data.message || "Lỗi khi lấy thông tin ví");
      }
    } catch (error) {
      console.error("Wallet API error:", error);
      if (!userID) {
        message.info("Vui lòng đăng nhập để truy cập thông tin ví.");
        return;
      }
    }
  };
  const fetchProducts = async () => {
     
    try {
      const { data } = await api.get(
        `/Product/most-rented`
      );

      if (data.success ) {
        setProducts(data.data);
        console.log("Thành công khi lấy thông tin products");
      } else {
        console.log("Lỗi khi lấy thông tin products");
      }
    } catch (error) {
      console.error("Wallet API error:", error);
      if (!userID) {
        message.info("Vui lòng đăng nhập để truy cập thông tin ví.");
        return;
      }
    }
  };
  const handleProductClick = (product) => {
    navigate(`/Rent/Items/${product.name}`, { state: { product } }); // Passing product as state
  };
  return (
    <Layout className="layout">
      <div className="home-canon mx-auto">
        <img src={newBackground2} alt="background" />
      </div>
      <div className="home-camera mx-auto">
        <img src={camerasBackground} alt="camera background" />
      </div>

      <Content style={{ padding: "0 50px" }}>
        <div className="site-product">
          <h2 className="section-titl">Sản Phẩm Được Ưa Chuộng</h2>
          <Row gutter={[2, 99]} justify="center">
            {products.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="custom-cards"
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

export default HomePage;
