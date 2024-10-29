import React, { useState, useEffect } from "react";
import { message, Table, Button, Typography, Badge, Descriptions, Input } from "antd";
import api from "../../services/apiConfig";

const { Title } = Typography;

export default function ProfilePage() {
  const [wallet, setWallet] = useState(null);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatPriceVND = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  useEffect(() => {
    fetchWalletInfo();
    fetchTransactions();
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchWalletInfo = async () => {
    try {
      const { data } = await api.get("/Wallet/user-wallet");
      if (data.success && data.data.length > 0) {
        setWallet(data.data[0]);
      } else {
        message.error(data.message || "Lỗi khi lấy thông tin ví");
      }
    } catch (error) {
        // message.info("Please log in to access your profile information.");
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
      message.info("Please log in to access your profile information.");
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
      const { data } = await api.post("/Wallet/create-payment-link-payos", { amount });
      setLoading(false);
      setIsModalVisible(false);
      if (data.success) {
        message.success("Nạp tiền thành công");
        window.location.href = data.data;
      } else {
        message.error(data.message || "Lỗi khi tạo liên kết nạp tiền");
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message || "Lỗi kết nối máy chủ");
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

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      

      {user && wallet && (
        <>
            <Title level={3}>My information</Title>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
          {/* User Info */}
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

          {/* Wallet Info */}
          <div className="flex-1 flex flex-col mt-4 items-center justify-center">
            <div className="flex items-center justify-center gap-5 flex-col">
              {/* avatar */}
              <div className="flex items-start space-x-4">
                <img
                  src={user.imageUrl || "https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-6/434639623_2472335909820855_3445831790382380226_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH-JQHaw_WbpG_KQ6b1YCtdNK-YQkwx0GM0r5hCTDHQY2TUsHTszOyVfIqanSt136aP3B4H8N63KHWtvBlFwMie&_nc_ohc=BSgPp-hvNKIQ7kNvgFtbUxD&_nc_zt=23&_nc_ht=scontent.fsgn15-1.fna&_nc_gid=A_35gJlWRcofN_mM26y6t2j&oh=00_AYD0icS8m6BHT4Te--Xaw5RKh_6N7FZlzxQh436VB55DKQ&oe=67262145"}
                  alt="User Avatar"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
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

      {transactions.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Table
            columns={transactionColumns}
            dataSource={transactions}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      ) : (
        <Typography.Text>No transactions found.</Typography.Text>
      )}

      {/* Deposit Modal using Tailwind */}
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
                className={`px-4 py-2 text-white rounded-md ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
