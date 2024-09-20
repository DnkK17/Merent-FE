import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">GIỚI THIỆU</h1>
      <div className="about-content">
        <h2>
          Dịch vụ Cho Thuê thiết Bị Hỗ Trợ Quay Phim và Chụp Hình - <span className="merent">MERENT</span>
        </h2>
        <p>
          Chuyên Cho Thuê Các Thiết Bị Quay Chụp: <strong>Camera, Máy Quay, Lens, Tripod, Gimbal, Đèn, Micro, Livestream, Studio.</strong>
        </p>
        <h3>Lời ngỏ:</h3>
        <p>
          Đầu tiên xin chúc các bạn thật nhiều sức khỏe, luôn gặp nhiều thuận lợi và thành công trong các dự án phim ảnh của mình. Cám ơn các bạn đã ghé thăm và quan tâm đến dịch vụ của chúng tôi.
        </p>
        <p>
          <span className="merent">MERENT</span> là đơn vị chuyên cho thuê thiết bị quay phim và chụp hình. Với mục tiêu trở thành địa điểm tin cậy cho anh em làm phim và nhiếp ảnh, chúng tôi luôn cố gắng cung cấp trang thiết bị tốt nhất, đầy đủ nhất kịp thời mọi lúc. Đặc biệt <span className="merent">MERENT</span> có hệ thống studio ngay tại chỗ, giúp bạn tiết kiệm tối đa chi phí và thời gian để vận hành.
        </p>
        <p>
          Với đội ngũ nhân sự tận tâm, <span className="merent">MERENT</span> hi vọng sẽ được đồng hành cùng bạn trong những dự án về ảnh sắp tới.
        </p>
      </div>
    </div>
  );
}

export default About;
