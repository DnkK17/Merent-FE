import React, { useState, useEffect } from "react";
import { message, Table, Button, Typography, Badge, Descriptions, Input, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/apiConfig";
import axios from "axios";

const { Title } = Typography;

export default function ProfilePage() {
  const [wallet, setWallet] = useState(null);
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const formatPriceVND = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  useEffect(() => {
    fetchWalletInfo();
    fetchTransactions();

    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setUserID(userData.id);
    }
  }, []);

  useEffect(() => {
    if (userID) {
      fetchOrders(userID);
    }
  }, [userID]);

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search);
    const success = searchQuery.get("success");
    const canceled = searchQuery.get("canceled");
    const transactionId = searchQuery.get("transactionId");
    const amount = parseFloat(searchQuery.get("amount"));
  
    // Kiểm tra nếu transactionId đã có và giao dịch chưa xử lý
    if (transactionId && !sessionStorage.getItem(`processed-${transactionId}`)) {
      if (success === "true" && wallet && !loading) {
        // Xử lý giao dịch thành công
        setLoading(true);
        handleReturnTransaction(amount, wallet, "success")
          .finally(() => setLoading(false));
      } else if (canceled === "true" && wallet && !loading) {
        // Xử lý giao dịch bị hủy
        setLoading(true);
        handleReturnTransaction(amount, wallet, "canceled")
          .finally(() => setLoading(false));
      }
    }
  }, [location.search, wallet]);
  

  const fetchWalletInfo = async () => {
    try {
      const { data } = await api.get("/Wallet/user-wallet");
      if (data.success && data.data.length > 0) {
        setWallet(data.data[0]);
      } else {
        message.error(data.message || "Lỗi khi lấy thông tin ví");
      }
    } catch (error) {
      message.info("Vui lòng đăng nhập để truy cập thông tin ví.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/Transaction/transactions-user?walletTypeEnums=0");
      if (data.success && data.data) {
        setTransactions(data.data);
      } else {
        message.error(data.message || "Lỗi khi lấy lịch sử giao dịch");
      }
    } catch (error) {
      message.info("Vui lòng đăng nhập để truy cập thông tin giao dịch.");
    }
  };

  const fetchOrders = async (userID) => {
    try {
      const response = await axios.get(
        `https://merent.uydev.id.vn/api/ProductOrder/user/${userID}`
      );
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handlePayOS = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      message.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      const walletResponse = await api.put(`/Wallet/${wallet.id}`, {
        id: wallet.id,
        userId: wallet.userId,
        cash: wallet.cash + amount,
        walletType: wallet.walletType,
      });

      if (walletResponse.data.success) {
        message.success("Số dư ví được cập nhật thành công!");
        setWallet({ ...wallet, cash: wallet.cash + amount });

        const { data } = await api.post("/Wallet/create-payment-link-payos", { amount });
        message.success("Liên kết thanh toán được tạo thành công");
        window.location.href = data.data;
      } else {
        message.error(walletResponse.data.message || "Lỗi khi tạo liên kết thanh toán");
      }
    } catch (error) {
      console.error("Error during PayOS:", error);
      message.error("Lỗi khi kết nối máy chủ để tạo liên kết thanh toán.");
    }
  };

  const handleReturnTransaction = async (amount, wallet, type) => {
    try {
      if (!wallet) {
        message.error("Không thể xác định thông tin ví.");
        return;
      }
  
      if (isNaN(amount) || amount <= 0) {
        message.error("Số tiền nạp không hợp lệ.");
        return;
      }
  
      // Tránh trừ tiền nhiều lần
      const updatedCash = wallet.cash - amount;
  
      if (updatedCash < 0 && type === "canceled") {
        message.error("Số dư không đủ để trừ.");
        return;
      }
  
      let response;
      if (type === "success") {
        // Xử lý khi giao dịch thành công, có thể là việc cập nhật ví
        response = await api.put(`/Wallet/${wallet.id}`, {
          id: wallet.id,
          userId: wallet.userId,
          cash: updatedCash,
          walletType: wallet.walletType,
        });
        if (response.data.success) {
          setWallet({ ...wallet, cash: updatedCash });
          message.success("Giao dịch thành công.");
        }
      } else if (type === "canceled") {
        // Xử lý khi giao dịch bị hủy
        response = await api.put(`/Wallet/${wallet.id}`, {
          id: wallet.id,
          userId: wallet.userId,
          cash: wallet.cash, // Không thay đổi số dư ví nếu giao dịch bị hủy
          walletType: wallet.walletType,
        });
        if (response.data.success) {
          message.info("Giao dịch đã bị hủy.");
        }
      }
  
      // Đánh dấu giao dịch đã xử lý để tránh trừ tiền nhiều lần
      sessionStorage.setItem(`processed-${transactionId}`, "true");
    } catch (error) {
      console.error("Error handling transaction:", error);
      message.error("Lỗi trong quá trình xử lý giao dịch.");
    }
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const transactionColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => formatPriceVND(amount),
    },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const orderColumns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    {
      title: "Total Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (amount) => formatPriceVND(amount),
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleString(),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Status", dataIndex: "statusOrder", key: "statusOrder" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {user && wallet && (
        <>
          <Title level={3}>My Information</Title>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Descriptions title="User Info" bordered column={1}>
                <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{user.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge status="processing" text="Active" />
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div className="flex-1">
              <Descriptions title="Wallet Info" bordered column={1}>
                <Descriptions.Item label="Balance">
                  {formatPriceVND(wallet.cash)}
                </Descriptions.Item>
                <Descriptions.Item label="Wallet Type">
                  {wallet.walletType === 0 ? "Personal" : "Business"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
          <div className="my-6">
            <Title level={4}>Transaction History</Title>
            <Table columns={transactionColumns} dataSource={transactions} rowKey="id" />
          </div>
          <div className="my-6">
            <Title level={4}>Orders</Title>
            <Table columns={orderColumns} dataSource={orders} rowKey="id" />
          </div>
          <div>
            <Button type="primary" onClick={showModal}>
              Deposit Funds
            </Button>
            <Modal
              title="Deposit Funds"
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount to deposit"
                min={0}
              />
              <Button
                type="primary"
                onClick={handlePayOS}
                style={{ marginTop: "20px" }}
                loading={loading}
              >
                Deposit
              </Button>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}
