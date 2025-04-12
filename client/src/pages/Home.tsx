import { useRef } from "react";
import Header from "../components/wedding/Header";
import Countdown from "../components/wedding/Countdown";
import CoupleSection from "../components/wedding/CoupleSection";
import EventDetails from "../components/wedding/EventDetails";
import Gallery from "../components/wedding/Gallery";
import RsvpForm from "../components/wedding/RsvpForm";
import WishesSection from "../components/wedding/WishesSection";
import Footer from "../components/wedding/Footer";

export default function Home() {
  // Create refs for scrolling to sections
  const coupleRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const rsvpRef = useRef<HTMLDivElement>(null);
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
      <div ref={rsvpRef}>
        <RsvpForm />
      </div>
      <div ref={wishesRef}>
        <WishesSection />
      </div>
      <Footer
        onNavigate={{
          toCouple: () => scrollToSection(coupleRef),
          toEvents: () => scrollToSection(eventsRef),
          toGallery: () => scrollToSection(galleryRef),
          toRsvp: () => scrollToSection(rsvpRef),
          toWishes: () => scrollToSection(wishesRef),
        }}
      />
    </div>
  );
}
