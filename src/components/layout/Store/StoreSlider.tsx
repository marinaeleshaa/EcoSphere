"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import BasicAnimatedWrapper from "../common/BasicAnimatedWrapper";

const StoreSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const stores = [
    { src: "/store img/1.jpg", name: "Green Market" },
    { src: "/store img/2.jpg", name: "Eco Shop" },
    { src: "/store img/3.jpg", name: "Nature Store" },
    { src: "/store img/4.jpg", name: "Earth Goods" },
    { src: "/store img/5.jpg", name: "Bio Corner" },
    { src: "/store img/6.jpg", name: "Fresh Hub" },
    { src: "/store img/7.jpg", name: "Pure Life" },
    { src: "/store img/8.jpg", name: "Organic Bay" },
    { src: "/store img/9.jpg", name: "Green Zone" },
    { src: "/store img/10.jpg", name: "Eco Mart" },
    { src: "/store img/11.jpg", name: "Natural Way" },
    { src: "/store img/12.jpg", name: "Earth Store" },
    { src: "/store img/13.jpg", name: "Bio Market" },
    { src: "/store img/14.jpg", name: "Fresh Point" },
    { src: "/store img/15.jpg", name: "Pure Shop" },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <section className="py-16  relative">
        {/* Decorative elements */}
        <div className="dark:hidden absolute top-0 left-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="dark:hidden absolute bottom-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <BasicAnimatedWrapper className="mb-12 text-center">
              <h2 className="text-4xl lg:text-4xl font-semibold text-foreground mb-3">
                Our Partner Stores
              </h2>
              <div className="w-24 h-1.5 bg-primary mx-auto rounded-full"></div>
            </BasicAnimatedWrapper>

            {/* Slider Container */}
            <BasicAnimatedWrapper className="relative">
              <div className="overflow-hidden rounded-2xl relative">
                {/* Scrollable Container */}
                <div
                  ref={scrollRef}
                  className="overflow-x-auto scroll-smooth pb-6"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className="flex gap-6 py-5  overflow-y-hidden">
                    {stores.map((store, index) => (
                      <BasicAnimatedWrapper
                        key={index}
                        whileHover={{ y: -10, scale: 1.05 }}
                        className="shrink-0 w-[170px] h-[170px] relative group/card cursor-pointer"
                      >
                        {/* Card Container */}
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md group-hover/card:shadow-2xl transition-all duration-300">
                          {/* Image */}
                          <Image
                            width={50}
                            height={50}
                            src={store.src}
                            alt={store.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                          />

                          {/* linear Overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-primary/70 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                          {/* Store Name */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300">
                            <p className="text-white dark:text-primary-foreground font-semibold text-sm text-center drop-shadow-lg">
                              {store.name}
                            </p>
                          </div>

                          {/* Decorative Corner */}
                          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 -z-10"></div>
                      </BasicAnimatedWrapper>
                    ))}
                  </div>
                </div>

                {/* linear Overlays - Only on XL screens */}
                <div className="hidden xl:block absolute left-0 top-0 bottom-6 w-20 bg-linear-to-r from-primary/30 to-transparent pointer-events-none z-10"></div>
                <div className="hidden xl:block absolute right-0 top-0 bottom-6 w-20 bg-linear-to-l from-primary/30 to-transparent pointer-events-none z-10"></div>

                {/* Navigation Arrows - Inside overflow container */}
                <button
                  onClick={() => scroll("left")}
                  className="hidden xl:flex absolute top-1/2 -translate-y-1/2 left-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white transform hover:scale-110"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => scroll("right")}
                  className="hidden xl:flex absolute top-1/2 -translate-y-1/2 right-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white transform hover:scale-110"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </BasicAnimatedWrapper>

            {/* Bottom Indicator */}
            <BasicAnimatedWrapper className="mt-8 text-center">
              <p className="text-stone-500 text-sm flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                {""}
                Scroll to explore more stores
              </p>
            </BasicAnimatedWrapper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoreSlider;
