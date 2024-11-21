import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { storage } from '../../services/firebaseConfig'; // Nhập cấu hình Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Dashboard.css'; // Sử dụng CSS chung

const ComboDash = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    urlImg: '',
  });
  const [newProductCombo, setNewProductCombo] = useState({
    productID: '',
    comboID: '',
    description: '',
    quantity: '',
  })
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalComboVisible, setIsModalComboVisible] = useState(false);
  const [imageFiles, setImageFiles] = useState({}); // State để lưu trữ hình ảnh
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://merent.uydev.id.vn/api/Combo');
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      message.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImageFiles({ ...imageFiles, [name]: files[0] });
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `products/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleShowModal = () => {
    setIsModalVisible(true);
    setIsEditing(false);
    setNewProduct({
      name: '',
      description: '',
      urlImg:'',
    });
    setImageFiles({}); // Reset state hình ảnh
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.description) {
      message.error("Name and description is required!");
      return;
    }
  
    try {
      // Upload hình ảnh và nhận các URL
      const urls = await Promise.all(
        Object.keys(imageFiles).map(name => uploadImage(imageFiles[name]))
      );
  
      // Cập nhật URL vào sản phẩm
      const updatedProduct = {
        ...newProduct,
        urlImg: urls[0] || '',
       
      };
  
      // Gửi yêu cầu tạo sản phẩm mới với các URL đã cập nhật
      const response = await fetch('https://merent.uydev.id.vn/api/Combo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct), // Sử dụng updatedProduct
      });
      const result = await response.json();
      setProducts([...products, { ...updatedProduct, id: result.id }]); // Cập nhật danh sách sản phẩm
      setIsModalVisible(false);
      message.success('Combo added successfully');
    } catch (error) {
      message.error('Error adding combo');
    }
  };
  

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`https://merent.uydev.id.vn/api/Combo/${id}`, {
        method: 'DELETE',
      });
      setProducts(products.filter((product) => product.id !== id));
      message.success('Combo deleted successfully');
    } catch (error) {
      message.error('Error deleting combo');
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct(product);
    setEditProductId(product.id);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await fetch(`https://merent.uydev.id.vn/api/Combo/${editProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      setProducts(products.map((product) => (product.id === editProductId ? newProduct : product)));
      setIsModalVisible(false);
      message.success('Product updated successfully');
    } catch (error) {
      message.error('Error updating product');
    }
  };
  const handleEditProductCombo = (combo) => {
    setNewProductCombo({
      ...newProductCombo,
      comboID: combo.id, // Lấy ID của combo hiện tại
    });
    setIsModalComboVisible(true);
  };
  
  const handleProductNameChange = async (e) => {
    const productName = e.target.value;
    setNewProductCombo({ ...newProductCombo, description: productName });
  
    // Gọi API để lấy productID dựa trên tên
    try {
      const response = await fetch(`https://merent.uydev.id.vn/api/Product/${productName}`);
      const result = await response.json();
      if (result && result.id) {
        setNewProductCombo((prev) => ({ ...prev, productID: result.id }));
      } else {
        
      }
    } catch (error) {
     
    }
  };
  
  const handleAddProductToCombo = async () => {
    const { comboID, productID, description, quantity } = newProductCombo;
  
    if ( !comboID || !description || !quantity) {
      message.error("All fields are required!");
      return;
    }else if(!productID){
      message.error("Product is missing or can not be found!");
      return;
    }
  
    try {
      const response = await fetch('https://merent.uydev.id.vn/api/ComboOfProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comboID, productID, description, quantity }),
      });
  
      if (response.ok) {
        message.success('Product added to combo successfully!');
        setIsModalVisible(false);
      } else {
        message.error('Failed to add product to combo');
      }
    } catch (error) {
      message.error('Error adding product to combo');
    }
  };
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
   
    {
      title: 'Image',
      dataIndex: 'urlImg',
      key: 'urlImg',
      render: (url) => (
        <div className="image-container">
          <img src={url} alt="Combo"  />
        </div>
      ),
    },
  
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button style={{color:'white'}} icon={<EditOutlined />} onClick={() => handleEditProduct(record)}>Edit</Button>
          <Button style={{color:'white'}} icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(record.id)} type="danger">Delete</Button>
          <Button
              style={{ color: 'white' }}
              icon={<PlusOutlined />}
              onClick={() => handleEditProductCombo(record)}
          >
            Add more product to combo
          </Button>
        
        </Space>
      ),
    },
  ];

  return (
    <div className="customers-container">
      <h2 style={{color:'#111827'}}>Combos</h2>
      
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search combo"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleShowModal}>
          Add
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredProducts} // Sử dụng danh sách sản phẩm đã lọc
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 3 }}
        rowClassName="custom-row"
      />

      {/* Modal for Adding/Editing Product */}
      <Modal
        title={isEditing ? 'Edit Combo' : 'Add New Combo'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Input
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
      
        <Input
          type="file"
          name="urlImg"
          onChange={handleImageChange}
          style={{ marginBottom: 8 }}
        />
       
        <Button type="primary" onClick={isEditing ? handleSaveEdit : handleAddProduct}>
          {isEditing ? 'Save' : 'Add'}
        </Button>
      </Modal>
      
      <Modal
  title="Add Product to Combo"
  open={isModalComboVisible}
  onCancel={() => setIsModalComboVisible(false)}
  footer={null}
>
  <Input
    placeholder="Enter product name"
    onChange={handleProductNameChange}
    style={{ marginBottom: 8 }}
  />
  <Input
    placeholder="Description"
    value={newProductCombo.description}
    onChange={(e) =>
      setNewProductCombo({ ...newProductCombo, description: e.target.value })
    }
    style={{ marginBottom: 8 }}
  />
  <Input
    placeholder="Quantity"
    type="number"
    value={newProductCombo.quantity}
    onChange={(e) =>
      setNewProductCombo({ ...newProductCombo, quantity: e.target.value })
    }
    style={{ marginBottom: 8 }}
  />
  <Button type="primary" onClick={handleAddProductToCombo}>
    Add
  </Button>
</Modal>

    </div>
  );
};

export default ComboDash;
