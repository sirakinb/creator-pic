import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, disabled }) => {
  return (
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="e.g., Add a retro filter, make it look like a painting..."
      className="w-full h-24 bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
    />
  );
};
