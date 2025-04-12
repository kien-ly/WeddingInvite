import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  return new Intl.DateTimeFormat("vi-VN", {
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
    brideFirstName: "Ngọc",
    groomFirstName: "Sơn",
    fullNames: "Ngọc & Sơn",
    brideDescription: "Cô dâu xinh đẹp với niềm đam mê nghệ thuật và thiết kế. Cô ấy yêu thích du lịch và khám phá các nền văn hóa mới.",
    groomDescription: "Chú rể tài năng với tình yêu âm nhạc và công nghệ. Anh ấy thích các hoạt động ngoài trời và những cuộc trò chuyện thú vị."
  },
  event: {
    date: "15 tháng 8, 2023",
    venue: "Cung Điện Vàng, Hà Nội",
    events: [
      {
        title: "Lễ Đón Dâu",
        time: "08:00",
        location: "Nhà Gái, 25 Trần Hưng Đạo, Hà Nội",
        description: "Lễ đón dâu tại nhà gái, nơi chú rể và đoàn nhà trai đến đón cô dâu."
      },
      {
        title: "Lễ Vu Quy",
        time: "09:30",
        location: "Nhà Trai, 56 Lê Lợi, Hà Nội",
        description: "Lễ vu quy tại nhà trai, nghi thức đón cô dâu về nhà chồng."
      },
      {
        title: "Lễ Thành Hôn",
        time: "10:30",
        location: "Cung Điện Vàng, 18 Trần Duy Hưng, Hà Nội",
        description: "Lễ cưới chính thức với sự hiện diện của hai họ và quan khách."
      },
      {
        title: "Tiệc Cưới",
        time: "18:00",
        location: "Cung Điện Vàng, 18 Trần Duy Hưng, Hà Nội",
        description: "Tiệc mừng chung vui cùng gia đình, bạn bè và khách mời."
      }
    ]
  },
  story: {
    meetingStory: "Chúng tôi gặp nhau lần đầu tại một buổi tiệc sinh nhật của người bạn chung vào mùa hè năm 2018. Cuộc trò chuyện về niềm đam mê du lịch đã kết nối hai chúng tôi và mối quan hệ đó đã ngày càng sâu đậm hơn theo thời gian.",
    proposalStory: "Sau ba năm đồng hành cùng nhau, Sơn đã cầu hôn Ngọc trong một buổi dã ngoại hoàng hôn tại hồ Tây - nơi yêu thích của cả hai. Và tất nhiên, Ngọc đã nói Đồng Ý!"
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
