'use client'

import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X } from 'lucide-react';

interface ImageCropModalProps {
  image: string;
  onSave: (croppedImage: string) => void;
  onCancel: () => void;
  fileName: string;
}

function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Set canvas size to the crop size
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Canvas is empty');
      }
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
    }, 'image/jpeg', 0.95);
  });
}

export default function ImageCropModal({
  image,
  onSave,
  onCancel,
  fileName,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsSaving(true);
    try {
      const croppedImage = await getCroppedImg(imgRef.current, completedCrop);
      onSave(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Crop Image</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSaving}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* File name */}
        <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
          {fileName}
        </div>

        {/* Instructions */}
        <div className="px-4 py-2 bg-blue-50 text-sm text-blue-700">
          Drag corners or edges to resize the crop area. Drag inside to move it.
        </div>

        {/* Cropper */}
        <div className="flex-1 overflow-auto p-4 bg-gray-900 flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className="max-h-[60vh]"
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop preview"
              style={{ maxHeight: '60vh', maxWidth: '100%' }}
            />
          </ReactCrop>
        </div>

        {/* Action buttons */}
        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !completedCrop}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
