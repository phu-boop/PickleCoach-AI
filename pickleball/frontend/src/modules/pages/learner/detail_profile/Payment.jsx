import React from "react";
import { FaDollarSign, FaCalendarAlt } from "react-icons/fa";

const PaymentSettings = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm space-y-8">
      {/* Stripe Connection Box */}
      <div className="border border-dashed border-[#a78bfa] rounded-xl p-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#7c3aed]">stripe</h2>
          <p className="text-sm text-gray-600">No account connected</p>
          <p className="text-sm text-gray-500 mt-1">
            Start collecting payments from Pickleheads users for sessions or group memberships.
          </p>
        </div>
        <button className="bg-[#7c3aed] hover:bg-[#6a28d9] text-white font-semibold px-4 py-2 rounded-md text-sm shadow">
          Start Collecting Payments <span className="ml-1">🔗</span>
        </button>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-bold text-[#0a0b3d] mb-3">Payment Methods</h3>
        <button
          className="px-4 py-2 font-bold border border-[#f97316] rounded-full text-black hover:bg-orange-100 transition"
          onClick={() => alert("This feature is not developed yet.")}
        >
          Add Credit or Debit Card
        </button>
      </div>

      {/* Preferred Currency */}
      <div>
        <h3 className="text-lg font-bold text-[#0a0b3d] mb-2">Preferred Currency</h3>
        <div className="flex items-center gap-2">
          <FaDollarSign className="text-gray-600" />
          <select className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#2d93ad]">
            <option value="USD">USD</option>
            <option value="VND">VND</option>
          </select>
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-lg font-bold text-[#0a0b3d] mb-2">Payment History</h3>
        <p className="text-gray-500">No charges found for this month</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="border px-3 py-1 rounded-md text-gray-700">Jul 2025</span>
          <FaCalendarAlt className="text-gray-600" />
        </div>
      </div>

      {/* Third-Party Payment Info */}
      <div>
        <h3 className="text-lg font-bold text-[#0a0b3d] mb-2">
          Third-Party Payment Information
        </h3>
        <p className="text-red-500 text-sm mb-2">
          Support for third-party payments will be going away soon!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Venmo</label>
            <input
              type="text"
              placeholder="ex. venmo-name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">CashApp</label>
            <input
              type="text"
              placeholder="ex. cash-app-name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-900 font-extrabold mb-1">PayPal</label>
            <input
              type="text"
              placeholder="ex. paypal.me/robertkim77"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
