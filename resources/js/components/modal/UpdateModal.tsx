import React, { useEffect, useRef, useState } from "react";

const ITEMS_PER_PAGE = 5;

const UpdateModal = ({ Title, isOpen, onCancel, onConfirm, data }) => {
  const modalRef = useRef(null);
  const [items, setItems] = useState([]);
  const [quotationStatus, setQuotationStatus] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
      setItems(data.items || []);
      setQuotationStatus(data.status || 0);
      setCurrentPage(1);
    } else {
      modalRef.current?.close();
    }
  }, [isOpen, data]);


  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const currentItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  const handleQuantityChange = (index, newQuantity) => {
    const updatedItems = [...items];
    updatedItems[index].item_quantity = parseInt(newQuantity) || 0;
    setItems(updatedItems);
  };


  const handleDeleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };


  const calculateTotal = () => {
    return items.reduce((sum, itemdata) => {
      return (
        sum + parseFloat(itemdata.item.price || "0") * itemdata.item_quantity
      );
    }, 0);
  };

  const handleConfirm = () => {
    const updatedData = {
      ...data,
      items,
      total_amount: calculateTotal(),
      status: quotationStatus,
    };
    onConfirm(updatedData);
  };


  const statusOptions = [
    { value: 0, label: "Draft" },
    { value: 1, label: "Sent" },
    { value: 2, label: "Approved" },
    { value: 3, label: "Declined" },
  ];

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex flex-row justify-between">
          <h3 className="font-bold text-lg">{Title}</h3>
          <h3 className="font-bold text-lg">{data.quotation_number}</h3>
        </div>

        <h3 className="font-bold text-md">
          Customer: {data.customer_name}
        </h3>


        <div className="my-4">
          <label className="mr-2 font-bold">Status:</label>
          <select
            className="select select-bordered"
            value={quotationStatus}
            onChange={(e) => setQuotationStatus(Number(e.target.value))}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table w-full">
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((itemdata, index) => (
                <tr key={index} className="text-center">
                  <th>
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </th>
                  <td>{itemdata.item.item_name}</td>
                  <td>
                    <input
                      type="number"
                      value={itemdata.item_quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          (currentPage - 1) * ITEMS_PER_PAGE + index,
                          e.target.value
                        )
                      }
                      className="input input-bordered w-16 mx-auto"
                    />
                  </td>
                  <td>
                    ₱{parseFloat(itemdata.item.price || "0").toFixed(2)}
                  </td>
                  <td>
                    ₱
                    {(
                      parseFloat(itemdata.item.price || "0") *
                      itemdata.item_quantity
                    ).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn btn-error btn-xs mr-1"
                      onClick={() =>
                        handleDeleteItem(
                          (currentPage - 1) * ITEMS_PER_PAGE + index
                        )
                      }
                    >
                      Delete
                    </button>
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
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
            >
              « Prev
            </button>
            <span className="font-bold text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm ml-2"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next »
            </button>
          </div>
        )}

      
        <div className="flex flex-row justify-between mt-2">
          <h3 className="font-bold text-sm">
            Date: {data.quote_date}
          </h3>
          <h3 className="font-bold text-sm">
            Total: ₱{calculateTotal().toFixed(2)}
          </h3>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onCancel}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default UpdateModal;
