import React from 'react';

const WorkshopPage = () => {
  const workshopDetails = [
    'Chào mừng bạn đến với workshop hướng dẫn quay phim! Tại đây, chúng ta sẽ khám phá cách tạo ra những cảnh quay đẹp, chuyên nghiệp và ấn tượng. Hãy sẵn sàng để học hỏi và thử nghiệm những kỹ thuật mới!',
    'Trong workshop này, chúng ta sẽ bao gồm các chủ đề sau:',
    'Cơ bản về quay phim: Hiểu về khái niệm khung hình, góc quay, ánh sáng, và âm thanh.',
    'Thiết bị quay phim: Tìm hiểu về máy ảnh, ống kính, gimbal, và các phụ kiện quan trọng khác.',
    'Kỹ thuật quay phim: Học cách chọn góc quay, lấy nét, và tạo hiệu ứng động.',
    'Biên tập video: Sử dụng phần mềm để cắt ghép, chỉnh sửa, và tạo video hoàn chỉnh.'
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>WORKSHOP</h2>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/merent-242d6.appspot.com/o/Screenshot%202024-10-15%20161110.png?alt=media&token=1156fa07-009c-4367-a578-096e28a9fb5f"
        alt="Workshop setup"
        style={styles.image}
      />
      <ul style={styles.list}>
        {workshopDetails.map((item, index) => (
          <li key={index} style={styles.listItem}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9'
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333'
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: '20px',
    borderRadius: '8px'
  },
  list: {
    listStyleType: 'disc',
    padding: '0 20px',
    textAlign: 'left',
    fontSize: '16px',
    color: '#555'
  },
  listItem: {
    marginBottom: '10px'
  }
};

export default WorkshopPage;
