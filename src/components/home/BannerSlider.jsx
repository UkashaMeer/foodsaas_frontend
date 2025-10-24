"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerSlider({
  slides = [],
  autoplay = true,
  interval = 5000,
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  // autoplay
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(timerRef.current);
  }, [autoplay, interval, slides.length]);

  const handleMouseEnter = () => clearInterval(timerRef.current);
  const handleMouseLeave = () => {
    if (!autoplay || slides.length <= 1) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
  };

  // swipe
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const onTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (delta > threshold) next();
    else if (delta < -threshold) prev();
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section
      className="w-full relative overflow-hidden bg-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="w-full flex-shrink-0 flex justify-center bg-black"
          >
            <img
              src={s.src}
              alt={s.alt || `slide-${i}`}
              className="w-full h-auto max-h-[600px] object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-r-lg"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        aria-label="Next"
        className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-l-lg"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
