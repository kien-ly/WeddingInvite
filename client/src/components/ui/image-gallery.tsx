import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Image = {
  id: number;
  src: string;
  alt: string;
  original: string;
};

interface ImageGalleryProps {
  images: Image[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    } else if (e.key === "ArrowLeft") {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={image.id}
            className="gallery-img rounded-md overflow-hidden shadow-md cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
            onClick={() => openGallery(index)}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="max-w-4xl bg-black bg-opacity-90 border-none p-0 sm:p-0" 
          onKeyDown={handleKeyDown}
          hideCloseButton
        >
          <div className="relative flex items-center justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 text-white hover:bg-white/20 z-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <div className="overflow-hidden py-10 px-4">
              <img 
                src={images[currentIndex].original} 
                alt={images[currentIndex].alt} 
                className="max-h-[80vh] w-auto mx-auto"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 text-white hover:bg-white/20 z-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
