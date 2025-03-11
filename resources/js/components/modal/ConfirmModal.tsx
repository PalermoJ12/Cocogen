import React from "react";

const ConfirmModal = ({ Title, body, onCancel, onConfirm }) => {
    return (
       
            <div className=" bg-gray-600 p-6 rounded-lg shadow-lg w-96">
                <h3 className="font-bold text-lg">{Title}</h3>
                <p className="py-4">{body}</p>
                <div className="flex justify-end gap-2">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
       
    );
};

export default ConfirmModal;
