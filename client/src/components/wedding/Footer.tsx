import { 
  InstagramIcon, 
  FacebookIcon, 
  Mail 
} from "lucide-react";
import { WEDDING_INFO } from "@/lib/utils";

interface FooterProps {
  onNavigate: {
    toCouple: () => void;
    toEvents: () => void;
    toGallery: () => void;
    toRsvp: () => void;
    toWishes: () => void;
  };
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-neutral-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-['Dancing_Script'] text-4xl text-primary mb-4">
            {WEDDING_INFO.couple.fullNames}
          </h2>
          <p className="text-neutral-300">
            {WEDDING_INFO.event.date}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-12 mb-10">
          <button onClick={onNavigate.toCouple} className="text-neutral-300 hover:text-primary transition-colors">
            Câu Chuyện
          </button>
          <button onClick={onNavigate.toEvents} className="text-neutral-300 hover:text-primary transition-colors">
            Sự Kiện
          </button>
          <button onClick={onNavigate.toGallery} className="text-neutral-300 hover:text-primary transition-colors">
            Hình Ảnh
          </button>
          <button onClick={onNavigate.toRsvp} className="text-neutral-300 hover:text-primary transition-colors">
            Xác Nhận
          </button>
          <button onClick={onNavigate.toWishes} className="text-neutral-300 hover:text-primary transition-colors">
            Lời Chúc
          </button>
        </div>
        
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-neutral-300 hover:text-primary transition-colors">
            <InstagramIcon className="w-5 h-5" />
          </a>
          <a href="#" className="text-neutral-300 hover:text-primary transition-colors">
            <FacebookIcon className="w-5 h-5" />
          </a>
          <a href="mailto:ngocson@example.com" className="text-neutral-300 hover:text-primary transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        </div>
        
        <div className="text-center text-sm text-neutral-400 opacity-70">
          <p>&copy; 2023 Lễ Cưới {WEDDING_INFO.couple.fullNames}. Đã đăng ký bản quyền.</p>
          <p className="mt-1">
            Được tạo với <span className="text-primary">♥</span> cho ngày đặc biệt của chúng tôi
          </p>
        </div>
      </div>
    </footer>
  );
}
