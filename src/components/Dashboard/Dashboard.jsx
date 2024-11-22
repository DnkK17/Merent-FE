import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "antd";
import { Bar } from 'react-chartjs-2';
import "./Dashboard.css";
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
  const [approvedOrdersPerMonth, setApprovedOrdersPerMonth] = useState(
    Array(12).fill(0) // Khởi tạo mảng chứa số lượng Approved theo từng tháng
  );
  const [orders, setOrders] = useState([]); // Lưu danh sách đơn hàng
  const [totalProducts, setTotalProducts] = useState(0); // State để lưu tổng số hàng hóa
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const ordersPerPage = 5; // Số đơn hàng hiển thị mỗi trang
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm của đơn hàng
  useEffect(() => {
    axios
      .get("https://merent.uydev.id.vn/api/ProductOrder")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        setOrders(data);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);
  useEffect(() => {
    axios
      .get("https://merent.uydev.id.vn/api/ProductOrder")
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        setOrders(data);

        // Xử lý thống kê số lượng đơn hàng Approved theo từng tháng
        const approvedCounts = Array(12).fill(0); // Mảng chứa số lượng đơn hàng cho 12 tháng
        data.forEach((order) => {
          if (order.statusOrder === "Approved") {
            const month = new Date(order.orderDate).getMonth(); // Lấy tháng (0-11)
            approvedCounts[month] += 1;
          }
        });
        setApprovedOrdersPerMonth(approvedCounts);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  // Gọi API để lấy tổng số sản phẩm
  useEffect(() => {
    axios
      .get("https://merent.uydev.id.vn/api/Product")
      .then((response) => {
        const totalCount = Array.isArray(response.data) ? response.data.length : 0;
        setTotalProducts(totalCount); // Cập nhật tổng số hàng hóa
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const salesData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Approved Orders",
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(99, 102, 241, 0.9)",
        data: approvedOrdersPerMonth, // Số lượng Approved theo từng tháng
      },
    ],
  };

  // Tính toán số trang
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Lấy dữ liệu orders của trang hiện tại
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Xử lý phê duyệt đơn hàng
  const handleApprove = (order) => {
    // Cập nhật UI trước
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === order.id ? { ...o, statusOrder: "Approved" } : o
      )
    );

    // Thực hiện gọi API
    axios
      .put(`https://merent.uydev.id.vn/api/ProductOrder/${order.id}`, {
        decription: order.decription || "",
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        totalPrice: order.totalPrice,
        userID: order.userID,
        statusOrder: "Approved",
      })
      .catch((error) => {
        console.error("Error approving order:", error);

        // Nếu lỗi, khôi phục trạng thái cũ
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === order.id ? { ...o, statusOrder: order.statusOrder } : o
          )
        );
      });
  };

  // Xử lý từ chối đơn hàng
  const handleReject = async (order) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === order.id ? { ...o, statusOrder: "Rejected" } : o
      )
    );
    try {
      // Bước 1: Hoàn tiền
      await axios.post(`https://merent.uydev.id.vn/api/Wallet/refund?userId=${order.userID}&amount=${order.totalAmount}`, {
        
          userId: order.userID,
          amount: order.totalAmount,
        
      });

      // Bước 2: Cập nhật trạng thái của order
      await axios.put(
        `https://merent.uydev.id.vn/api/ProductOrder/${order.id}`,
        {
          decription: order.decription || "",
          orderDate: order.orderDate,
          totalAmount: order.totalAmount,
          totalPrice: order.totalPrice,
          userID: order.userID,
          statusOrder: "Rejected",
        }
      );
    } catch (error) {
      console.error("Error rejecting order:", error);
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id ? { ...o, statusOrder: order.statusOrder } : o
        )
      );
    }
  };
  const fetchOrderDetails = (orderId) => {
    axios
      .get(`https://merent.uydev.id.vn/api/ProductOrderDetail`)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : response.data.data || [];
        const filteredProducts = data.filter((item) => item.orderId === orderId);

        // Lấy thông tin chi tiết của sản phẩm từ API Product
        Promise.all(
          filteredProducts.map((product) =>
            axios.get(`https://merent.uydev.id.vn/api/Product/${product.productID}`).then((res) => ({
              productID: product.productID,
              quantity: product.quantity,
              unitPrice: product.unitPrice,
              productName: product.productName, 
             
            }))
            
          )
          
        )
        
          .then((results) => setProducts(results)) 
          .catch((error) => console.error("Error fetching product details:", error));
      })
      .catch((error) => console.error("Error fetching order details:", error));
  };

  // Hiển thị modal khi nhấn vào đơn hàng
  const handleShowOrderDetails = (order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
    setModalVisible(true);
    console.log(products);
  };
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div className="stat">
          <h3>KHÁCH HÀNG</h3>
          <p>{totalProducts}</p>
          <span>↑ 12% Since last month</span>
        </div>
        <div className="stat">
          <h3>TỔNG HÀNG HÓA</h3>
          <p>{totalProducts}</p> {/* Hiển thị tổng số sản phẩm */}
          <span>↓ 16% Since last month</span>
        </div>
        <div className="stat">
          <h3>DỊCH VỤ</h3>
          <p>75.5%</p>
        </div>
        <div className="stat">
          <h3>DOANH THU</h3>
          <p>$15k</p>
        </div>
      </div>
      <div className="dashboard-content-main">
        <div className="sales-chart">
          <h4>Sales</h4>
          <Bar data={salesData} />
        </div>
        <div className="traffic-source">
          <h4>Đơn hàng</h4>
          <table className="orders-table">
            <thead style={{ color: "black" }}>
              <tr>
                <th>ID</th>
                <th>Description</th>            
                <th>Order Date</th>
                <th>Amount</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order.id} style={{ color: "black" }}>
                  <td>{order.id}</td>
                  <td>{order.description}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>{order.totalAmount}</td>
                  <td>${order.totalPrice}</td>
                  {/* Cột Status với màu động */}
                  <td
                    style={{
                      color:
                        order.statusOrder === "Pending"
                          ? "goldenrod"
                          : order.statusOrder === "Approved"
                          ? "green"
                          : order.statusOrder === "Rejected"
                          ? "red"
                          : "black",
                    }}
                  >
                    {order.statusOrder || ""}
                  </td>
                  <td>
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(order)}
                      disabled={order.statusOrder != null && order.statusOrder != 'Pending'}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(order)}
                      disabled={order.statusOrder != null&& order.statusOrder != 'Pending'}
                    >
                      Reject
                    </button>
                    <button
                        className="btn-detail"
                      onClick={() => handleShowOrderDetails(order)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="pagination" style={{ width: 100, marginRight: 0 }}>
            <button
              className={`page-button arrow ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={`page-button arrow ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
       {/* Modal hiển thị chi tiết sản phẩm */}
       <Modal
        title={`Chi tiết sản phẩm của đơn hàng #${selectedOrder?.id}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <table className="products-table">
          <thead>
            <tr >
              <th style={{paddingRight:'20px'}}>Product ID</th>
              <th style={{paddingRight:'20px'}}>Tên sản phẩm</th>
              <th style={{paddingRight:'20px'}}>Số lượng</th>
              <th style={{paddingRight:'20px'}}>Đơn giá 1 sản phẩm</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productID}>
                <td>{product.productID}</td>
                <td>{product.productName}</td>
                <td>{product.quantity}</td>
                <td>{product.unitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
    
  );
};

export default Dashboard;
