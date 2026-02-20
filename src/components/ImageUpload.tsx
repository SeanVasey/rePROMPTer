import { useRef, useEffect, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  imageFile: File | null;
  onImageChange: (file: File | null, base64: string | null) => void;
}

export default function ImageUpload({ imageFile, onImageChange }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] ?? null;
      onImageChange(file, base64);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    onImageChange(null, null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {imageFile && previewUrl ? (
        <div className="relative group">
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-accent/50">
            <img
              src={previewUrl}
              alt="Reference image for prompt enhancement"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-accent text-white rounded-full p-1 shadow-md hover:bg-accent-dark transition-colors"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-surface-border flex flex-col items-center justify-center gap-1 text-muted hover:border-accent/50 hover:text-white transition-colors"
          aria-label="Upload reference image"
        >
          <Upload size={18} />
          <span className="text-[10px] font-bold tracking-wider">ADD IMG</span>
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
        aria-label="Choose image file"
      />
    </div>
  );
}
