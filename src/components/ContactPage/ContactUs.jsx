import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Liên hệ với chúng tôi</h1>
      <p className="contact-description">
        Liên hệ trực tiếp để được hỗ trợ tư vấn các sản phẩm và dịch vụ
      </p>
      <div className="contact-info">
        <div className="contact-item">
          <h3>Email:</h3>
          <p>quangbhse172365@fpt.edu.vn</p>
          <p>khoidnse172013@fpt.edu.vn</p>
        </div>
        <div className="contact-item">
          <h3>Số điện thoại:</h3>
          <p>0816059880</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
