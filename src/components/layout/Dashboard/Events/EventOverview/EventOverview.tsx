/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdAddCircleOutline } from "react-icons/md";
import { FaRegRectangleList } from "react-icons/fa6";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { EventListItemProps, EventProps, MetricData } from "@/types/EventTypes";
import React, { useState } from "react";
import { formatDate, formatTime } from "@/frontend/utils/Event";
import { useLocale } from "next-intl";
import { LuHistory } from "react-icons/lu";
import BasicAnimatedWrapper from "@/components/layout/common/BasicAnimatedWrapper";
import { TbCalendarEvent } from "react-icons/tb";
import EventListCardSkeleton from "./EventListCardSkeleton";

const getStartDateTime = (event: any) =>
  new Date(`${event.eventDate.split("T")[0]}T${event.startTime ?? "00:00"}`);

const getEndDateTime = (event: any) =>
  new Date(`${event.eventDate.split("T")[0]}T${event.endTime ?? "23:59"}`);

const MetricCard: React.FC<MetricData> = ({ title, value, change }) => {
  const isPositive = change && change.startsWith("+");

  // Determine the trend icon based on the change value
  // We use TrendingUp as the default for the icon, but it's hidden on small screens
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="flex flex-col justify-center items-center h-full gap-1 p-3 ">
      {/* Title */}
      <p className="text-foreground text-sm font-medium mb-1">{title}</p>
      {/* Value and Change */}
      <div className="flex flex-col items-center gap-2 justify-center">
        <h2 className="text-md md:text-xl  font-bold text-foreground leading-none">
          {value}
        </h2>
        {/* Change Indicator (only for cards that have a 'change' value) */}
        {change && (
          <div className="flex items-center ml-2 space-x-1">
            {/* Icon is green for positive trend, red for negative */}
            <Icon
              className={`w-5 h-5 ${isPositive ? "text-accent-foreground" : "text-red-500"
                } hidden sm:block`}
            />
            <span
              className={`text-sm text-accent-foreground font-semibold  pt-1`}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
const EventListItem: React.FC<EventListItemProps> = ({
  _id,
  name,
  eventDate,
  startTime,
  endTime,
  locate,
  avatar,
}) => {
  // const t = useTranslations("Events.overview");
  // const locale = useLocale();
  // const buttonText = t("manage");
  // const lineColor = "bg-primary";
  // const imageSource = (avatar as string) || "/events/defaultImgEvent.png";
  // return (
  //   <div
  //     className="
  //     flex items-center p-2 pr-6  rounded-xl shadow-md border-2 border-muted
  //     transition duration-200 hover:shadow-lg hover:border-primary
  //   "
  //   >
  //     {/* 1. Leading Color Line */}
  //     <div
  //       className={`w-1.5 h-16 rounded-full mr-4 ${lineColor} self-center shrink-0`}
  //     ></div>

  //     {/* 2. Event Image */}
  //     <Image
  //       src={imageSource}
  //       alt={`Image for ${name}`}
  //       className="w-14 h-14 object-cover rounded-md mr-4 ml-2 shrink-0"
  //       width={100}
  //       height={100}
  //     />

  //     {/* 3. Main Content Area */}
  //     <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4">
  //       {/* Title, Date, and Time */}
  //       <div className="flex flex-col col-span-1">
  //         <h3 className="text-base font-semibold ">{name}</h3>
  //         <p className="flex items-center text-gray-600">
  //           <MapPin className="w-4 h-4 mr-1.5 text-muted-foreground" />
  //           <span>{locate}</span>
  //         </p>
  //       </div>

  //       {/* Location */}
  //       <div className=" flex justify-center items-center flex-col text-sm col-span-1">
  //         <p className="text-sm text-gray-500 font-medium">
  //           {formatDate(eventDate, locale)}
  //         </p>
  //         {/* Displaying the Time */}
  //         <p className="text-sm text-grey-600 font-semibold">
  //           {formatTime(startTime, locale)} – {formatTime(endTime, locale)}
  //         </p>
  //       </div>

  //       {/* Placeholder column */}
  //       <div className="hidden lg:block col-span-1">{/* Empty */}</div>
  //     </div>

  //     {/* 4. Action Button */}
  //     <Link href={`/organizer/manage/${_id}`}>
  //       <button
  //         className="
  //       cursor-pointer
  //       ml-4 px-4 py-2 text-sm font-medium
  //       border border-primary rounded-lg
  //       text-foreground
  //       hover:bg-primary hover:border-gray-400 hover:text-primary-foreground
  //       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  //       whitespace-nowrap
  //       shrink-0
  //     "
  //       >
  //         {buttonText}
  //       </button>
  //     </Link>
  //   </div>
  // );
  const t = useTranslations("Events.overview");
  const locale = useLocale();

  const imageSource =
    typeof avatar === "string"
      ? avatar
      : avatar?.url || "/events/defaultImgEvent.png";

  const start = new Date(`${eventDate.split("T")[0]}T${startTime ?? "00:00"}`);
  const end = new Date(`${eventDate.split("T")[0]}T${endTime ?? "23:59"}`);
  const isLive = start <= new Date() && end >= new Date();

  return (
    <div
      className="
      flex flex-col md:flex-row
      md:items-center
      gap-4
      p-3 md:p-4
      rounded-xl
      shadow-md
      border-2 border-muted
      hover:border-primary
      transition
    "
    >
      {/* Left color bar (desktop only) */}
      <div className="hidden md:block w-1.5 h-16 rounded-full bg-primary" />

      {/* Image + main content */}
      <div className="flex gap-4 flex-1 items-start md:items-center">
        <Image
          src={imageSource}
          alt={name}
          width={56}
          height={56}
          className="
          w-14 h-14
          rounded-md
          object-cover
          shrink-0
        "
        />

        {/* Text content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4">
          {/* Name + location */}
          <div className="col-span-1">
            <h3 className="font-semibold flex flex-wrap items-center gap-2">
              {name}
              {isLive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500 text-white">
                  LIVE
                </span>
              )}
            </h3>

            <p className="flex items-center text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 mr-1 shrink-0" />
              {locate}
            </p>
          </div>

         
          {/* Date & time */}
          <div className="text-sm flex flex-col col-span-1 md:items-center">
            <p>{formatDate(eventDate, locale)}</p>
            <p className="font-semibold">
              {formatTime(startTime, locale)} – {formatTime(endTime, locale)}
            </p>
          </div>
          {/* Placeholder column */}
              <div className="hidden lg:block col-span-1">{/* Empty */}</div>
        </div>
      </div>

      {/* Action button */}
      <Link href={`/organizer/manage/${_id}`} className="w-full md:w-auto">
        <button
          className="
          w-full md:w-auto
          mt-3 md:mt-0
          px-4 py-2
          border border-primary
          rounded-lg
          hover:bg-primary
          hover:text-primary-foreground
          transition
        "
        >
          {t("manage")}
        </button>
      </Link>
    </div>
  );

};
export default function EventOverview({ events }: EventProps) {
  const t = useTranslations("Events.overview");
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    if (events) setIsLoading(false);
  }, [events]);

  const totalTicketSales =
    events?.reduce((acc, event) => acc + (event.attenders?.length || 0), 0) ||
    0;
  const totalRevenue =
    events?.reduce(
      (acc, event) =>
        acc + (event.attenders?.length || 0) * (event.ticketPrice || 0),
      0,
    ) || 0;

  const confirmedAttendees = totalTicketSales;
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activeEventsCount =
    events?.filter(
      (event) =>
        event.isAccepted && getEndDateTime(event) >= now
    ).length || 0;

  const dashboardData: MetricData[] = [
    {
      id: 1,
      title: t("totalTicketSales"),
      value: totalTicketSales.toLocaleString(),
      change: null,
    },
    {
      id: 2,
      title: t("totalRevenue"),
      value: `EGP ${totalRevenue.toLocaleString()}`,
      change: null,
    },
    {
      id: 3,
      title: t("confirmedAttendees"),
      value: confirmedAttendees.toLocaleString(),
      change: null,
    },
    {
      id: 4,
      title: t("activeEvents"),
      value: activeEventsCount.toString(),
      change: null,
    },
  ];
  const buttons = [
    {
      id: 1,
      url: "/organizer/manage",
      icon: MdAddCircleOutline,
      title: t("createNewEvent"),
    },
    {
      id: 2,
      url: "/organizer/upcomingEvents",
      icon: FaRegRectangleList,
      title: t("upcomingEvents"),
    },
    {
      id: 3,
      url: "/organizer/history",
      icon: LuHistory,
      title: t("history"),
    },
  ]

  // 2. Filter, Sort, and Limit the events
  const upcomingEvents = events
    ?.filter((e) => e.isAccepted)
    ?.filter((e) => getEndDateTime(e) >= now)
    ?.sort((a, b) => {
      const aStart = getStartDateTime(a).getTime();
      const aEnd = getEndDateTime(a).getTime();
      const bStart = getStartDateTime(b).getTime();
      const bEnd = getEndDateTime(b).getTime();

      const aLive = aStart <= now.getTime() && aEnd >= now.getTime();
      const bLive = bStart <= now.getTime() && bEnd >= now.getTime();

      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;

      return aStart - bStart;
    })
    ?.slice(0, 3);
  return (
    <div className="min-h-screen py-6 w-[85%]  mx-auto flex flex-col gap-6">
      <h1 className="capitalize font-bold text-3xl md:text-4xl text-center   text-foreground">
        {t("title")}
      </h1>
      <div className="flex flex-col gap-2">
        <h2 className="capitalize font-bold text-2xl mb-2  text-foreground">
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
          {buttons.map((btn) => (
            <Link href={btn.url} key={btn.id} className="col-span-1 ">
              <Button className="w-full py-6 text-xl cursor-pointer text-primary-foreground rounded-2xl">
                <btn.icon className="size-6" />
                <span className="capitalize">{btn.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="capitalize font-bold text-2xl mb-2 text-foreground">
            {t("keyMetrics")}
          </h2>
          <h4 className="text-muted-foreground text-md">{t("realTimeData")}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10  w-[80%] mx-auto md:w-full ">
          {dashboardData.map((data) => (
            <BackgroundGradient
              key={data.id}
              className="col-span-1 rounded-4xl  px-2 h-full text-foreground bg-background"
            >
              <MetricCard
                id={data.id}
                title={data.title}
                value={data.value}
                change={data.change}
              />
            </BackgroundGradient>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className=" flex justify-between">
          <h2 className="capitalize font-bold text-2xl mb-2 text-foreground">
            {t("upcomingEvents")}
          </h2>
          <Link href="/organizer/upcomingEvents">
            <h4 className="text-muted-foreground underline text-md">
              {t("viewAll")}
            </h4>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-5 gap-6 items-stretch">
            {Array.from({ length: 6 }).map((_, index) => (
              <BasicAnimatedWrapper key={index} index={index}>
                <EventListCardSkeleton />
              </BasicAnimatedWrapper>
            ))}
          </div>
        ) : (
          upcomingEvents.length! == 0 ? (
            <div className="flex items-center justify-center md:p-20 p-5 bg-primary/10 rounded-xl ">
              <div className="text-center max-w-md px-6">
                <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 ">
                  <TbCalendarEvent className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {t("noUpcomingEvents")}
                </h2>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {upcomingEvents!.map((event, index) => (
                <BasicAnimatedWrapper key={event._id} index={index}>
                  <EventListItem
                    _id={event._id}
                    name={event.name}
                    eventDate={event.eventDate}
                    startTime={event.startTime}
                    endTime={event.endTime}
                    locate={event.locate}
                    avatar={
                      typeof event.avatar?.url === "string"
                        ? event.avatar?.url
                        : "/events/defaultImgEvent.png"
                    }
                  />
                </BasicAnimatedWrapper>
              ))}
            </div>

          ))}

      </div>
    </div>
  );
}
