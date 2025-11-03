import { Button } from '../base/button';
import { Input } from '../base/input';
import { Label } from '../base/label';
import { ImageIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload?: (file: File) => Promise<string>;
  disabled?: boolean;
  accept?: string;
  maxSizeInMB?: number;
  label?: string;
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  disabled = false,
  accept = 'image/*',
  maxSizeInMB = 5,
  label = 'Profile Image',
  onError,
  onSuccess,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    // Validate file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      onError?.(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file');
      return;
    }

    if (!onUpload) {
      onError?.('Upload handler not provided');
      return;
    }

    setIsUploading(true);
    try {
      const result = await onUpload(file);
      onChange(result);
      onSuccess?.('Image uploaded successfully!');
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : 'Failed to upload image',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Upload area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {value ? (
          // Image preview
          <div className="space-y-3">
            <div className="relative aspect-square w-32 mx-auto rounded-lg overflow-hidden border border-border">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!disabled && !isUploading && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Click to change image or drag and drop a new one
            </p>
          </div>
        ) : (
          // Upload prompt
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              {isUploading ? (
                <div className="w-6 h-6 animate-spin rounded-full border-b-2 border-primary" />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isUploading
                  ? 'Uploading...'
                  : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to {maxSizeInMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload button for additional clarity */}
      {!value && (
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Choose File'}
        </Button>
      )}
    </div>
  );
}
