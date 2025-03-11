import { React, useState, useEffect } from "react";
import CardLogin from "../card/CardLogin";
import axios from "axios";
import apiService from "../services/ApiService";
import Toast from "../toast/toast";
const Login = () => {
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [showToast, setShowToast] = useState({
        isShow: false,
        Message: "",
    });
    const onClick = () => {
        apiService
            .post("/login", {
                email: input1,
                password: input2,
            })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", res.data.user.id);
                setShowToast({
                    isShow: true,
                    Message: "Successfully login.",
                    type: "success",
                });
                window.location.replace("/quotation");
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 401) {
                    setShowToast({
                        isShow: true,
                        Message: err.response.statusText,
                        type: "error",
                    });

                    setTimeout(() => {
                        setShowToast({
                            isShow: false,
                            Message: "",
                            type: "error",
                        });
                    }, 3000);
                } else {
                    setShowToast({
                        isShow: true,
                        Message: err.response.statusText,
                        type: "error",
                    });

                    setTimeout(() => {
                        setShowToast({
                            isShow: false,
                            Message: "",
                            type: "error",
                        });
                    }, 3000);
                }
            });
    };

    return (
        <div className="w-full h-screen flex justify-center items-center">
            {showToast.isShow && (
                <Toast message={showToast.Message} type={showToast.type} />
            )}
            <CardLogin
                title="Login"
                input1={(e) => setInput1(e.target.value)}
                input2={(e) => setInput2(e.target.value)}
                onClick={onClick}
            />
        </div>
    );
};

export default Login;
