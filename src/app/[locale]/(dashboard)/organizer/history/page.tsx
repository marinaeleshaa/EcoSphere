import EventsHistory from "@/components/layout/Dashboard/Events/EventsHistory/EventsHistory";
import { GetAllUserEvents } from "@/frontend/actions/Events";
import React from "react";

export default async function history() {
  const data = await GetAllUserEvents();
  return <EventsHistory events={data} />;
}