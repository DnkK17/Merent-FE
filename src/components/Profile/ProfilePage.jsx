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

  // Fetch initial data
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
    const query = new URLSearchParams(location.search);
    const transactionId = query.get("id");
    const status = query.get("status");
    const isCancelled = query.get("cancel") === "true";
    console.log(status,isCancelled);
    if (transactionId) {
      handleReturnTransaction(transactionId, isCancelled ? "CANCELLED" : status);
    }
  }, [location]);
  

  // Fetch wallet information
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

  // Fetch transaction history
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

  // Fetch user orders
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

  // Handle deposit via PayOS
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
  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search);
    const hashQuery = new URLSearchParams(location.hash.split("?")[1]);
  
    const transactionId = hashQuery.get("transactionId") || searchQuery.get("id");
    const status = hashQuery.get("status") || searchQuery.get("status");
    const isCancelled = hashQuery.get("cancel") === "true" || searchQuery.get("cancel") === "true";
    const amount = parseFloat(hashQuery.get("amount") || searchQuery.get("amount"));
  
    if (transactionId) {
      handleReturnTransaction(transactionId, isCancelled ? "CANCELLED" : status, amount);
    }
  }, [location]);
  
  const handleReturnTransaction = async (transactionId, status, amount) => {
    try {
      if (!wallet) {
        message.error("Không thể xác định thông tin ví.");
        return;
      }
  
      if (isNaN(amount) || amount <= 0) {
        message.error("Số tiền nạp không hợp lệ.");
        return;
      }
  
      if (status === "CANCELLED") {
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
  
        if (response.data.success) {
          setWallet({ ...wallet, cash: updatedCash });
          message.info("Số tiền đã bị trừ khỏi ví do giao dịch không hoàn tất.");
        } else {
          throw new Error(response.data.message || "Lỗi khi cập nhật ví.");
        }
      } else if (status === "SUCCESS") {
        message.success("Giao dịch thành công, số tiền nạp đã được giữ nguyên.");
      }
    } catch (error) {
      console.error("Error handling transaction return:", error);
      message.error("Lỗi trong quá trình xử lý giao dịch.");
    }
  };
  
  
  // Modal handlers
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  // Table columns
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
            <div className="flex-1 flex flex-col mt-4 items-center justify-center">
              <div className="flex items-center justify-center gap-5 flex-col">
                <h2 className="text-black text-2xl font-bold">
                  Current Balance: {formatPriceVND(wallet.cash)}
                </h2>
              </div>
              <Button type="primary" onClick={showModal} className="mt-4 w-full md:w-auto">
                Deposit PayOS
              </Button>
            </div>
          </div>
        </>
      )}
      <Title level={3}>My Transactions</Title>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table
          columns={transactionColumns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
      <Title level={3}>My Orders</Title>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </div>
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Enter Deposit Amount</h2>
            <Input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="mb-4 w-full px-3 py-2 border rounded-md"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDepositPayOS}
                className={`px-4 py-2 text-white rounded-md ${
                  loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
