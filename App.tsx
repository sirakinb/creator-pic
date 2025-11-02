import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { PromptInput } from './components/PromptInput';
import { GenerateButton } from './components/GenerateButton';
import { ImageGrid } from './components/ImageGrid';
import { ImageModal } from './components/ImageModal';
import { generateImageEdits } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { UploadedImage } from './types';

const GENERATION_COUNT = 10;

const App: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (files: FileList) => {
    try {
      const newImages: UploadedImage[] = await Promise.all(
        Array.from(files).map(async (file) => {
          const base64 = await fileToBase64(file);
          return { file, base64 };
        })
      );
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
      setGeneratedImages([]); // Clear previous results when new images are uploaded
      setError(null);
    } catch (err) {
      setError('Failed to read image file(s).');
      console.error(err);
    }
  }, []);
  
  const handleClearImages = useCallback(() => {
    setUploadedImages([]);
  }, []);

  const handleGenerate = async () => {
    if (uploadedImages.length === 0 || !prompt) {
      setError('Please upload at least one image and enter a prompt.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const imagePayload = uploadedImages.map(img => ({ base64: img.base64, mimeType: img.file.type }));
      const results = await generateImageEdits(
        imagePayload,
        prompt,
        GENERATION_COUNT
      );
      setGeneratedImages(results);
    } catch (err: any) {
      const message = err.message || 'An unknown error occurred during image generation.';
      setError(`Error: ${message}`);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = (imageBase64: string) => {
    setSelectedImage(imageBase64);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-4 xl:col-span-3 bg-gray-800/50 rounded-2xl p-6 flex flex-col gap-6 h-fit sticky top-8">
            <h2 className="text-xl font-bold text-cyan-400">1. Upload Images</h2>
            <ImageUpload onImageUpload={handleImageUpload} uploadedImages={uploadedImages} onClear={handleClearImages} />

            <h2 className="text-xl font-bold text-cyan-400 mt-4">2. Describe Edit</h2>
            <PromptInput prompt={prompt} setPrompt={setPrompt} disabled={isGenerating} />

            <div className="mt-4">
              <GenerateButton
                isGenerating={isGenerating}
                onClick={handleGenerate}
                disabled={uploadedImages.length === 0 || !prompt || isGenerating}
                count={GENERATION_COUNT}
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-8 xl:col-span-9 bg-gray-800/50 rounded-2xl p-6 min-h-[80vh]">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Generated Images</h2>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                <p className="font-bold">Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            <ImageGrid
              images={generatedImages}
              isGenerating={isGenerating}
              count={GENERATION_COUNT}
              hasUploadedImage={uploadedImages.length > 0}
              onImageClick={handleImageSelect}
            />
          </div>
        </div>
      </main>
      {selectedImage && (
        <ImageModal 
          imageSrc={selectedImage}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;