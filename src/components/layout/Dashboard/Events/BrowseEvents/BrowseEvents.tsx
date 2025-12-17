"use client";
import { EventProps } from "@/types/EventTypes";
import MainDisplayEvents from "@/components/layout/common/events/MainDisplayEvents";

export default function BrowseEvents({ events }: Readonly<EventProps>) {
  
  return (
    <section className="min-h-screen py-8 w-[85%] mx-auto flex flex-col gap-6">
      <h1 className="capitalize font-bold text-4xl text-center  text-foreground">
        Browse Events
      </h1>
      <MainDisplayEvents events={events}/>
    </section>
  );
}
