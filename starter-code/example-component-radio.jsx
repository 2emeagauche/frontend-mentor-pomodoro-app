import React, { useState } from 'react';

export default function CustomRadioInput() {
  const [selected, setSelected] = useState('option1');

  const options = [
    { id: 'option1', label: 'First Option', description: 'This is the first choice' },
    { id: 'option2', label: 'Second Option', description: 'This is the second choice' },
    { id: 'option3', label: 'Third Option', description: 'This is the third choice' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Choose an option
        </h2>
        
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50"
              style={{
                borderColor: selected === option.id ? '#3b82f6' : '#e5e7eb',
                backgroundColor: selected === option.id ? '#eff6ff' : 'transparent'
              }}
            >
              <input
                type="radio"
                name="custom-radio"
                value={option.id}
                checked={selected === option.id}
                onChange={(e) => setSelected(e.target.value)}
                className="sr-only"
              />
              
              <div className="relative flex-shrink-0 mt-0.5">
                <div
                  className="w-5 h-5 rounded-full border-2 transition-all"
                  style={{
                    borderColor: selected === option.id ? '#3b82f6' : '#d1d5db',
                    backgroundColor: selected === option.id ? '#3b82f6' : 'white'
                  }}
                >
                  {selected === option.id && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="absolute top-0 left-0"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="3"
                        fill="white"
                      />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {option.label}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {option.description}
                </div>
              </div>
            </label>
          ))}
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          Selected: <span className="font-semibold text-gray-900">{selected}</span>
        </p>
      </div>
    </div>
  );
}