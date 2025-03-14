import React from "react";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet /> 
            </main>
        </div>
    );
};

export default Layout;
