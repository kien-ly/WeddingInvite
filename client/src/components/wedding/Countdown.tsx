import { useState, useEffect } from "react";
import { WEDDING_DATE } from "@/lib/utils";

type CountdownValues = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<CountdownValues>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Function to calculate time left
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();
      
      // If wedding date has passed, show zeros
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return {
        days,
        hours,
        minutes,
        seconds,
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Setup interval to update countdown
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Clear interval on unmount
    return () => clearInterval(timer);
  }, []);

  // Array of countdown units for mapping
  const countdownUnits = [
    { value: timeLeft.days, label: "Ngày" },
    { value: timeLeft.hours, label: "Giờ" },
    { value: timeLeft.minutes, label: "Phút" },
    { value: timeLeft.seconds, label: "Giây" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-['Dancing_Script'] text-3xl md:text-4xl text-primary mb-4">
            Đếm ngược đến ngày cưới
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {countdownUnits.map((unit, index) => (
              <div key={unit.label} className="countdown-item text-center px-4 relative">
                <div className="text-3xl md:text-5xl font-['Playfair_Display'] font-bold text-neutral-800">
                  {unit.value}
                </div>
                <div className="text-sm md:text-base text-primary uppercase tracking-wider">
                  {unit.label}
                </div>
                {index < countdownUnits.length - 1 && (
                  <span className="absolute -right-1 top-1/3 text-2xl text-primary">:</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
