import React from 'react';
import { Spinner } from './Spinner';

interface ImageGridProps {
  images: string[];
  isGenerating: boolean;
  count: number;
  hasUploadedImage: boolean;
  onImageClick: (imageBase64: string) => void;
}

const Placeholder: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-500 text-center">{text}</p>
    </div>
);


const LoadingSkeleton: React.FC = () => (
  <div className="aspect-square bg-gray-700/50 rounded-lg flex items-center justify-center animate-pulse">
    <Spinner />
  </div>
);

export const ImageGrid: React.FC<ImageGridProps> = ({ images, isGenerating, count, hasUploadedImage, onImageClick }) => {
  if (isGenerating) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (images.length > 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((base64Image, index) => (
          <div 
            key={index} 
            className="aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 hover:shadow-cyan-500/20 transition-all duration-300"
            onClick={() => onImageClick(base64Image)}
          >
            <img
              src={`data:image/jpeg;base64,${base64Image}`}
              alt={`Generated image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[50vh] flex items-center justify-center">
        {!hasUploadedImage ? (
            <Placeholder text="Upload one or more reference images to get started." />
        ) : (
            <Placeholder text="Your generated images will appear here." />
        )}
    </div>
  );
};