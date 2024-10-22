import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './Dashboard.css';

const CustomerDash = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', location: '', phoneNumber: '', gender: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // New state for modal visibility

  useEffect(() => {
    setLoading(true);
    fetch('https://merent.uydev.id.vn/api/User/accounts')
      .then(response => response.json())
      .then(data => {
        setCustomers(data.data || []); // Assuming the response structure is { data: [...] }
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleShowModal = () => {
    setIsModalVisible(true);
    setIsEditing(false); // Resetting editing state for adding a new customer
    setNewCustomer({ name: '', email: '', location: '', phoneNumber: '', gender: '' }); // Resetting newCustomer
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      message.error("Name and Email are required!");
      return;
    }
    setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);
    setIsModalVisible(false); // Close modal after adding
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleEditCustomer = (customer) => {
    setNewCustomer(customer);
    setEditCustomerId(customer.id);
    setIsEditing(true);
    setIsModalVisible(true); // Open modal for editing
  };

  const handleSaveEdit = () => {
    setCustomers(customers.map((customer) => (customer.id === editCustomerId ? newCustomer : customer)));
    setIsModalVisible(false); // Close modal after saving
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button style={{color:'white'}} icon={<EditOutlined />} onClick={() => handleEditCustomer(record)}>Edit</Button>
          <Popconfirm style={{width:'20px'}} title="Are you sure to delete this customer?" onConfirm={() => handleDeleteCustomer(record.id)}>
            <Button style={{color:'white'}} icon={<DeleteOutlined />} type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="customers-container">
      <h2 style={{color:'#111827'}}>Customers</h2>
      
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search customer"
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleShowModal}>
          Add
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal for Adding/Editing Customer */}
      <Modal
        title={isEditing ? 'Edit Customer' : 'Add New Customer'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Input
          name="name"
          placeholder="Name"
          value={newCustomer.name}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          name="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          name="location"
          placeholder="Location"
          value={newCustomer.location}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          name="phoneNumber"
          placeholder="Phone Number"
          value={newCustomer.phoneNumber}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          name="gender"
          placeholder="Gender"
          value={newCustomer.gender}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" onClick={isEditing ? handleSaveEdit : handleAddCustomer}>
          {isEditing ? 'Save' : 'Add'}
        </Button>
      </Modal>
    </div>
  );
};

export default CustomerDash;
