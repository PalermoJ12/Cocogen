import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Layout from "../Layout/layout";
import Quotation from "../Pages/Quotation";
import Summary from "../Pages/Summary";

const RoutesComponent = () => {
    const token = localStorage.getItem("token");
    return (
        <Routes>
            <Route
                path="/"
                element={token ? <Navigate to="/quotation" /> : <Login />}
            />

            {token ? (
                <Route element={<Layout />}>
                    <Route path="/quotation" element={<Quotation />} />
                    <Route path="/summary" element={<Summary />} />
                </Route>
            ) : (
                <Route path="*" element={<Navigate to="/" />} />
            )}
        </Routes>
    );
};

export default RoutesComponent;
