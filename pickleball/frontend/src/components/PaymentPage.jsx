import React, { useState } from "react";
import { createPayment } from "../api/learner/paymentService.js";

function PaymentPage() {
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState("");

    const handlePayment = async () => {
        try {
            const data = await createPayment(orderId, amount);
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Thanh toán VNPAY</h2>

                <div className="mb-4">
                    <label className="block mb-2 text-gray-700 font-medium">Mã đơn hàng</label>
                    <input
                        type="text"
                        placeholder="Nhập mã đơn hàng"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-gray-700 font-medium">Số tiền (VNĐ)</label>
                    <input
                        type="number"
                        placeholder="Nhập số tiền"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
                    />
                </div>

                <button
                    onClick={handlePayment}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
}

export default PaymentPage;
