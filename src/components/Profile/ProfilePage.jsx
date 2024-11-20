import React, { useState, useEffect } from "react";
import { message, Table, Button, Typography, Badge, Descriptions, Input } from "antd";
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
    console.log(location.search); // In ra phần query string của URL
console.log(location.hash);   // In ra phần hash của URL

    const searchQuery = new URLSearchParams(location.search);
    const hashParams = location.hash.includes("?")
    ? new URLSearchParams(location.hash.split("?")[1])
    : new URLSearchParams();
    console.log(searchQuery);
    const transactionId = hashParams.get("transactionId") || searchQuery.get("id");
    const status = hashParams.get("status") || searchQuery.get("status");
    const isCancelled =
    hashParams.get("cancel")|| searchQuery.get("canceled") || searchQuery.get("success");
    const amount = parseFloat(hashParams.get("amount") || searchQuery.get("amount"));
    console.log(transactionId);
    console.log(status);
    
    if (isCancelled != 'success') {
      handleReturnTransaction( amount);
    }
  }, [location]);

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
        message.error(data.message || "Lỗi khi tạo liên kết thanh toán");
      }
    } catch (error) {
      console.error("Error during PayOS:", error);
      message.error("Lỗi khi kết nối máy chủ để tạo liên kết thanh toán.");
    }
  };

  const handleDepositPayOS = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      message.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    setLoading(true);

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
        setLoading(false);
        setIsModalVisible(false);

        if (data.success) {
          message.success("Nạp tiền thành công");
          window.location.href = data.data;
        } else {
          message.error(data.message || "Lỗi khi tạo liên kết nạp tiền");
        }
      } else {
        throw new Error(walletResponse.data.message || "Lỗi khi cập nhật ví");
      }
    } catch (error) {
      console.error("Error during deposit:", error);
      message.error(error.message || "Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnTransaction = async ( amount) => {
    try {
      if (!wallet) {
        message.error("Không thể xác định thông tin ví.");
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        message.error("Số tiền nạp không hợp lệ.");
        return;
      }

      
        const updatedCash = wallet.cash - amount;

        if (updatedCash < 0) {
          message.error("Số dư không đủ để trừ.");
          return;
        }

        const response = await api.put(`/Wallet/${wallet.id}`, {
          id: wallet.id,
          userId: wallet.userId,
          cash: updatedCash,
          walletType: wallet.walletType,
        });
        console.log(updatedCash);
        if (response.data.success) {
          setWallet({ ...wallet, cash: updatedCash });
          message.info("Số tiền đã bị trừ khỏi ví do giao dịch không hoàn tất.");
        } else {
          throw new Error(response.data.message || "Lỗi khi cập nhật ví.");
        }
     
    } catch (error) {
      console.error("Error handling transaction return:", error);
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
                <Descriptions.Item label="Wallet ID">{wallet.id}</Descriptions.Item>
                <Descriptions.Item label="Cash">{formatPriceVND(wallet.cash)}</Descriptions.Item>
              </Descriptions>
              <div className="mt-4">
                <Input
                  type="number"
                  placeholder="Enter deposit amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button
                  type="primary"
                  className="mt-2 w-full"
                  onClick={handlePayOS}
                  loading={loading}
                >
                  Deposit
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <Title level={3}>Transaction History</Title>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table
          columns={transactionColumns}
          dataSource={transactions}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </div>

      <Title level={3}>My Orders</Title>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}
