import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import HomePage from "./components/HomePage/HomePage";
import HeaderPage from "./components/FixedPageComp/HeaderPage";
import FooterPage from "./components/FixedPageComp/FooterPage";
import MainPage from "./components/MainPage/MainPage";
import About from "./components/AboutPage/About";
import Rent from "./components/RentPage/Rent";
import PhotoServices from "./components/RentPage/PhotoServices";
import Cart from "./components/CartPage/Cart"; // Import Cart component
import { useState,useEffect } from "react";

function App() {
  const user = localStorage.getItem('name');
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<MainPage />}>
          <Route index element={<HomePage />} />
          <Route path="/About" element={<About />} />
          <Route path="/Rent/Cameras" element={<Rent cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/Services/Studio" element={<PhotoServices />} />
          <Route path="/Cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
