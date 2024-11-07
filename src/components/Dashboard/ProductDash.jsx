import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, message, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { storage } from '../../services/firebaseConfig'; // Nhập cấu hình Firebase
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Dashboard.css'; // Sử dụng CSS chung

const ProductDash = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    productType: '',
    urlCenter: '',
    urlLeft: '',
    urlRight: '',
    urlSide: '',
    price: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      const response = await fetch('https://merent.uydev.id.vn/api/Product');
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
      productType: '',
      urlCenter: '',
      urlLeft: '',
      urlRight: '',
      urlSide: '',
      price: 0,
    });
    setImageFiles({}); // Reset state hình ảnh
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      message.error("Name and Price are required!");
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
        urlCenter: urls[0] || '',
        urlLeft: urls[1] || '',
        urlRight: urls[2] || '',
        urlSide: urls[3] || '',
      };
  
      // Gửi yêu cầu tạo sản phẩm mới với các URL đã cập nhật
      const response = await fetch('https://merent.uydev.id.vn/api/Product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct), // Sử dụng updatedProduct
      });
      const result = await response.json();
      setProducts([...products, { ...updatedProduct, id: result.id }]); // Cập nhật danh sách sản phẩm
      setIsModalVisible(false);
      message.success('Product added successfully');
    } catch (error) {
      message.error('Error adding product');
    }
  };
  

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`https://merent.uydev.id.vn/api/Product/${id}`, {
        method: 'DELETE',
      });
      setProducts(products.filter((product) => product.id !== id));
      message.success('Product deleted successfully');
    } catch (error) {
      message.error('Error deleting product');
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
      await fetch(`https://merent.uydev.id.vn/api/Product/${editProductId}`, {
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
      title: 'Product Type',
      dataIndex: 'productType',
      key: 'productType',
    },
    {
      title: 'Image',
      dataIndex: 'urlCenter',
      key: 'urlCenter',
      render: (url) => (
        <div className="image-container">
          <img src={url} alt="Product" className="zoomable-image" />
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button style={{color:'white'}} icon={<EditOutlined />} onClick={() => handleEditProduct(record)}>Edit</Button>
          <Popconfirm title="Are you sure to delete this product?" onConfirm={() => handleDeleteProduct(record.id)}>
            <Button style={{color:'white'}} icon={<DeleteOutlined />} type="danger">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="customers-container">
      <h2 style={{color:'#111827'}}>Products</h2>
      
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search product"
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
        title={isEditing ? 'Edit Product' : 'Add New Product'}
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
          name="productType"
          placeholder="Product Type"
          value={newProduct.productType}
          onChange={handleInputChange}
          style={{ marginBottom: 8}}
          
        />
        <Input
          type="file"
          name="urlCenter"
          onChange={handleImageChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          type="file"
          name="urlLeft"
          onChange={handleImageChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          type="file"
          name="urlRight"
          onChange={handleImageChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          type="file"
          name="urlSide"
          onChange={handleImageChange}
          style={{ marginBottom: 8 }}
        />
        <Input
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" onClick={isEditing ? handleSaveEdit : handleAddProduct}>
          {isEditing ? 'Save' : 'Add'}
        </Button>
      </Modal>
    </div>
  );
};

export default ProductDash;
