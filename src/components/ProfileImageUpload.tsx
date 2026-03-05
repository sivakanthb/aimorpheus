'use client';

import { useRef } from 'react';

interface ProfileImageUploadProps {
  currentImage?: string;
  onImageSelected: (imageData: string) => void;
}

export default function ProfileImageUpload({
  currentImage,
  onImageSelected,
}: ProfileImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onImageSelected(imageData);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        {currentImage && (
          <div className="mb-4">
            <img
              src={currentImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500/50 shadow-lg"
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
        >
          <span>📷</span>
          {currentImage ? 'Change Photo' : 'Upload Photo'}
        </button>

        <p className="text-xs text-slate-400 mt-3">
          JPG, PNG or GIF (Max 2MB)
        </p>
      </div>
    </div>
  );
}
