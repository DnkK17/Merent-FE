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

  const location = useLocation();
  const navigate = useNavigate();

  const formatPriceVND = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setUserID(userData.id);
    }
  }, []);

  useEffect(() => {
    if (userID) {
      fetchWalletInfo();
      fetchTransactions();
      fetchOrders(userID);
    }
  }, [userID]);

  useEffect(() => {
    handlePaymentReturn();
  }, [location]);

  const fetchWalletInfo = async () => {
    try {
      const { data } = await api.get("/Wallet/user-wallet");
      if (data.success && data.data.length > 0) {
        setWallet(data.data[0]);
      } else {
        message.error(data.message || "Failed to fetch wallet information");
      }
    } catch (error) {
      message.info("Please log in to access wallet information.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get("/Transaction/transactions-user?walletTypeEnums=0");
      if (data.success && data.data) {
        setTransactions(data.data);
      } else {
        message.error(data.message || "Failed to fetch transaction history");
      }
    } catch (error) {
      message.info("Please log in to access transactions.");
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

  const handlePaymentReturn = () => {
    const searchParams = new URLSearchParams(location.search);
    const transactionId = searchParams.get("id");
    const status = searchParams.get("status");
    const isCancelled = searchParams.get("success");
    const amount = parseFloat(searchParams.get("amount"));

    if (!isCancelled && amount) {
      processReturnTransaction(amount);
    }
  };

  const processReturnTransaction = async (amount) => {
    try {
      if (!wallet) {
        message.error("Cannot determine wallet information.");
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        message.error("Invalid deposit amount.");
        return;
      }

      const updatedCash = wallet.cash - amount;
      if (updatedCash < 0) {
        message.error("Insufficient balance.");
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
        message.info("Amount deducted from wallet due to incomplete transaction.");
      } else {
        throw new Error(response.data.message || "Error updating wallet.");
      }
    } catch (error) {
      console.error("Error processing return transaction:", error);
      message.error("Error handling transaction.");
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      message.error("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/Wallet/create-payment-link-payos", { amount });
      if (data.success) {
        message.success("Deposit link created successfully.");
        window.location.href = data.data;
      } else {
        message.error(data.message || "Failed to create deposit link.");
      }
    } catch (error) {
      console.error("Error during deposit:", error);
      message.error("Error connecting to the server.");
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
            <Descriptions title="User Info" bordered column={1}>
              <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Phone Number">{user.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge status="processing" text="Active" />
              </Descriptions.Item>
            </Descriptions>
            <Descriptions title="Wallet Info" bordered column={1}>
              <Descriptions.Item label="Wallet ID">{wallet.id}</Descriptions.Item>
              <Descriptions.Item label="Cash">{formatPriceVND(wallet.cash)}</Descriptions.Item>
            </Descriptions>
            <Input
              type="number"
              placeholder="Enter deposit amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <Button type="primary" onClick={handleDeposit} loading={loading}>
              Deposit
            </Button>
          </div>
        </>
      )}

      <Title level={3}>Transaction History</Title>
      <Table
        columns={transactionColumns}
        dataSource={transactions}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Title level={3}>My Orders</Title>
      <Table
        columns={orderColumns}
        dataSource={orders}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
