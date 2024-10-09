import React from 'react';
import { Layout, Row, Col } from 'antd';
import './Terms.css';

const { Content } = Layout;

const Terms = () => {
  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="terms-section">
          <h1 className="section-title">Điều Khoản Cho Thuê Thiết Bị</h1>

          <Row >
            <Col span={24}>
              <div className="terms-box">
                <h2>Điều Khoản Khi Thuê Máy Ảnh Và Dụng Cụ Liên Quan</h2>
                <ol>
                  <li><strong>Bảo quản thiết bị:</strong> Người thuê có trách nhiệm bảo quản và sử dụng thiết bị đúng mục đích, tránh các trường hợp hư hỏng, mất mát.</li>
                  <li><strong>Tiền cọc:</strong> Khách hàng cần đặt cọc trước 30% giá trị của thiết bị hoặc một khoản tiền mặt nhất định tùy vào giá trị sản phẩm.</li>
                  <li><strong>Phí thuê:</strong> Phí thuê sẽ được tính theo ngày và thanh toán toàn bộ trước khi nhận thiết bị.</li>
                  <li><strong>Thời gian thuê:</strong> Người thuê phải trả lại thiết bị đúng thời gian quy định. Nếu trả muộn, sẽ tính thêm phí trễ hạn.</li>
                  <li><strong>Bảo hiểm thiết bị:</strong> MERENT khuyến nghị người thuê nên mua bảo hiểm cho thiết bị để tránh rủi ro khi thiết bị gặp sự cố trong quá trình sử dụng.</li>
                  <li><strong>Kiểm tra thiết bị:</strong> Người thuê có quyền kiểm tra thiết bị trước khi nhận và phải đảm bảo rằng thiết bị hoạt động tốt trước khi ra khỏi cửa hàng.</li>
                  <li><strong>Sử dụng đúng cách:</strong> Người thuê phải đảm bảo rằng thiết bị chỉ được sử dụng bởi người có kinh nghiệm và kỹ năng cần thiết.</li>
                  <li><strong>Hỏng hóc và sửa chữa:</strong> Nếu thiết bị bị hỏng trong thời gian thuê, người thuê phải chịu toàn bộ chi phí sửa chữa hoặc thay thế.</li>
                  <li><strong>Bảo mật dữ liệu:</strong> MERENT không chịu trách nhiệm về bất kỳ dữ liệu nào còn lưu trên thiết bị khi trả lại.</li>
                  <li><strong>Điều khoản hủy:</strong> Người thuê có thể hủy đặt thuê trước 24 giờ mà không mất phí. Nếu hủy trong vòng 24 giờ, sẽ bị mất khoản tiền cọc.</li>
                </ol>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default Terms;
