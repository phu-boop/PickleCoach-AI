export default function Result({ score, total, onReset }) {
    return (
    <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Your Score: {score} / {total}
        </h2>
        <button
        onClick={onReset}
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
        Try Again
        </button>
    </div>
    );
};