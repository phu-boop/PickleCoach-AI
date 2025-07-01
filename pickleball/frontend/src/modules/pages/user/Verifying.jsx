const Verifying = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-gray-200">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="spinner"></div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4 animate-pulse">
                    Verifying...
                </h1>
                <p className="text-lg text-gray-600">
                    Please wait while we verify your account.
                </p>
            </div>
        </div>
    );
};

export default Verifying;