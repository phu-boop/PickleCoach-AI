import React, { useEffect, useState } from "react";

function PaymentReturnPage() {
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        // Lấy các params từ URL
        const queryParams = new URLSearchParams(window.location.search);
        const resultCode = queryParams.get("vnp_ResponseCode");
        const amount = queryParams.get("vnp_Amount");
        const orderId = queryParams.get("vnp_TxnRef");
        const transactionNo = queryParams.get("vnp_TransactionNo");

        // Chuyển amount từ đơn vị nhỏ sang VNĐ
        const amountVND = amount ? (parseInt(amount, 10) / 100).toLocaleString("vi-VN") : "0";

        let status = "";
        if (resultCode === "00") {
            status = "success";
        } else {
            status = "fail";
        }

        setPaymentResult({
            status,
            amount: amountVND,
            orderId,
            transactionNo
        });
    }, []);

    if (!paymentResult) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-lg text-gray-700">Đang xử lý kết quả thanh toán...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
                {paymentResult.status === "success" ? (
                    <>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            Thanh toán thành công!
                        </h2>
                        <p className="text-gray-700 mb-2">
                            Mã đơn hàng: <span className="font-semibold">{paymentResult.orderId}</span>
                        </p>
                        <p className="text-gray-700 mb-2">
                            Số tiền: <span className="font-semibold">{paymentResult.amount} VNĐ</span>
                        </p>
                        <p className="text-gray-700 mb-4">
                            Mã giao dịch: <span className="font-semibold">{paymentResult.transactionNo}</span>
                        </p>
                        <a
                            href="/"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Quay về trang chủ
                        </a>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Thanh toán thất bại!
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Vui lòng thử lại hoặc liên hệ hỗ trợ.
                        </p>
                        <a
                            href="/"
                            className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Quay về trang chủ
                        </a>
                    </>
                )}
            </div>
        </div>
    );
}

export default PaymentReturnPage;
