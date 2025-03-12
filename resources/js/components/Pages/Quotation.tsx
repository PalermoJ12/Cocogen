import React, { useState, useEffect, useCallback } from "react";
import apiService from "../services/ApiService";
import ItemCard from "../card/ItemCard";
import ConfirmModal from "../modal/ConfirmModal";
const ITEMS_PER_PAGE = 3;

const Quotation = () => {
    const [items, setItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState("");
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPage, setItemPage] = useState(1);
    const [showConfirmModal, setShowConfirmModal] = useState({
        isShow: false,
        Title: "",
        body: "",
        onCancel: () => {},
        onConfirm: () => {},
    });
    const [showToast, setShowToast] = useState({
        isShow: false,
        Message: "",
    });
    const getItems = useCallback(async () => {
        try {
            const res = await apiService.get("/items");
            setItems(res.data);
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        getItems();
    }, [getItems]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (cartItem) => cartItem.id === item.id
            );
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
        setTotal((prevTotal) => prevTotal + parseFloat(item.price));
    };

    const increaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
        const item = cart.find((item) => item.id === id);
        if (item) {
            setTotal((prevTotal) => prevTotal + parseFloat(item.price));
        }
    };

    const decreaseQuantity = (id) => {
        setCart((prevCart) => {
            const updatedCart = prevCart
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);
            return updatedCart;
        });

        const item = cart.find((item) => item.id === id);
        if (item) {
            setTotal((prevTotal) => prevTotal - parseFloat(item.price));
        }
    };

    const totalItemPages = Math.ceil(items.length / 9);
    const paginatedItems = items.slice((itemPage - 1) * 9, itemPage * 9);

    const totalPages = Math.ceil(cart.length / ITEMS_PER_PAGE);
    const paginatedCart = cart.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const showDraftConfirm = () => {
        setShowConfirmModal({
            isShow: true,
            Title: "Save to draft?",
            body: "Are you sure you want to save to draft? This action cannot be undone.",
            onCancel: () => {
                setShowConfirmModal({
                    isShow: false,
                });
            },
            onConfirm: () => {
                saveToDraft();
                setShowConfirmModal({
                    isShow: false,
                });
            },
        });
    };

    const showQuotationConfirm = () => {
        setShowConfirmModal({
            isShow: true,
            Title: "Save to draft?",
            body: "Are you sure you want to save to draft? This action cannot be undone.",
            onCancel: () => {
                setShowConfirmModal({
                    isShow: false,
                });
            },
            onConfirm: () => {
                saveQuotation();
                setShowConfirmModal({
                    isShow: false,
                });
            },
        });
    };

    const saveToDraft = async () => {
        console.log(cart);
        await apiService
            .post("/save-draft", {
                items: cart,
                total: total,
                customer: customer,
                user: localStorage.getItem("user"),
            })
            .then((res) => {
                setShowToast({
                    isShow: true,
                    Message: "Successfully saved to draft.",
                    type: "success",
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                setShowToast({
                    isShow: true,
                    Message: "Failed to save to draft.",
                    type: "error",
                });
                setTimeout(() => {
                    setShowToast({
                        isShow: false,
                        Message: "",
                        type: "",
                    });
                }, 3000);
            });
    };

    const saveQuotation = async () => {
        const request = {
            items: cart,
            total: total,
            customer: customer,
            user: localStorage.getItem("user"),
        };
        console.log(request);
        await apiService
            .post("/save-quotation", request)
            .then((res) => {
                setShowToast({
                    isShow: true,
                    Message: "Successfully saved quotation.",
                    type: "success",
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                setShowToast({
                    isShow: true,
                    Message: "Failed to save quotation.",
                    type: "error",
                });
                setTimeout(() => {
                    setShowToast({
                        isShow: false,
                        Message: "",
                        type: "",
                    });
                }, 3000);
            });
    };

    return (
        <>
            <ConfirmModal
                Title={showConfirmModal.Title}
                body={showConfirmModal.body}
                isOpen={showConfirmModal.isShow}
                onCancel={showConfirmModal.onCancel}
                onConfirm={showConfirmModal.onConfirm}
            />

            {showToast.isShow && (
                <div className="toast toast-start">
                    <div
                        className={
                            showToast?.type == "success"
                                ? `alert alert-success`
                                : `alert alert-error`
                        }
                    >
                        <span>{showToast.Message}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col flex-row p-4 md:p-6 min-h-screen ">
                <div className="flex-grow   ">
                    <div className="md:65 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {paginatedItems.map((item) => (
                            <ItemCard
                                ItemName={item.item_name}
                                ItemPrice={item.price}
                                addToCart={() => addToCart(item)}
                            />
                        ))}
                    </div>

                    {totalItemPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() =>
                                    setItemPage((prev) => Math.max(prev - 1, 1))
                                }
                                className="px-3 py-1 rounded disabled:opacity-50 hover:bg-amber-50 hover:text-black"
                                disabled={itemPage === 1}
                            >
                                ← Previous
                            </button>
                            <span>
                                Page {itemPage} of {totalItemPages}
                            </span>
                            <button
                                onClick={() =>
                                    setItemPage((prev) =>
                                        Math.min(prev + 1, totalItemPages)
                                    )
                                }
                                className="px-3 py-1 rounded disabled:opacity-50 hover:bg-amber-50 hover:text-black"
                                disabled={itemPage === totalItemPages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-75 flex flex-col gap-4">
                    <div className="w-full p-4 md:p-6 border border-green-50 rounded-lg shadow-md sticky top-6 h-fit">
                        <h2 className="text-xl md:text-2xl font-bold mb-4">
                            🛒 Cart
                        </h2>
                        <p className="text-lg">
                            Total Items:{" "}
                            {cart.reduce((sum, item) => sum + item.quantity, 0)}
                        </p>

                        <ul className="mt-4">
                            {paginatedCart.map((item) => (
                                <li
                                    key={item.id}
                                    className="border-b py-2 flex justify-between items-center"
                                >
                                    <span>
                                        {item.item_name} - ₱
                                        {parseFloat(item.price).toFixed(2)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item.id)
                                            }
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            -
                                        </button>
                                        <span className="px-3">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                increaseQuantity(item.id)
                                            }
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4 mb-2">
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(prev - 1, 1)
                                        )
                                    }
                                    className="px-3 py-1 rounded disabled:opacity-50 hover:bg-amber-50 hover:text-black"
                                    disabled={currentPage === 1}
                                >
                                    ← Previous
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    className="px-3 py-1 rounded disabled:opacity-50 hover:bg-amber-50 hover:text-black"
                                    disabled={currentPage === totalPages}
                                >
                                    Next →
                                </button>
                            </div>
                        )}

                        <p className="border-t pt-4 text-lg font-bold">
                            Total: ₱{total.toFixed(2)}
                        </p>

                        {cart.length > 0 && (
                            <>
                                <div className="border-t pt-4 text-lg font-bold mt-4">
                                    <input
                                        type="text"
                                        placeholder="Customer Name"
                                        className="input w-full"
                                        onChange={(e) =>
                                            setCustomer(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-wrap mt-4 justify-end border-t pt-4 text-lg font-bold gap-2">
                                    <button
                                        className="btn btn-secondary w-full sm:w-auto"
                                        onClick={showDraftConfirm}
                                    >
                                        Draft
                                    </button>
                                    <button
                                        className="btn btn-primary w-full sm:w-auto"
                                        onClick={showQuotationConfirm}
                                    >
                                        Save
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Quotation;
