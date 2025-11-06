import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X } from 'lucide-react';

interface ImageCropModalProps {
  image: string;
  onSave: (croppedImage: string) => void;
  onCancel: () => void;
  fileName: string;
}

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CroppedArea
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback(
    (croppedArea: CroppedArea, croppedAreaPixels: CroppedArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsSaving(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
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

        {/* Cropper */}
        <div className="relative flex-1 min-h-[400px] bg-gray-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="p-4 border-t space-y-4">
          {/* Zoom slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Zoom: {zoom.toFixed(1)}x
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
