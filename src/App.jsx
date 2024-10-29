import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import About from "./components/AboutPage/About";
import Cart from "./components/CartPage/Cart"; // Import Cart component
import Checkout from "./components/CartPage/Checkout";
import Combo from "./components/Combo/Combo";
import AdminLayout from "./components/Dashboard/AdminLayout";
import CustomerDash from "./components/Dashboard/CustomerDash";
import Dashboard from "./components/Dashboard/Dashboard";
import ProductDash from "./components/Dashboard/ProductDash";
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";
import MainPage from "./components/MainPage/MainPage";
import PaymentPage from "./components/Payment/PaymentPage";
import ProfilePage from "./components/Profile/ProfilePage";
import LensRent from "./components/RentPage/Lens/LensRen";
import LightingRent from "./components/RentPage/Lighting/LightingRent";
import PhotoServices from "./components/RentPage/PhotoServices";
import Rent from "./components/RentPage/Rent";
import RentDetail from "./components/RentPage/RentDetail";
import SignUp from "./components/SignUp/SignUp";
import Terms from "./components/TermsPage/Terms";
import Workshop from "./components/Workshop/Workshop";

function App() {
  const user = localStorage.getItem('name');
 // Initialize cartItems with localStorage data or an empty array
 const [cartItems, setCartItems] = useState(() => {
  const savedCartItems = localStorage.getItem('cartItems');
  return savedCartItems ? JSON.parse(savedCartItems) : [];
});

// Whenever cartItems changes, update localStorage
useEffect(() => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}, [cartItems]);
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<SignUp />} />
        <Route path="/Admin" element={<AdminLayout />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Dashboard/Customers" element={<CustomerDash />} />
          <Route path="Dashboard/Products" element={<ProductDash />} />
        </Route>
        <Route path="/" element={<MainPage />}>
          <Route index element={<HomePage />} />
          <Route path="/About" element={<About />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/Rent/Cameras" element={<Rent />} />
          <Route path="/Rent/Items/:name" element={<RentDetail cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/Rent/Lighting" element={< LightingRent/>} />
          <Route path="/Rent/Lens" element={< LensRent/>} />
          <Route path="/Services/Studio" element={<PhotoServices />} />
          <Route path="/TermsOfUse" element={< Terms/>} />
          <Route path="/Workshop" element={<Workshop/>}/>
          <Route path="/Combo" element={<Combo/>}/>
          <Route path="/Profile" element={<ProfilePage/>}/>
          <Route path="/Cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/Cart/Checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems}/>} />
          
        </Route>
      </Routes>
      
    </HashRouter>
  );
}

export default App;
