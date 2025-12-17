import React from "react";
import MainDisplayEvents from "@/components/layout/common/events/MainDisplayEvents";
import HeroSection from "@/components/layout/common/HeroSection";
import { GetAllEvents } from "@/frontend/actions/Events";
import WhyEcosphere from "@/components/layout/Events/WhyEcosphere";

export default async function Events() {
  const data = await GetAllEvents();
  return (
    <div>
      <HeroSection
        imgUrl="/events/hero.png"
        title="Never Miss an Event in Ecosphere"
        subTitle="Explore upcoming events across the Ecosphere platform, get all the details you need, and take part in experiences that bring the community together"
      />
      <div className="min-h-screen py-8 w-[85%] mx-auto flex flex-col gap-6">
        <WhyEcosphere />
        <MainDisplayEvents events={data} />
      </div>
    </div>
  );
}
