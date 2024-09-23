import React from 'react';
import { Row, Col, Card } from 'antd';
import stuService from '../HomePage/images/stuService.png'; // Đường dẫn tới ảnh studio 1
import "../RentPage/PhotoServices.css"

const services = [
  {
    id: 1,
    title: 'Chụp 1 giờ',
    price: '200.000đ/giờ',
    additionalFee: 'Sau 21:00 phụ phí 50.000đ/giờ',
    extra: 'Hỗ trợ thiết bị chụp cho HS, SV (Máy Canon 5D3, Lens 24 105)',
    discount: 'Khách hàng book lịch từ 5 tiếng trở lên được giảm 10% chi phí',
    image: stuService,
  },
  {
    id: 2,
    title: 'Quay 1 giờ',
    price: '300.000đ/giờ',
    additionalFee: 'Sau 21:00 phụ phí 50.000đ/giờ',
    discount: 'Khách hàng book lịch từ 5 tiếng trở lên được giảm 10% chi phí',
    image: stuService,
  },
];

const PhotoServices = () => {
  return (
    <div >
      <h2 className='header-title' style={{ textAlign: 'center' }}>CHO THUÊ STUDIO</h2>
      <Row gutter={[16, 16]} justify="center">
        {services.map(service => (
          <Col className='column-services' key={service.id} xs={24} sm={12} md={8} lg={8}>
             <Card
              hoverable
              cover={<img alt={service.title} src={service.image} />}
              style={{
                borderRadius: '15px',
                overflow: 'hidden',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%', // Đảm bảo thẻ chiếm 100% chiều rộng cột
                height:'450px',  
                paddingLeft:'20px',
                paddingRight:'20px'
              }}
            >
              <p>{service.title}: {service.price}</p>
              <p>{service.additionalFee}</p>
              {service.extra && <p>{service.extra}</p>}
              <p>{service.discount}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PhotoServices;
