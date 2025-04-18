import { ImageGallery } from "@/components/ui/image-gallery";
import { GALLERY_IMAGES } from "@/lib/utils";

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-neutral-800 mb-4">
            Khoảnh Khắc Của Chúng Tôi
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Hành trình tình yêu và những kỷ niệm đẹp mà chúng tôi đã tạo nên cùng nhau.
          </p>
        </div>
        
        <ImageGallery images={GALLERY_IMAGES} />
      </div>
    </section>
  );
}
