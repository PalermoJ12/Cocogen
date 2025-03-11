import { React, useEffect, useState, useCallback } from "react";
import apiService from "../services/ApiService";

const Summary = () => {
    const [summary, setSummary] = useState([]);
    const [filteredSummary, setFilteredSummary] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const getSummary = useCallback(async () => {
        try {
            const res = await apiService.get("/summary");
            setSummary(res.data);
            setFilteredSummary(res.data);
        } catch (err) {
            console.log(err);
        }
    }, []);

    const downloadPDF = async (id) => {
        try {
            const response = await apiService.get(`/quotation/${id}/download-pdf`, {
                responseType: "blob",
            });

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

    useEffect(() => {
        getSummary();
    }, [getSummary]);

    // Handle status badge assignment
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

    return (
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
                        {filteredSummary.map((item, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{item.customer_name}</td>
                                <td>{item.quotation_number}</td>
                                <td>{item.total_amount}</td>
                                <td>
                                    <div
                                        className={
                                            handleStatus(item.status)?.badge
                                        }
                                    >
                                        {handleStatus(item.status)?.status_name}
                                    </div>
                                </td>
                                <td>{item.quote_date}</td>
                                <td>
                                    <button className="btn btn-primary btn-xs mr-1">
                                        View
                                    </button>
                                    <button className="btn btn-info btn-xs mr-1">
                                        Update
                                    </button>
                                    <button
                                        onClick={() => downloadPDF(item.id)}
                                        className="btn btn-success btn-xs mr-1"
                                    >
                                        Download
                                    </button>
                                    <button className="btn btn-error btn-xs mr-1">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Summary;
