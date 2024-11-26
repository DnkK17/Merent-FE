import React, { useState, useEffect } from "react";
import { message, Table, Button, Typography, Badge, Descriptions, Input, Modal ,Form} from "antd";
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
  const [isModalDepositVisible, setIsModalDepositVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
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
      

     

        const { data } = await api.post("/Wallet/create-payment-link-payos", { amount });
        message.success("Liên kết thanh toán được tạo thành công");
        window.location.href = data.data;
      
      
    } catch (error) {
      console.error("Error during PayOS:", error);
      message.error("Lỗi khi kết nối máy chủ để tạo liên kết thanh toán.");
    }
  };


  const showModalDeposit = () => setIsModalDepositVisible(true);
  const handleCancelDeposit = () => setIsModalDepositVisible(false);
  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleUpdateProfile = async (values) => {
    setLoading(true);
    try {
      // Lấy thông tin hiện tại của người dùng
      const currentResponse = await api.get(`/User/${userID}`);
      if (!currentResponse.data.success) {
        message.error("Không thể lấy thông tin người dùng hiện tại.");
        setLoading(false);
        return;
      }
  
      // Giữ lại các trường không thay đổi
      const currentUserData = currentResponse.data.data;
      const updatedData = {
        ...currentUserData, // Lấy toàn bộ thông tin hiện tại
        ...values,          // Ghi đè thông tin được cập nhật (email, name, phoneNumber)
      };
  
      // Gửi yêu cầu cập nhật
      const response = await api.put(`/User/${userID}`, updatedData);
      if (response.data.success) {
        message.success("Cập nhật thông tin thành công!");
        setUser({ ...user, ...updatedData }); // Cập nhật thông tin trong state
        setIsModalVisible(false);
      } else {
        message.error("Cập nhật thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  };
  
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
          <div className="my-4">
            <Button type="primary" onClick={showModal}>
              Edit Info
            </Button>
          </div>

          {/* Modal for Editing Profile */}
          <Modal
            title="Edit Profile"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Please enter your email" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[{ required: true, message: "Please enter your phone number" }]}
              >
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update
              </Button>
            </Form>
          </Modal>
          <div className="my-6">
            <Title level={4}>Transaction History</Title>
            <Table columns={transactionColumns} dataSource={transactions} rowKey="id" />
          </div>
          <div className="my-6">
            <Title level={4}>Orders</Title>
            <Table columns={orderColumns} dataSource={orders} rowKey="id" />
          </div>
          <div>
            <Button type="primary" onClick={showModalDeposit}>
              Deposit Funds
            </Button>
            <Modal
              title="Deposit Funds"
              visible={isModalDepositVisible}
              onCancel={handleCancelDeposit}
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
