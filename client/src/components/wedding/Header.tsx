import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEDDING_INFO } from "@/lib/utils";

interface HeaderProps {
  onScrollDown: () => void;
}

export default function Header({ onScrollDown }: HeaderProps) {
  return (
    <header className="relative w-full h-screen bg-cover bg-center flex items-center justify-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 text-center px-6">
        <h3 className="font-['Dancing_Script'] text-2xl md:text-3xl text-white mb-3">Lễ Thành Hôn</h3>
        <h1 className="font-['Playfair_Display'] text-5xl md:text-7xl text-white font-bold mb-4">
          {WEDDING_INFO.couple.fullNames}
        </h1>
        <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        <p className="font-sans text-xl md:text-2xl text-white mb-4">
          {WEDDING_INFO.event.date}
        </p>
        <p className="font-sans text-lg md:text-xl text-white mb-8">
          {WEDDING_INFO.event.venue}
        </p>
        <Button 
          className="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-8 rounded-md transition duration-300"
          onClick={() => {
            // Navigate to RSVP page
            window.location.href = "/rsvp";
          }}
        >
          Xác Nhận Tham Dự
        </Button>
      </div>
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <button 
          onClick={onScrollDown}
          className="text-white hover:text-primary transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="animate-bounce w-8 h-8" />
        </button>
      </div>
    </header>
  );
}
