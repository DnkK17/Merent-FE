import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import "../RentPage/PhotoServices.css"


const Combo = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch('https://merent.uydev.id.vn/api/Combo')
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
  return (
    <div >
      <h2 className='header-title' style={{ textAlign: 'center' }}>CÁC COMBO HIỆN CÓ</h2>
      <Row className='row-services' gutter={[0, 16]} justify="center">
        {products.map(product => (
          <Col className='column-services' key={product.id} xs={24} sm={12} md={8} lg={8}>
             <Card
              hoverable
              cover={<img alt={product.name} src={product.urlImg} style={{width:'100%',height:'350px'}}/>}
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%', 
                height:'450px',  
                paddingLeft:'20px',
                paddingRight:'20px'
              }}
            >
              <p>{product.description}</p>
              
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Combo;
