'use client'
import { BackgroundGradient } from '@/components/ui/background-gradient'
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { MdAddCircleOutline } from "react-icons/md";
import { FaRegRectangleList } from "react-icons/fa6";
import { TbListSearch } from "react-icons/tb";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { EventListItemProps, EventProps, IEventDetails, MetricData } from '@/types/EventTypes';
import React from 'react';
import { useSession } from 'next-auth/react';

const formatTime = (time: string): string => {
  try {
    // Assuming time is in "HH:MM" format (24-hour)
    const [hours, minutes] = time.split(":");
    const date = new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return time; // Return original if formatting fails
  }
};
// Function to format the date
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

const dashboardData: MetricData[] = [
  {
    id: 1,
    title: "Total Ticket Sales",
    value: "1,245",
    change: "+12%",
  },
  {
    id: 2,
    title: "Total Revenue",
    value: "$45,200",
    change: "+8%",
  },
  {
    id: 3,
    title: "Confirmed Attendees",
    value: "890",
    change: "+5%",
  },
  {
    id: 4,
    title: "Active Events",
    value: "4",
    change: null,
  },
];

const MetricCard: React.FC<MetricData> = ({ title, value, change}) => {
  const isPositive = change && change.startsWith('+');

  // Determine the trend icon based on the change value
  // We use TrendingUp as the default for the icon, but it's hidden on small screens
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className='flex flex-col justify-center items-center h-full gap-1 p-3 '>
      {/* Title */}
      <p className="text-foreground text-sm font-medium mb-1">{title}</p>

      {/* Value and Change */}
      <div className="flex items-start gap-2 justify-between">
        <h2 className="text-3xl font-bold text-foreground leading-none">
          {value}
        </h2>

        {/* Change Indicator (only for cards that have a 'change' value) */}
        {change && (
          <div className="flex items-center ml-2 space-x-1">
            {/* Icon is green for positive trend, red for negative */}
            <Icon className={`w-5 h-5 ${isPositive ? 'text-accent-foreground' : 'text-red-500'} hidden sm:block`} />
            <span className={`text-sm text-accent-foreground font-semibold  pt-1`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
const EventListItem: React.FC<EventListItemProps> = ({  name, eventDate, startTime, endTime, locate, avatar }) => {
  const t = useTranslations('Dashboard.overview');
  const buttonText = t('manage');
  const lineColor = 'bg-primary';
  const imageSource = avatar || '/events/defaultImgEvent.png';
  return (
    <div className="
      flex items-center p-2 pr-6  rounded-xl shadow-md border-2 border-gray-100
      transition duration-200 hover:shadow-lg hover:border-primary
    ">

      {/* 1. Leading Color Line */}
      <div className={`w-1.5 h-16 rounded-full mr-4 ${lineColor} self-center shrink-0`}></div>

      {/* 2. Event Image */}
      <Image
        src={imageSource}
        alt={`Image for ${name}`}
        className="w-14 h-14 object-cover rounded-md mr-4 shrink-0"
        width={100}
        height={100}
      />

      {/* 3. Main Content Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4">

        {/* Title, Date, and Time */}
        <div className="flex flex-col col-span-1">
          <h3 className="text-base font-semibold ">{name}</h3>
          <p className='flex items-center text-gray-600'>
            <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
            <span>{locate}</span>
          </p>
        </div>

        {/* Location */}
        <div className="flex justify-center items-center flex-col text-sm col-span-1">
          <p className="text-sm text-gray-500 font-medium">{formatDate(eventDate)}</p>
          {/* Displaying the Time */}
          <p className="text-sm text-grey-600 font-semibold">{formatTime(startTime)} - {formatTime(endTime)}</p>
        </div>

        {/* Placeholder column */}
        <div className="hidden lg:block col-span-1">
          {/* Empty */}
        </div>
      </div>

      {/* 4. Action Button */}
      <Link href='/organizer/manage'>
      <button className="
        ml-4 px-4 py-2 text-sm font-medium
        border border-primary rounded-lg
        text-foreground
        hover:bg-primary hover:border-gray-400 hover:text-primary-foreground
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        whitespace-nowrap
        shrink-0
      ">
        {buttonText}
      </button>
      </Link>
    </div>
  );
};
export default function EventOverview({ events }: EventProps) {

  const t = useTranslations('Dashboard.overview');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Filter, Sort, and Limit the events
  const sortedAndLimitedEvents = events?.filter(event => {
      // Filter out past events. Parse YYYY-MM-DD string into Date object.
      const eventDate = new Date(event.eventDate);
      return eventDate >= today;
    })
    .sort((a, b) => {
      // Sort by date from nearest (earlier) to furthest (later)
      const dateA = new Date(a.eventDate).getTime();
      const dateB = new Date(b.eventDate).getTime();
      return dateA - dateB;
    })
    .slice(0, 3);
  return (
    <div className='min-h-screen py-6 w-[90%] mx-auto flex flex-col gap-6'>
      <h1 className='capitalize font-bold text-4xl  text-foreground'>{t('title')}</h1>
      <div className='flex flex-col gap-2'>
        <h2 className='capitalize font-bold text-2xl mb-2 text-foreground'>{t('quickActions')}</h2>
        <div className='grid grid-cols-3 gap-5 '>
          <Link href='/organizer/manage' className='col-span-1 '>
            <Button className='w-full py-6 text-xl text-primary-foreground rounded-2xl'>
              <MdAddCircleOutline className='size-6' />
              <span className='capitalize'>
                {t('createNewEvent')}
              </span>
            </Button>
          </Link>
          <Link href='/organizer/details' className='col-span-1 '>
            <Button className='w-full py-6 text-xl text-primary-foreground rounded-2xl'>
              <FaRegRectangleList className='size-6' />
              <span className='capitalize'>
                {t('viewAllEvents')}
              </span>
            </Button>
          </Link>
          <Link href='/organizer/browse' className='col-span-1 '>
            <Button className='w-full py-6 text-xl text-primary-foreground rounded-2xl'>
              <TbListSearch className='size-6' />
              <span className='capitalize'>
                {t('browseEvents')}
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <h2 className='capitalize font-bold text-2xl mb-2 text-foreground'>{t('keyMetrics')}</h2>
          <h4 className='text-gray-400 text-md'>{t('realTimeData')}</h4>
        </div>
        <div className='grid grid-cols-4 gap-10 '>
          {dashboardData.map((data) => (
            <BackgroundGradient key={data.id} className='col-span-1 rounded-4xl  p-2 h-full   text-foreground bg-background' >
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
      <div className='flex flex-col gap-2'>
        <div className=' flex justify-between'>
          <h2 className='capitalize font-bold text-2xl mb-2 text-foreground'>{t('upcomingEvents')}</h2>
          <h4 className='text-gray-400 text-md'>{t('viewAll')}</h4>
        </div>
        <div className='flex flex-col gap-2'>
          {sortedAndLimitedEvents?.length! > 0 ? (
            sortedAndLimitedEvents!.map((event) => (
              <EventListItem
                key={event._id}
                _id={event._id}
                name={event.name}
                eventDate={event.eventDate}
                startTime={event.startTime}
                endTime={event.endTime}
                locate={event.locate}
                avatar={typeof event.avatar === 'string' ? event.avatar : '/events/defaultImgEvent.png'}
              />
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-md text-gray-500">
              {t('noUpcomingEvents')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
