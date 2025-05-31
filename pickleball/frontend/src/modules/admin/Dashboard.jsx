const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin dashboard. Here you can manage your application.</p>
        <div className="mt-8">
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Get Started
            </button>
        </div>
        </div>
    );
    }
export default Dashboard;