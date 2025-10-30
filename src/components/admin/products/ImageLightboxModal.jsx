import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

export default function ImageLightboxModal({ item, open, onOpenChange }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const images = item?.images || [];
  const currentImage = images[currentImageIndex];

  useEffect(() => {
    if (open && item) {
      setCurrentImageIndex(0);
      setScale(1);
    }
  }, [open, item]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          onOpenChange(false);
          break;
        case '+':
        case '=':
          e.preventDefault();
          setScale(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          e.preventDefault();
          setScale(prev => Math.max(prev - 0.25, 0.5));
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, currentImageIndex, images.length]);

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setScale(1);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setScale(1);
  };

  const resetZoom = () => setScale(1);

  if (!open || !item || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 bg-black/95 border-0">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <span className="text-sm bg-black/50 px-2 py-1 rounded">
              {currentImageIndex + 1} / {images.length}
            </span>
            <span className="text-sm truncate max-w-md">
              {item.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setScale(prev => Math.max(prev - 0.25, 0.5))}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={resetZoom}
            >
              {Math.round(scale * 100)}%
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setScale(prev => Math.min(prev + 0.25, 3))}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Image */}
        <div className="flex items-center justify-center w-full h-full p-8">
          <img
            src={currentImage}
            alt={`${item.name} - Image ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
            onError={(e) => {
              e.target.src = "/placeholder-food.jpg";
            }}
          />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex justify-center gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 border-2 rounded overflow-hidden transition-all ${
                    index === currentImageIndex 
                      ? 'border-white scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setScale(1);
                  }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-food.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}