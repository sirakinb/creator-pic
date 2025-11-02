import React from 'react';

interface ImageModalProps {
  imageSrc: string;
  onClose: () => void;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const ImageModal: React.FC<ImageModalProps> = ({ imageSrc, onClose }) => {
  const imageUrl = `data:image/jpeg;base64,${imageSrc}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `creatorpic-generated-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Prevent clicks inside the modal content from closing it
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-4 md:p-6 w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-fade-in"
        onClick={stopPropagation}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Close image viewer"
        >
          <CloseIcon />
        </button>
        <div className="flex-grow flex items-center justify-center overflow-hidden mb-4">
            <img 
                src={imageUrl} 
                alt="Enlarged generated image" 
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
        </div>
        <div className="flex-shrink-0 text-center">
            <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center h-12 px-8 py-2 font-bold text-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition-all duration-300"
            >
                <DownloadIcon />
                Download
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};