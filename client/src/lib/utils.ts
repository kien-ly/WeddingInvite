import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

// Wedding date for countdown
export const WEDDING_DATE = new Date("2023-08-15T10:00:00");

// Event details
export const WEDDING_INFO = {
  couple: {
    brideFirstName: "Ngoc",
    groomFirstName: "Son",
    fullNames: "Ngoc & Son",
    brideDescription: "A creative soul with a passion for art and design. She loves traveling and exploring new cultures.",
    groomDescription: "A dedicated professional with a love for music and technology. He enjoys outdoor activities and good conversations."
  },
  event: {
    date: "August 15, 2023",
    venue: "Golden Palace, Hanoi",
    ceremony: {
      time: "10:00 AM",
      location: "Golden Palace, 18 Tran Duy Hung, Hanoi"
    },
    reception: {
      time: "6:00 PM",
      location: "Golden Palace, 18 Tran Duy Hung, Hanoi"
    }
  },
  story: {
    meetingStory: "Our paths crossed at a mutual friend's birthday party in the summer of 2018. What started as a casual conversation about our shared love for travel turned into a deep connection that has only grown stronger over time.",
    proposalStory: "After three years of adventures together, Son proposed during a sunset picnic at our favorite lakeside spot. And of course, Ngoc said yes!"
  }
};

// Gallery images
export const GALLERY_IMAGES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Couple at beach",
    original: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1537907510280-696063934a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Couple in park",
    original: "https://images.unsplash.com/photo-1537907510280-696063934a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Engagement celebration",
    original: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "First date memory",
    original: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Travel together",
    original: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1488116904251-78dddc38a477?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Romantic dinner",
    original: "https://images.unsplash.com/photo-1488116904251-78dddc38a477?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1535262412227-85541e910204?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Proposal moment",
    original: "https://images.unsplash.com/photo-1535262412227-85541e910204?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    alt: "Pre-wedding photo",
    original: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
  }
];
