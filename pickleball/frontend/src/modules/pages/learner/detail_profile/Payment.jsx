import React from "react";
import Sidebar from "./Sidebar";
import { FaDollarSign, FaCalendarAlt } from "react-icons/fa";

const PaymentSettings = () => {
  return (
    <div className="flex justify-between my-10 w-[80%] mx-auto min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 pr-16 pl-14 font-grandstander"> 
        <h1 className="text-3xl font-extrabold text-[#363442] mb-8 -mt-2">Payments</h1>

        <div className="border border-dashed border-[#7c3aed] rounded-xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-start">
            <h2 className="text-5xl font-extrabold text-[#7c3aed] mr-4 leading-none font-grandstander">stripe</h2> 
            <div>
              <p className="text-base text-gray-600 mb-1">No account connected</p>
              <p className="text-sm text-gray-500 max-w-md">
                Start collecting payments from Pickleheads users for sessions or group memberships.
              </p>
            </div>
          </div>
          <button className="bg-[#7c3aed] hover:bg-[#6a28d9] text-white font-semibold px-5 py-2 rounded-md text-sm shadow flex items-center">
            Start Collecting Payments <span className="ml-2 text-base">🔗</span>
          </button>
        </div>

        <div className="mb-8 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-[#0a0b3d] mb-3">Payment Methods</h3>
          <button
            className="px-4 py-2 font-bold border border-[#f97316] rounded-full text-[#f97316] hover:bg-orange-100 transition text-sm"
            onClick={() => alert("This feature is not developed yet.")}
          >
            Add Credit or Debit Card
          </button>
        </div>

        <div className="mb-8 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-[#0a0b3d] mb-3">Preferred Currency</h3>
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-gray-600 text-lg" />
            <select className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#2d93ad] text-sm">
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </select>
          </div>
        </div>

        <div className="mb-8 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-bold text-[#0a0b3d] mb-2">Payment History</h3>
          <div className="mt-2 flex items-center gap-2 justify-between w-full">
            <p className="text-gray-500 text-sm">No charges found for this month</p>
            <div className="flex items-center gap-2">
              <span className="border border-gray-300 px-3 py-1 rounded-md text-gray-700 text-sm flex items-center gap-2">
                Jul 2025 <FaCalendarAlt className="text-gray-500 text-base" />
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-[#0a0b3d] mb-2">Third-Party Payment Information</h3>
          <p className="text-red-500 text-sm mb-3">
            Support for third-party payments will be going away soon!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1 text-sm">Venmo</label>
              <input
                type="text"
                placeholder="ex. venmo-name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1 text-sm">CashApp</label>
              <input
                type="text"
                placeholder="ex. cash-app-name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-900 font-bold mb-1 text-sm">PayPal</label>
              <input
                type="text"
                placeholder="ex. paypal.me/robertkim77"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;