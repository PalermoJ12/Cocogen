import React from "react";

const CardLogin = ({ title, input1, input2, onClick }) => {
    return (
        <div>
            <div className="card w-96 bg-base-100 border border-base-content card-xl shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">{title}</h2>
                    <div>
                      
                        <input
                            type="text"
                            placeholder="Username"
                            onChange={input1}
                            className="input mb-4"
                        />
                   
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={input2}
                            className="input"
                        />
                    </div>
                    <div className="justify-end card-actions">
                        <button className="btn btn-primary" onClick={onClick}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardLogin;
