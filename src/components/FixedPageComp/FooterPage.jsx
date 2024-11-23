import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FixedComp.css'; // Import file CSS

const FooterPage = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer"  style={{marginTop:'70px',color:' #e5e5e5',backgroundColor:'#012043'}}>
      <div className="footer-section">
        <h1 className="footer-logo">MERENT</h1>
        <p className="footer-description">
          MERENT - me(dia)rent, cung cấp dịch vụ cho thuê máy ảnh, chân máy, ánh sáng,... tiện lợi và nhanh chóng
        </p>
        <div className="social-icons">
        <img
            src="https://i.pinimg.com/736x/1b/60/f9/1b60f9d42fd84e31b304d5e7779cccfd.jpg"
            alt="Facebook"
            className="icon"
            onClick={() => window.open('https://www.facebook.com/profile.php?id=61565922489145', '_blank')}
            role="button"
            aria-label="Facebook"
          
        
          />
          <img
            src="https://i.pinimg.com/enabled_lo_mid/736x/87/6f/3b/876f3b2ab388ed7297c7432e840c9cd5.jpg"
            alt="Instagram"
            className="icon"
            onClick={() => window.open('https://www.instagram.com/merent219/', '_blank')}
            role="button"
            aria-label="Instagram"
          />

        </div>
      </div>

      <div className="footer-section" style={{marginTop:'30px'}}>
        <h3>SUPPORT</h3>
        <ul className='margin'>
          <li onClick={() => navigate('/TermsOfUse')}>Terms of use</li>
          <li style={{marginTop:'8px'}} onClick={() => navigate('/TermsOfUse')}>Private Policy</li>
        </ul>
      </div>

      <div className="footer-section" style={{marginTop:'30px'}}>
        <h3>COMPANY</h3>
        <ul  className='margin'>
          <li onClick={() => navigate('/About')}>About us</li>
          <li style={{marginTop:'8px'}} onClick={() => navigate('/Contact')}>Contact</li>
        </ul>
      </div>

      <div className="footer-section" style={{marginTop:'30px'}}>
        <h3>SHOP</h3>
        <ul  className='margin'>
          <li onClick={() => navigate('/Profile')}>My account</li>
          <li style={{marginTop:'8px'}} onClick={() => navigate('/Cart')}>Cart</li>
        </ul>
      </div>

      <div className="footer-section payment" >
        <h3>ACCEPTED PAYMENT</h3>
        <div className="payment-icons">
          <img src="https://payos.vn/wp-content/uploads/sites/13/2023/07/Untitled-design-8.svg" alt="PayOS" />
         
        </div>
        <div className="subscribe">
          <input type="email" placeholder="Enter your email..." />
          <button type="button">📧</button>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;
