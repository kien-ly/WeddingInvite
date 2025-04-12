import { useRef } from "react";
import { Link } from "wouter";
import Header from "../components/wedding/Header";
import Countdown from "../components/wedding/Countdown";
import CoupleSection from "../components/wedding/CoupleSection";
import EventDetails from "../components/wedding/EventDetails";
import Gallery from "../components/wedding/Gallery";
import WishesSection from "../components/wedding/WishesSection";
import Footer from "../components/wedding/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Create refs for scrolling to sections
  const coupleRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const wishesRef = useRef<HTMLDivElement>(null);

  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="font-sans bg-neutral-50 text-neutral-800">
      <Header onScrollDown={() => scrollToSection(coupleRef)} />
      <Countdown />
      <div ref={coupleRef}>
        <CoupleSection />
      </div>
      <div ref={eventsRef}>
        <EventDetails />
      </div>
      <div ref={galleryRef}>
        <Gallery />
      </div>
      
      {/* RSVP CTA Section */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-['Dancing_Script'] text-3xl md:text-4xl text-primary mb-4">
            Xác Nhận Tham Dự
          </h2>
          <p className="max-w-2xl mx-auto text-neutral-700 mb-8">
            Sự hiện diện của bạn sẽ làm cho ngày cưới của chúng tôi trọn vẹn hơn. Vui lòng xác nhận tham dự để chúng tôi có thể chuẩn bị chu đáo nhất.
          </p>
          <Link href="/rsvp">
            <Button className="bg-primary hover:bg-primary/80 text-white font-medium py-3 px-10 rounded-md">
              Xác Nhận Ngay
            </Button>
          </Link>
        </div>
      </section>
      
      <div ref={wishesRef}>
        <WishesSection />
      </div>
      <Footer
        onNavigate={{
          toCouple: () => scrollToSection(coupleRef),
          toEvents: () => scrollToSection(eventsRef),
          toGallery: () => scrollToSection(galleryRef),
          toRsvp: () => window.location.href = "/rsvp",
          toWishes: () => scrollToSection(wishesRef),
        }}
      />
    </div>
  );
}
