import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 py-4 border-b border-cyan-400/20">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          creatorpic
        </h1>
        <p className="mt-2 text-md text-gray-400">
          Generate multiple creative edits of your photos using the power of Gemini.
        </p>
      </div>
    </header>
  );
};