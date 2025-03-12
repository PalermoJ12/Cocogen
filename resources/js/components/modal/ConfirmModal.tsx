import React, { useEffect, useRef } from "react";

const ConfirmModal = ({ Title, body, isOpen, onCancel, onConfirm }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    return (
        <dialog ref={modalRef} id="my_modal_4" className="modal">
            <div className="modal-box w-11/12 max-w-1xl">
                <h3 className="font-bold text-lg">{Title}</h3>
                <p className="py-4">{body}</p>
                <div className="modal-action">
                    <button className="btn" onClick={onCancel}>Close</button>
                    {onConfirm && (
                        <button className="btn btn-primary" onClick={onConfirm}>
                            Confirm
                        </button>
                    )}
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmModal;
