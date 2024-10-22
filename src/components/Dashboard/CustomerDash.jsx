import React, { useState } from 'react';
import './Dashboard.css';

const CustomerDash = () => {
  const initialCustomers = [
    { id: 1, name: 'Alcides Antonio', email: 'alcides.antonio@devias.io', location: 'Madrid, Spain', phone: '908-691-3242' },
    { id: 2, name: 'Marcus Finn', email: 'marcus.finn@devias.io', location: 'Carson City, Nevada, USA', phone: '415-907-2647' },
    { id: 3, name: 'Jie Yan', email: 'jie.yan.song@devias.io', location: 'North Canton, Ohio, USA', phone: '770-635-2682' },
    { id: 4, name: 'Nasimyu Danai', email: 'nasimyu.danai@devias.io', location: 'Salt Lake City, Utah, USA', phone: '801-301-7894' },
    { id: 5, name: 'Iulia Albu', email: 'iulia.albu@devias.io', location: 'Murray, Utah, USA', phone: '313-812-8947' },
  ];

  const [customers, setCustomers] = useState(initialCustomers);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', location: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) return;

    setCustomers([...customers, { ...newCustomer, id: customers.length + 1 }]);
    setNewCustomer({ name: '', email: '', location: '', phone: '' });
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter((customer) => customer.id !== id));
  };

  const handleEditCustomer = (customer) => {
    setNewCustomer(customer);
    setEditCustomerId(customer.id);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setCustomers(customers.map((customer) => (customer.id === editCustomerId ? newCustomer : customer)));
    setNewCustomer({ name: '', email: '', location: '', phone: '' });
    setIsEditing(false);
  };

  return (
    <div className="customers-container">
      <h2>Customers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.location}</td>
              <td>{customer.phone}</td>
              <td>
                <button onClick={() => handleEditCustomer(customer)}>Edit</button>
                <button onClick={() => handleDeleteCustomer(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-customer-form">
        <h3>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newCustomer.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newCustomer.location}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={newCustomer.phone}
          onChange={handleInputChange}
        />
        {isEditing ? (
          <button onClick={handleSaveEdit}>Save</button>
        ) : (
          <button onClick={handleAddCustomer}>Add</button>
        )}
      </div>
    </div>
  );
};

export default CustomerDash;
