import UpcomingEvents from "@/components/layout/Dashboard/Events/UpComingEvents/UpcomingEvents";
import { GetAllUserEvents } from "@/frontend/actions/Events";
import React from "react";

export default async function upcomingEvents() {
  const data = await GetAllUserEvents();
  return <UpcomingEvents events={data} />;
}