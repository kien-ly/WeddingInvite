import { 
  CalendarDays, 
  MapPin,
  Clock
} from "lucide-react";
import { WEDDING_INFO } from "@/lib/utils";

export default function EventDetails() {
  const icons = [
    // Ring icon
    <svg key="ring" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
      <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
      <path d="M10 7h4"></path>
      <path d="M17 12a5 5 0 1 0-10 0"></path>
      <path d="M19.5 9.5 21 8"></path>
      <path d="M19.5 14.5 21 16"></path>
      <path d="M4.5 9.5 3 8"></path>
      <path d="M4.5 14.5 3 16"></path>
    </svg>,
    // Home icon
    <svg key="home" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>,
    // Church icon
    <svg key="church" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
      <path d="M8 22H5a2 2 0 0 1-2-2V9.5a2 2 0 0 1 .67-1.5l7-5.3a2 2 0 0 1 2.43-.1L21 9"></path>
      <path d="m19 7 3 3"></path>
      <path d="m19 7-3 3"></path>
      <path d="M12 16a4 4 0 0 1 0 8"></path>
      <path d="M17 13a4 4 0 0 1 0 8"></path>
    </svg>,
    // Party icon
    <svg key="party" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
      <path d="M5.8 11.3 2 22l10.7-3.79"></path>
      <path d="M4 3h.01"></path>
      <path d="M22 8h.01"></path>
      <path d="M15 2h.01"></path>
      <path d="M22 20h.01"></path>
      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"></path>
      <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17"></path>
      <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7"></path>
      <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"></path>
    </svg>
  ];

  return (
    <section id="events" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://images.unsplash.com/photo-1513346940167-2b0c10737644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-neutral-800 mb-4">
            Sự Kiện Cưới
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Chúng tôi rất vui khi được chia sẻ những khoảnh khắc đặc biệt này cùng gia đình và bạn bè.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {WEDDING_INFO.event.events.map((event, index) => (
            <div key={index} className="bg-neutral-50 p-8 rounded-lg shadow-md text-center border border-primary/20">
              <div className="inline-block p-4 bg-primary/20 rounded-full mb-6">
                {icons[index]}
              </div>
              <h3 className="font-['Playfair_Display'] text-2xl text-neutral-800 mb-3">
                {event.title}
              </h3>
              <p className="mb-6 text-neutral-700">
                {event.description}
              </p>
              
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-primary mr-2 w-5 h-5" />
                <span>
                  {WEDDING_INFO.event.date} | {event.time}
                </span>
              </div>
              <div className="flex items-center justify-center mb-4">
                <MapPin className="text-primary mr-2 w-5 h-5" />
                <span>
                  {event.location}
                </span>
              </div>
              
              <a href="#" className="inline-block text-primary/80 hover:text-primary transition-colors">
                <MapPin className="inline mr-1 w-4 h-4" /> Xem Bản Đồ
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
