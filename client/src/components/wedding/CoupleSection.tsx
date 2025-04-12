import { WEDDING_INFO } from "@/lib/utils";
import { 
  FacebookIcon, 
  InstagramIcon 
} from "lucide-react";

export default function CoupleSection() {
  return (
    <section id="couple" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-neutral-800 mb-4">
            Câu Chuyện Tình Yêu
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-neutral-700">
            Chúng tôi rất vui mừng được đón chào bạn trong ngày trọng đại này. Hành trình của chúng tôi đã trải qua nhiều kỷ niệm tuyệt vời, và giờ đây chúng tôi háo hức bắt đầu chương mới của cuộc đời.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Bride */}
          <div className="text-center">
            <div className="mb-6 w-64 h-64 rounded-full overflow-hidden mx-auto border-4 border-primary shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Cô dâu" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-['Dancing_Script'] text-3xl text-primary mb-2">
              {WEDDING_INFO.couple.brideFirstName}
            </h3>
            <p className="text-neutral-700 max-w-xs mx-auto">
              {WEDDING_INFO.couple.brideDescription}
            </p>
            <div className="flex justify-center mt-4 space-x-3">
              <a href="#" className="text-primary/80 hover:text-primary transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary/80 hover:text-primary transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="text-5xl font-['Dancing_Script'] text-primary">&</div>
          
          {/* Groom */}
          <div className="text-center">
            <div className="mb-6 w-64 h-64 rounded-full overflow-hidden mx-auto border-4 border-primary shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Chú rể" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-['Dancing_Script'] text-3xl text-primary mb-2">
              {WEDDING_INFO.couple.groomFirstName}
            </h3>
            <p className="text-neutral-700 max-w-xs mx-auto">
              {WEDDING_INFO.couple.groomDescription}
            </p>
            <div className="flex justify-center mt-4 space-x-3">
              <a href="#" className="text-primary/80 hover:text-primary transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary/80 hover:text-primary transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h3 className="font-['Playfair_Display'] text-2xl text-neutral-800 mb-6">
            Chúng Tôi Đã Gặp Nhau
          </h3>
          <p className="text-neutral-700 mb-6">
            {WEDDING_INFO.story.meetingStory}
          </p>
          <p className="text-neutral-700">
            {WEDDING_INFO.story.proposalStory}
          </p>
        </div>
      </div>
    </section>
  );
}
