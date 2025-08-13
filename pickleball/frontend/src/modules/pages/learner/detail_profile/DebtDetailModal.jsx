import React, {} from "react";
import { useNavigate } from "react-router-dom";
import "./DebtList.css";
import {createPayment} from "../../../../api/learner/paymentService.js";
const DebtDetailModal = ({ isOpen, onClose, debt }) => {
    const navigate = useNavigate();
    if (!isOpen || !debt) return null;

    const formatCurrency = (amount) => {
        return amount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };

    const handleViewCoach = () => {
        navigate(`/DetailCoach/${debt.coach.userId}`);
    };
    const handlePayment = async () => {
        try {
            const data = await createPayment(debt.id, debt.amount);
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl; // Redirect sang trang thanh toán VNPAY
            } else {
                alert("Lỗi tạo link thanh toán");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi khi gọi API thanh toán");
        }
    };
    return (
        <div className="modal-overlay">
            <div className="debt-detail-modal">
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>

                <div className="modal-header">
                    <h3>Debt Details</h3>
                    <button className="debt-id p-4" onClick={onClose}></button>
                </div>

                <div className="modal-sections">
                    <section className="modal-section">
                        <div className="section-header">
                            <svg className="section-icon" viewBox="0 0 20 20">
                                <path d="M10,6.5c1.104,0,2-0.896,2-2s-0.896-2-2-2s-2,0.896-2,2S8.896,6.5,10,6.5 M10,3.5c0.552,0,1,0.448,1,1s-0.448,1-1,1s-1-0.448-1-1S9.448,3.5,10,3.5 M15,8.5h-1.5v-1H15V8.5z M6.5,7.5H5v1h1.5V7.5z M10,17.5c-4.136,0-7.5-3.364-7.5-7.5S5.864,2.5,10,2.5s7.5,3.364,7.5,7.5S14.136,17.5,10,17.5 M10,1.5C5.313,1.5,1.5,5.313,1.5,10s3.813,8.5,8.5,8.5s8.5-3.813,8.5-8.5S14.687,1.5,10,1.5 M10,12.5c-1.104,0-2-0.896-2-2s0.896-2,2-2s2,0.896,2,2S11.104,12.5,10,12.5 M10,9.5c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1S10.552,9.5,10,9.5"></path>
                            </svg>
                            <h4>Coach Information</h4>
                            <button
                                className="view-coach-btn"
                                onClick={handleViewCoach}
                            >
                                View Coach Profile
                            </button>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Name:</span>
                                <span className="info-value">{debt.coach.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{debt.coach.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Level:</span>
                                <span className="info-value">{debt.coach.level}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Certifications:</span>
                                <span className="info-value">
                                    {debt.coach.certifications.join(", ") || "None"}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Specialties:</span>
                                <span className="info-value">
                                    {debt.coach.specialties.join(", ") || "None"}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="modal-section">
                        <div className="section-header">
                            <svg className="section-icon" viewBox="0 0 20 20">
                                <path d="M10,6.5c1.104,0,2-0.896,2-2s-0.896-2-2-2s-2,0.896-2,2S8.896,6.5,10,6.5 M10,3.5c0.552,0,1,0.448,1,1s-0.448,1-1,1s-1-0.448-1-1S9.448,3.5,10,3.5 M15,8.5h-1.5v-1H15V8.5z M6.5,7.5H5v1h1.5V7.5z M10,17.5c-4.136,0-7.5-3.364-7.5-7.5S5.864,2.5,10,2.5s7.5,3.364,7.5,7.5S14.136,17.5,10,17.5 M10,1.5C5.313,1.5,1.5,5.313,1.5,10s3.813,8.5,8.5,8.5s8.5-3.813,8.5-8.5S14.687,1.5,10,1.5 M10,12.5c-1.104,0-2-0.896-2-2s0.896-2,2-2s2,0.896,2,2S11.104,12.5,10,12.5 M10,9.5c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1S10.552,9.5,10,9.5"></path>
                            </svg>
                            <h4>Session Details</h4>
                        </div>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Date & Time:</span>
                                <span className="info-value">{debt.session.datetime}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Status:</span>
                                <span className="info-value">{debt.session.status}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Amount:</span>
                                <span className="info-value amount">{formatCurrency(debt.amount)}</span>
                            </div>
                            {debt.session.videoLink && (
                                <div className="info-item">
                                    <span className="info-label">Video Link:</span>
                                    <a href={debt.session.videoLink} className="info-value link" target="_blank" rel="noopener noreferrer">
                                        Watch Session
                                    </a>
                                </div>
                            )}
                            {debt.session.feedback && (
                                <div className="info-item">
                                    <span className="info-label">Feedback:</span>
                                    <span className="info-value">{debt.session.feedback}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {debt.learner && (
                        <section className="modal-section">
                            <div className="section-header">
                                <svg className="section-icon" viewBox="0 0 20 20">
                                    <path d="M10,6.5c1.104,0,2-0.896,2-2s-0.896-2-2-2s-2,0.896-2,2S8.896,6.5,10,6.5 M10,3.5c0.552,0,1,0.448,1,1s-0.448,1-1,1s-1-0.448-1-1S9.448,3.5,10,3.5 M15,8.5h-1.5v-1H15V8.5z M6.5,7.5H5v1h1.5V7.5z M10,17.5c-4.136,0-7.5-3.364-7.5-7.5S5.864,2.5,10,2.5s7.5,3.364,7.5,7.5S14.136,17.5,10,17.5 M10,1.5C5.313,1.5,1.5,5.313,1.5,10s3.813,8.5,8.5,8.5s8.5-3.813,8.5-8.5S14.687,1.5,10,1.5 M10,12.5c-1.104,0-2-0.896-2-2s0.896-2,2-2s2,0.896,2,2S11.104,12.5,10,12.5 M10,9.5c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1S10.552,9.5,10,9.5"></path>
                                </svg>
                                <h4>Your Information</h4>
                            </div>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">Skill Level:</span>
                                    <span className="info-value">{debt.learner.skillLevel || "Not specified"}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Goals:</span>
                                    <span className="info-value">{debt.learner.goals || "Not specified"}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Progress:</span>
                                    <span className="info-value">{debt.learner.progress || "Not specified"}</span>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="close-btn" onClick={onClose}>
                        Close
                    </button>
                    {debt.status === "PENDING" && (
                        <button className="pay-btn" onClick={() => handlePayment()}>
                            Pay Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DebtDetailModal;