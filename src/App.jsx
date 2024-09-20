import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login"
import SignUp from "./components/SignUp/SignUp";
import HomePage from "./components/HomePage/HomePage";
import HeaderPage from "./components/FixedPageComp/HeaderPage";
import FooterPage from "./components/FixedPageComp/FooterPage";
import MainPage from "./components/MainPage/MainPage";
import About from "./components/AboutPage/About";
import Rent from "./components/RentPage/Rent";
import PhotoServices from "./components/RentPage/PhotoServices";
function App(){
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<SignUp/>}></Route>
        <Route path="/" element={<MainPage />}>
          <Route index element={<HomePage />} />
          <Route path="/About" element={<About />} />
          <Route path="/Rent" element={<Rent/>}/>
          <Route path="/Services" element={<PhotoServices/>}/>
        </Route>
        
      </Routes>
      
    </BrowserRouter>
  );
};
export default App;