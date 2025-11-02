import React from 'react';
import { Spinner } from './Spinner';

interface GenerateButtonProps {
  isGenerating: boolean;
  onClick: () => void;
  disabled: boolean;
  count: number;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({ isGenerating, onClick, disabled, count }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-14 px-4 py-2 font-bold text-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
    >
      {isGenerating ? (
        <>
          <Spinner />
          <span>Generating...</span>
        </>
      ) : (
        `Generate ${count} Images`
      )}
    </button>
  );
};
