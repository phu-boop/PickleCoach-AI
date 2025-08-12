import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import DebtDetailModal from "./DebtDetailModal.jsx";
import { getDebtByIdLearner } from "../../../../api/user/debt.js";
import "./DebtList.css";

const DebtList = () => {
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const learnerId = sessionStorage.getItem("id_user");

    useEffect(() => {
        const fetchDebts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getDebtByIdLearner(learnerId);
                setDebts(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load debt data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (learnerId) fetchDebts();
    }, [learnerId]);

    const filteredDebts = debts.filter(debt => {
        const matchesStatus = filterStatus === "ALL" || debt.status === filterStatus;
        const matchesSearch = debt.coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            debt.session.datetime.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const openDetailModal = (debt) => {
        setSelectedDebt(debt);
        setModalOpen(true);
    };

    const closeDetailModal = () => {
        setSelectedDebt(null);
        setModalOpen(false);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            PENDING: { text: "Pending", color: "bg-yellow-100 text-yellow-800" },
            PAID: { text: "Paid", color: "bg-green-100 text-green-800" },
            CANCELLED: { text: "Cancelled", color: "bg-red-100 text-red-800" }
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusMap[status]?.color || "bg-gray-100"}`}>
                {statusMap[status]?.text || status}
            </span>
        );
    };

    return (
        <div className="debt-list-container flex justify-between my-10 w-[80%] mx-auto min-h-scree">
            <Sidebar />
            <div className="debt-content">
                <h2 className="debt-title">My Training Debts</h2>

                <div className="debt-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by coach or date..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="search-icon" viewBox="0 0 20 20">
                            <path d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
                        </svg>
                    </div>

                    <div className="filter-buttons">
                        {["ALL", "PENDING", "PAID", "CANCELLED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`filter-btn ${filterStatus === status ? "active" : ""}`}
                            >
                                {status === "ALL" ? "All Debts" : status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading your debts...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <svg className="error-icon" viewBox="0 0 20 20">
                            <path d="M10,1.5c-4.651,0-8.5,3.849-8.5,8.5s3.849,8.5,8.5,8.5s8.5-3.849,8.5-8.5S14.651,1.5,10,1.5 M10,17.5c-4.146,0-7.5-3.354-7.5-7.5S5.854,2.5,10,2.5s7.5,3.354,7.5,7.5S14.146,17.5,10,17.5 M9.25,6.5h1.5v5h-1.5V6.5z M10,14c-0.552,0-1-0.448-1-1s0.448-1,1-1s1,0.448,1,1S10.552,14,10,14z"></path>
                        </svg>
                        <p>{error}</p>
                    </div>
                ) : filteredDebts.length === 0 ? (
                    <div className="empty-state">
                        <svg className="empty-icon" viewBox="0 0 20 20">
                            <path d="M10,1.5c-4.651,0-8.5,3.849-8.5,8.5s3.849,8.5,8.5,8.5s8.5-3.849,8.5-8.5S14.651,1.5,10,1.5 M10,17.5c-4.146,0-7.5-3.354-7.5-7.5S5.854,2.5,10,2.5s7.5,3.354,7.5,7.5S14.146,17.5,10,17.5 M10,6.5c-0.276,0-0.5,0.224-0.5,0.5v5c0,0.276,0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5V7C10.5,6.724,10.276,6.5,10,6.5 M10,13.5c-0.276,0-0.5,0.224-0.5,0.5s0.224,0.5,0.5,0.5s0.5-0.224,0.5-0.5S10.276,13.5,10,13.5"></path>
                        </svg>
                        <p>No debts found matching your criteria</p>
                    </div>
                ) : (
                    <div className="debt-cards-container">
                        {filteredDebts.map((debt) => (
                            <div key={debt.id} className="debt-card">
                                <div className="debt-card-header">
                                    <div className="debt-coach">
                                        <div className="debt-avatar">
                                            {debt.coach.urlAvata ? (
                                                <img src={debt.coach.urlAvata} alt={debt.coach.name} />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {debt.coach.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="debt-coach-info">
                                            <h3>{debt.coach.name}</h3>
                                            <p className="debt-level">{debt.coach.level}</p>
                                        </div>
                                    </div>
                                    <div className="debt-status">
                                        {getStatusBadge(debt.status)}
                                    </div>
                                </div>

                                <div className="debt-details">
                                    <div className="debt-detail-item">
                                        <span className="detail-label">Session Date:</span>
                                        <span className="detail-value">{debt.session.datetime}</span>
                                    </div>
                                    <div className="debt-detail-item">
                                        <span className="detail-label">Amount:</span>
                                        <span className="detail-value amount">
                                            {debt.amount.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="debt-actions">
                                    <button
                                        className="view-details-btn"
                                        onClick={() => openDetailModal(debt)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <DebtDetailModal isOpen={modalOpen} onClose={closeDetailModal} debt={selectedDebt} />
            </div>
        </div>
    );
};

export default DebtList;