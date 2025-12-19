import React from "react";
import { GetAllEvents } from "@/frontend/actions/Events";
import EventClient from "@/components/layout/Events/EventClient";
export default async function Events() {
  const data = await GetAllEvents();
  return (
      <EventClient events={data} />
  );
}
