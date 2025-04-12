import { 
  CalendarDays, 
  MapPin,
  HeartIcon,
  UserIcon
} from "lucide-react";
import { WEDDING_INFO } from "@/lib/utils";

export default function EventDetails() {
  return (
    <section id="events" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://images.unsplash.com/photo-1513346940167-2b0c10737644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-neutral-800 mb-4">
            Wedding Events
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Join us to celebrate our special day filled with love, joy, and happy memories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Ceremony Card */}
          <div className="bg-neutral-50 p-8 rounded-lg shadow-md text-center border border-primary/20">
            <div className="inline-block p-4 bg-primary/20 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                <path d="M10 7h4"></path>
                <path d="M17 12a5 5 0 1 0-10 0"></path>
                <path d="M19.5 9.5 21 8"></path>
                <path d="M19.5 14.5 21 16"></path>
                <path d="M4.5 9.5 3 8"></path>
                <path d="M4.5 14.5 3 16"></path>
              </svg>
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl text-neutral-800 mb-3">
              The Ceremony
            </h3>
            <p className="mb-6 text-neutral-700">
              Join us as we exchange vows and begin our journey together as husband and wife.
            </p>
            
            <div className="flex items-center justify-center mb-2">
              <CalendarDays className="text-primary mr-2 w-5 h-5" />
              <span>
                {WEDDING_INFO.event.date} | {WEDDING_INFO.event.ceremony.time}
              </span>
            </div>
            <div className="flex items-center justify-center mb-4">
              <MapPin className="text-primary mr-2 w-5 h-5" />
              <span>
                {WEDDING_INFO.event.ceremony.location}
              </span>
            </div>
            
            <a href="#" className="inline-block text-primary/80 hover:text-primary transition-colors">
              <MapPin className="inline mr-1 w-4 h-4" /> View on Map
            </a>
          </div>
          
          {/* Reception Card */}
          <div className="bg-neutral-50 p-8 rounded-lg shadow-md text-center border border-primary/20">
            <div className="inline-block p-4 bg-primary/20 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                <path d="M8 22H5a2 2 0 0 1-2-2V9.5a2 2 0 0 1 .67-1.5l7-5.3a2 2 0 0 1 2.43-.1L21 9"></path>
                <path d="m19 7 3 3"></path>
                <path d="m19 7-3 3"></path>
                <path d="M12 16a4 4 0 0 1 0 8"></path>
                <path d="M17 13a4 4 0 0 1 0 8"></path>
              </svg>
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl text-neutral-800 mb-3">
              The Reception
            </h3>
            <p className="mb-6 text-neutral-700">
              Celebrate with us with dinner, dancing, and joyful festivities as we begin our new life.
            </p>
            
            <div className="flex items-center justify-center mb-2">
              <CalendarDays className="text-primary mr-2 w-5 h-5" />
              <span>
                {WEDDING_INFO.event.date} | {WEDDING_INFO.event.reception.time}
              </span>
            </div>
            <div className="flex items-center justify-center mb-4">
              <MapPin className="text-primary mr-2 w-5 h-5" />
              <span>
                {WEDDING_INFO.event.reception.location}
              </span>
            </div>
            
            <a href="#" className="inline-block text-primary/80 hover:text-primary transition-colors">
              <MapPin className="inline mr-1 w-4 h-4" /> View on Map
            </a>
          </div>
        </div>
        
        {/* Dress Code */}
        <div className="mt-14 text-center max-w-lg mx-auto">
          <h3 className="font-['Playfair_Display'] text-2xl text-neutral-800 mb-4">
            Dress Code
          </h3>
          <p className="text-neutral-700">
            Formal attire is requested. Ladies in elegant dresses and gentlemen in suits.
          </p>
          <div className="flex justify-center mt-4 space-x-8">
            <div className="text-center">
              <HeartIcon className="w-6 h-6 text-primary mb-2 mx-auto" />
              <p className="text-sm text-neutral-700">Elegant Dresses</p>
            </div>
            <div className="text-center">
              <UserIcon className="w-6 h-6 text-primary mb-2 mx-auto" />
              <p className="text-sm text-neutral-700">Formal Suits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
