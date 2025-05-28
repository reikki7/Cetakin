import { useState, useEffect } from "react";
import heroImage1 from "../assets/HeroImage1.png";
import heroImage2 from "../assets/HeroImage2.png";
import heroImage3 from "../assets/HeroImage3.png";

const slides = [
  {
    image: heroImage1,
    title: (
      <>
        Desain Dengan
        <br />
        <span className="text-[#2F3E34]">Gaya</span>
      </>
    ),
    description:
      "Ciptakan produk khusus yang menakjubkan dengan layanan pencetakan dan desain premium kami.",
    button: {
      text: "Belanja Sekarang",
      action: () => console.log("Belanja Sekarang"),
    },
  },
  {
    image: heroImage2,
    title: (
      <>
        Kreasi Tanpa
        <br />
        <span className="text-[#2F3E34]">Batas</span>
      </>
    ),
    description:
      "Wujudkan ide kreatif Anda menjadi produk kerajinan unik dan aksesori kustom yang memukau dengan kualitas terbaik.",
    button: {
      text: "Mulai Berkreasi",
      action: () => console.log("Mulai Berkreasi"),
    },
  },
  {
    image: heroImage3,
    title: (
      <>
        Cetak Dengan
        <br />
        <span className="text-[#2F3E34]">Presisi</span>
      </>
    ),
    description:
      "Layanan pencetakan digital berkualitas tinggi untuk segala kebutuhan bisnis dan personal Anda dengan hasil yang sempurna.",
    button: {
      text: "Cetak Sekarang",
      action: () => console.log("Cetak Sekarang"),
    },
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden h-[20rem] sm:h-[25rem] md:h-[30rem]">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative w-full flex-shrink-0 h-full">
            {/* Background Color */}
            <div className="absolute inset-0 bg-[#8DA291]">
              <div
                className="absolute inset-0 bg-[#8DA291]"
                style={{
                  clipPath: "polygon(0 0, 70% 0, 50% 100%, 0 100%)",
                  "@media (minWidth: 768px)": {
                    clipPath: "polygon(0 0, 60% 0, 40% 100%, 0 100%)",
                  },
                }}
              ></div>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  clipPath: "polygon(50% 0, 100% 0, 100% 100%, 70% 100%)",
                  "@media (minWidth: 768px)": {
                    clipPath: "polygon(40% 0, 100% 0, 100% 100%, 60% 100%)",
                  },
                }}
              >
                {/* Dark Overlay for Mobile */}
                <div className="absolute inset-0 bg-black/40 sm:bg-transparent"></div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center h-full px-4 sm:px-8 lg:px-16">
              <div className="max-w-[280px] sm:max-w-sm md:max-w-md text-white">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-90 line-clamp-3 sm:line-clamp-none">
                  {slide.description}
                </p>
                <button
                  onClick={slide.button.action}
                  className="bg-white text-[#2F3E34] px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base font-semibold hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                >
                  {slide.button.text}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 ${
              idx === current ? "bg-white" : "bg-gray-400/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
