import React from 'react';

export default function Question({ question, index, onOptionChange, selectedOption }) {
  if (!question || !question.options || !Array.isArray(question.options)) {
    console.error('Dữ liệu câu hỏi không hợp lệ:', question);
    return <div className="text-red-500">Lỗi: Câu hỏi không thể hiển thị.</div>;
  }

  return (
    <div className="mb-6 p-4 border rounded-md bg-gray-50 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        {index + 1}. {question.content}
      </h2>
      <div className="space-y-3">
        {question.options.map(option => (
          <label
            key={option.id}
            className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => onOptionChange(question.id, option.id)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 text-base">{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}