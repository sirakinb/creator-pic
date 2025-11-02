import React, { useRef, useState, useCallback } from 'react';
import type { UploadedImage } from '../types';

interface ImageUploadProps {
  onImageUpload: (files: FileList) => void;
  uploadedImages: UploadedImage[];
  onClear: () => void;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, uploadedImages, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
     // Reset file input to allow uploading the same file again
    if(event.target) {
      event.target.value = '';
    }
  };
  
  const stopEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    stopEvent(e);
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    stopEvent(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    stopEvent(e);
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear();
  };

  const hasImages = uploadedImages.length > 0;

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        multiple
      />
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={stopEvent}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full bg-gray-700/50 rounded-lg border-2 border-dashed  hover:border-cyan-400 transition-colors duration-300 flex items-center justify-center cursor-pointer overflow-hidden group p-4
        ${isDragging ? 'border-cyan-500' : 'border-gray-600'}
        ${hasImages ? 'min-h-[200px]' : 'aspect-square'}`}
      >
        {hasImages ? (
          <div className="flex flex-col items-center justify-center w-full">
             <div className="grid grid-cols-3 gap-2 w-full mb-4">
              {uploadedImages.map((image, index) => (
                  <div key={index} className="aspect-square rounded-md overflow-hidden">
                    <img src={`data:${image.file.type};base64,${image.base64}`} alt={`Uploaded preview ${index + 1}`} className="object-cover h-full w-full" />
                  </div>
              ))}
             </div>
             <p className="text-xs text-gray-400 mb-2">Click or drag to add more images.</p>
             <button onClick={handleClearClick} className="text-sm bg-red-800/50 text-red-300 px-3 py-1 rounded-md hover:bg-red-700/50 transition-colors">
              Clear All
             </button>
          </div>
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon />
            <p className="mt-2 font-semibold">Click or drag to upload</p>
            <p className="text-xs">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};
