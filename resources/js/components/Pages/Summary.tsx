import { React, useEffect, useState, useCallback } from "react";
import apiService from "../services/ApiService";
import ViewModal from "../modal/ViewModal";
import ConfirmModal from "../modal/ConfirmModal";
import UpdateModal from "../modal/UpdateModal";
const Summary = () => {
    const ITEMS_PER_PAGE = 5;
    const [summary, setSummary] = useState([]);

    const [filteredSummary, setFilteredSummary] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewModal, setViewModal] = useState({
        Title: "",
        body: "",
        isOpen: false,
        onCancel: () => {},
        onConfirm: () => {},
        data: [],
    });
    const [updateModal, setUpdateModal] = useState({
        Title: "",
        body: "",
        isOpen: false,
        onCancel: () => {},
        onConfirm: () => {},
        data: [],
    });
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

    const getSummary = useCallback(async () => {
        await apiService
            .get("/summary")
            .then((res) => {
                console.log(res);
                setSummary(res.data.quotation);
                setFilteredSummary(res.data.quotation);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const updateSummary = async (data) => {
        console.log(data);
        await apiService
            .put(`/update-quotation/${data.id}`, { data })
            .then((res) => {
                setUpdateModal((prev) => ({
                    ...prev,
                    
                    isOpen: false,
                 
                }));
                setShowToast({
                    isShow: true,
                    Message: "Successfully edited a summary.",
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
                    Message: "There is an error in updating the summary.",
                    type: "error",
                });

               
            });
    };

    const deleteSummary = async (id) => {
        await apiService
            .delete(`/summary/${id}/delete`)
            .then((res) => {
                setShowToast({
                    isShow: true,
                    Message: "Successfully deleted a summary.",
                    type: "success",
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch((err) => {
                setShowToast({
                    isShow: true,
                    Message: "There is an error in delete the summary.",
                    type: "error",
                });

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            });
    };

    const downloadPDF = async (id) => {
        try {
            const response = await apiService.get(
                `/quotation/${id}/download-pdf`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Quotation_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("Error downloading PDF", err);
        }
    };

    const totalPages = Math.ceil(filteredSummary.length / ITEMS_PER_PAGE);

    const currentItems = filteredSummary.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleStatus = (status: number) => {
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

    useEffect(() => {
        let filteredData = summary;

        if (statusFilter !== "") {
            filteredData = filteredData.filter(
                (item) => item.status.toString() === statusFilter
            );
        }

        if (searchQuery.trim() !== "") {
            filteredData = filteredData.filter(
                (item) =>
                    item.customer_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    item.quotation_number
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        setFilteredSummary(filteredData);
    }, [statusFilter, searchQuery, summary]);
    useEffect(() => {
        getSummary();
    }, [getSummary]);
    return (
        <>
            {viewModal.isOpen && (
                <ViewModal
                    Title={viewModal.Title}
                    body={viewModal.body}
                    isOpen={viewModal.isOpen}
                    data={viewModal.data}
                    onCancel={() => {
                        setViewModal((prev) => ({
                            ...prev,
                            isOpen: false,
                        }));
                    }}
                    onConfirm={() => {
                        setViewModal((prev) => ({
                            ...prev,
                            isOpen: false,
                        }));
                    }}
                />
            )}

            {updateModal.isOpen && (
                <UpdateModal
                    Title={updateModal.Title}
                    isOpen={updateModal.isOpen}
                    data={updateModal.data}
                    onCancel={() => {
                        setUpdateModal((prev) => ({
                            ...prev,
                            isOpen: false,
                        }));
                    }}
                    onConfirm={(updatedData) => {
                        updateSummary(updatedData);
                    }}
                />
            )}

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

            <ConfirmModal
                Title={showConfirmModal.Title}
                body={showConfirmModal.body}
                isOpen={showConfirmModal.isShow}
                onCancel={showConfirmModal.onCancel}
                onConfirm={showConfirmModal.onConfirm}
            />

            <div className="mt-4 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold">Summary</h1>

                <div className="flex gap-4 mt-4">
                    <input
                        type="text"
                        placeholder="Search by Customer or Quotation No."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="select select-bordered"
                    >
                        <option value="">All Status</option>
                        <option value="0">Draft</option>
                        <option value="1">Sent</option>
                        <option value="2">Approved</option>
                        <option value="3">Declined</option>
                    </select>
                </div>

                <div className="mt-4 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Quotation No.</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index}>
                                    <th>{item.id}</th>
                                    <td>{item.customer_name}</td>
                                    <td>{item.quotation_number}</td>
                                    <td>₱{item.total_amount}</td>
                                    <td>
                                        <div
                                            className={
                                                handleStatus(item.status)?.badge
                                            }
                                        >
                                            {
                                                handleStatus(item.status)
                                                    ?.status_name
                                            }
                                        </div>
                                    </td>
                                    <td>{item.quote_date}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-xs mr-1"
                                            onClick={() => {
                                                console.log(item);
                                                setViewModal((prev) => ({
                                                    ...prev,
                                                    Title: "View summary",
                                                    isOpen: true,
                                                    data: item,
                                                }));
                                            }}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="btn btn-info btn-xs mr-1"
                                            onClick={() => {
                                                setUpdateModal((prev) => ({
                                                    ...prev,
                                                    Title: "Update summary",
                                                    isOpen: true,
                                                    data: item,
                                                }));
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => downloadPDF(item.id)}
                                            className="btn btn-success btn-xs mr-1"
                                        >
                                            Download
                                        </button>
                                        <button
                                            className="btn btn-error btn-xs mr-1"
                                            onClick={() => {
                                                setShowConfirmModal((prev) => ({
                                                    ...prev,
                                                    Title: "Delete this?",
                                                    body: "Are you sure you want to delete this summary? This action cannot be undone.",
                                                    isShow: true,
                                                    onCancel: () =>
                                                        setShowConfirmModal(
                                                            (prev) => ({
                                                                ...prev,
                                                                isShow: false,
                                                            })
                                                        ),

                                                    onConfirm: () => {
                                                        deleteSummary(item.id);
                                                        setShowConfirmModal(
                                                            (prev) => ({
                                                                ...prev,
                                                                isShow: false,
                                                            })
                                                        );
                                                    },
                                                }));
                                            }}
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
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next »
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Summary;
