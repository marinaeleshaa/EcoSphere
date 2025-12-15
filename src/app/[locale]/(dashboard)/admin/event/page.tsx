import EventCard from "@/components/layout/Dashboard/Admin/Event/EventCard";
import EventHero from "@/components/layout/Dashboard/Admin/Event/EventHero";

const page = () => {
  return (
    <div>
      <EventHero />
      <div className="w-[80%] mx-auto py-10">
        <EventCard />
      </div>
    </div>
  );
};

export default page;
