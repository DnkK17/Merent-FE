import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import HeaderPage from "../FixedPageComp/HeaderPage";
import FooterPage from "../FixedPageComp/FooterPage";
import HomePage from "../HomePage/HomePage";
import About from "../AboutPage/About";
function MainPage(){
    return(
        <div>
            <HeaderPage/>
                <Outlet/>
            <FooterPage/>
        </div>
    );
};
export default MainPage;