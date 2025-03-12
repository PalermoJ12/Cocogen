import React, { useEffect, useRef, useState } from "react";

const ITEMS_PER_PAGE = 5; 

const ViewModal = ({ Title, body, isOpen, onCancel, onConfirm, data }) => {
    const modalRef = useRef(null);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
            setItems(data.items || []);
            setCurrentPage(1); 
        } else {
            modalRef.current?.close();
        }
    }, [isOpen, data.items]);


    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const currentItems = items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleStatus = (status) => {
        let returnData = {
            status_name: "",
            badge: "",
        };

        if (status === 0) {
            returnData.status_name = "Draft";
            returnData.badge = "badge badge-warning";
        } else if (status === 1) {
            returnData.status_name = "Sent";
            returnData.badge = "badge badge-info";
        } else if (status === 2) {
            returnData.status_name = "Approved";
            returnData.badge = "badge badge-success";
        } else if (status === 3) {
            returnData.status_name = "Declined";
            returnData.badge = "badge badge-error";
        }

        return returnData;
    };

    return (
        <dialog ref={modalRef} id="my_modal_4" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <div className="flex flex-row justify-between">
                    <h3 className="font-bold text-lg">{Title}</h3>
                    <h3 className="font-bold text-lg">{data.quotation_number}</h3>
                </div>

                    <h3 className="font-bold text-md">
                        Customer: {data.customer_name}
                    </h3>

                    <div className="mt-4 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                        <table className="table">
                            <thead>
                                <tr className="text-center">
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                 
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((itemdata, index) => (
                                    <tr key={index} className="text-center">
                                        <th>
                                            {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                        </th>
                                        <td>{itemdata.item.item_name}</td>
                                        <td>{itemdata.item_quantity}</td>
                                        <td>
                                            ₱{parseFloat(itemdata.item.price || "0").toFixed(2)}
                                        </td>
                                       
                                        <td>
                                            ₱{(parseFloat(itemdata.item.price || "0") * itemdata.item_quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                 
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <button
                                className="btn btn-sm mr-2"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                « Prev
                            </button>
                            <span className="font-bold text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                className="btn btn-sm ml-2"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next »
                            </button>
                        </div>
                    )}

                    <div className="flex flex-row justify-between mt-2">
                        <h3 className="font-bold text-sm">Date: {data.quote_date}</h3>
                        <h3 className="font-bold text-sm">Total: ₱{data.total_amount}</h3>
                    </div>
               
                <div className="modal-action">
                    <button className="btn" onClick={onCancel}>
                        Close
                    </button>
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

export default ViewModal;
