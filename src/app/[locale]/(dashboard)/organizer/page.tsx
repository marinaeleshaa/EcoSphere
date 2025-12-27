import EventOverview from "@/components/layout/Dashboard/Events/EventOverview/EventOverview";
import { GetAllUserEvents } from "@/frontend/actions/Events";

export default async function Overview() {
  const data = await GetAllUserEvents();
  return <EventOverview events={data} />;
}
