import { EventProps } from "@/types/EventTypes";
import MainDisplayEvents from "@/components/layout/common/events/MainDisplayEvents";
import { useTranslations } from "next-intl";
export default function BrowseEvents({ events }: Readonly<EventProps>) {
  const t = useTranslations("Events.MainDisplayEvents");
  return (
    <section className="min-h-screen py-8 w-[80%] mx-auto flex flex-col gap-6">
      <h1 className="capitalize font-bold text-4xl text-center  text-foreground">
        {t("title")}
      </h1>
      <MainDisplayEvents events={events}/>
    </section>
  );
}
