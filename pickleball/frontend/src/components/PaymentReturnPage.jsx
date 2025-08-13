import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, ArrowLeftIcon, HomeIcon, CreditCardIcon } from "@heroicons/react/24/outline";

function PaymentReturnPage() {
    const {
        status,
        orderId,
        amount,
        transactionNo,
        bankCode,
        responseCode
    } = useParams();

    const [paymentResult, setPaymentResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Validate required parameters
        if (!orderId || !transactionNo) {
            navigate("/payment-error");
            return;
        }

        // Format amount
        const formattedAmount = amount ? parseInt(amount).toLocaleString("en-US") : "0";

        setPaymentResult({
            status: status === "success" ? "success" : "fail",
            orderId,
            amount: formattedAmount,
            transactionNo,
            bankCode,
            responseCode
        });

    }, [status, orderId, amount, transactionNo, bankCode, responseCode, navigate]);

    if (!paymentResult) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 text-lg">Processing payment result...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className={`p-6 ${paymentResult.status === "success" ? "bg-green-50" : "bg-red-50"}`}>
                    <div className="flex items-center justify-center">
                        {paymentResult.status === "success" ? (
                            <CheckCircleIcon className="h-12 w-12 text-green-500" />
                        ) : (
                            <XCircleIcon className="h-12 w-12 text-red-500" />
                        )}
                    </div>
                    <h2 className={`mt-4 text-center text-2xl font-bold ${paymentResult.status === "success" ? "text-green-600" : "text-red-600"}`}>
                        {paymentResult.status === "success" ? "Payment Successful" : "Payment Failed"}
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Order ID:</span>
                            <span className="font-medium">{paymentResult.orderId}</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Amount:</span>
                            <span className="font-medium">${paymentResult.amount} VND</span>
                        </div>

                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Transaction No:</span>
                            <span className="font-medium">{paymentResult.transactionNo}</span>
                        </div>

                        {paymentResult.bankCode && (
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Bank:</span>
                                <span className="font-medium">{paymentResult.bankCode}</span>
                            </div>
                        )}

                        {paymentResult.status !== "success" && (
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Error Code:</span>
                                <span className="font-medium text-red-500">{paymentResult.responseCode}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => navigate("/learner")}
                            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <HomeIcon className="h-5 w-5 mr-2" />
                            Back to Home
                        </button>

                        {paymentResult.status !== "success" && (
                            <button
                                onClick={() => navigate("/payment")}
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                <CreditCardIcon className="h-5 w-5 mr-2" />
                                Retry Payment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentReturnPage;