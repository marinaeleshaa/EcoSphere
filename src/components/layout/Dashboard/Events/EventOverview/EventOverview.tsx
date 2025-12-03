'use client'
import { BackgroundGradient } from '@/components/ui/background-gradient'
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import { MdAddCircleOutline } from "react-icons/md";
import { FaRegRectangleList } from "react-icons/fa6";
import { TbListSearch } from "react-icons/tb";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MapPin } from 'lucide-react';
import React from 'react'

interface MetricData {
  id: number;
  title: string;
  value: string;
  change: string | null;
  timeframe: string | null;
  color: string;
}
interface EventData {
  id: number;
  title: string;
  date: string;
  displayDate: string; // The human-readable date for display
  location: string;
  imageUrl: string;
  time: string;
}

const dashboardData: MetricData[] = [
  {
    id: 1,
    title: "Total Ticket Sales",
    value: "1,245",
    change: "+12%",
    timeframe: "from last week",
    color: 'text-green-600',
  },
  {
    id: 2,
    title: "Total Revenue",
    value: "$45,200",
    change: "+8%",
    timeframe: null,
    color: 'text-green-600',
  },
  {
    id: 3,
    title: "Confirmed Attendees",
    value: "890",
    change: "+5%",
    timeframe: null,
    color: 'text-green-600',
  },
  {
    id: 4,
    title: "Active Events",
    value: "4",
    change: null,
    timeframe: null,
    color: 'text-gray-500',
  },
];
const eventData: EventData[] = [
  {
    id: 1,
    title: "Summer Music Festival",
    date: "2026-07-20", // Next year to ensure they are in the future
    displayDate: "July 20-22, 2026",
    location: "Central Park, NY",
    imageUrl: "https://placehold.co/80x80/22c55e/ffffff?text=Music",
    time: "10:00 AM - 11:00 PM",
  },
  {
    id: 2,
    title: "Tech Summit 2024",
    date: "2025-08-15",
    displayDate: "August 15, 2025",
    location: "Convention Center, SF",
    imageUrl: "https://placehold.co/80x80/22c55e/ffffff?text=Tech",
    time: "9:00 AM",
  },
  {
    id: 3,
    title: "Local Food Fair",
    date: "2025-09-05",
    displayDate: "September 5, 2025",
    location: "City Plaza, Chicago",
    imageUrl: "https://placehold.co/80x80/22c55e/ffffff?text=Food",
    time: "4:00 PM - 8:00 PM",
  },
  {
    id: 4,
    title: "Winter Tech Meetup",
    date: "2025-12-01",
    displayDate: "December 1, 2025",
    location: "Online",
    imageUrl: "https://placehold.co/80x80/22c55e/ffffff?text=Web",
    time: "7:00 PM PST",
  },
  {
    id: 5,
    title: "Spring Art Exhibition", // Event further out
    date: "2026-04-10",
    displayDate: "April 10, 2026",
    location: "Art Museum, LA",
    imageUrl: "https://placehold.co/80x80/22c55e/ffffff?text=Art",
    time: "6:30 PM",
  },
  {
    id: 6,
    title: "Annual Charity Gala", // Event furthest out
    date: "2026-10-25",
    displayDate: "October 25, 2026",
    location: "Grand Ballroom, Miami",
    imageUrl: "https://placehold.co/80x80/22c55e/ffffff?text=Gala",
    time: "8:00 PM",
  },
  // Added an old event to show filtering works
  {
    id: 7,
    title: "Past Hackathon",
    date: "2024-01-01",
    displayDate: "January 1, 2024",
    location: "Past Venue",
    imageUrl: "https://placehold.co/80x80/e5e7eb/4b5563?text=Past",
    time: "All Day",
  },
];

const MetricCard: React.FC<MetricData> = ({ title, value, change, timeframe, color }) => {
  const isPositive = change && change.startsWith('+');

  // Determine the trend icon based on the change value
  // We use TrendingUp as the default for the icon, but it's hidden on small screens
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className='flex flex-col justify-center h-full gap-2 px-3 '>
      {/* Title */}
      <p className="text-foreground text-sm font-medium mb-1">{title}</p>

      {/* Value and Change */}
      <div className="flex items-start justify-between">
        <h2 className="text-3xl font-bold text-foreground leading-none">
          {value}
        </h2>

        {/* Change Indicator (only for cards that have a 'change' value) */}
        {change && (
          <div className="flex items-center ml-2 space-x-1">
            {/* Icon is green for positive trend, red for negative */}
            <Icon className={`w-5 h-5 ${isPositive ? 'text-accent-foreground' : 'text-red-500'} hidden sm:block`} />
            <span className={`text-sm text-accent-foreground font-semibold ${color} pt-1`}>
              {change}
            </span>
          </div>
        )}
      </div>

      {/* Subtext (for the first card only) */}
      {timeframe && (
        <p className="text-xs font-medium mt-1">
          {change}{timeframe ? ` ${timeframe}` : ''}
        </p>
      )}
    </div>
  );
};
const EventListItem: React.FC<EventData> = ({ title, displayDate, time, location, imageUrl }) => {
  const buttonText = 'Manage';
  const lineColor = 'bg-primary';

  return (
    <div className="
      flex items-center p-2 pr-6 bg-white rounded-xl shadow-md border-2 border-gray-100
      transition duration-200 hover:shadow-lg hover:border-primary
    ">

      {/* 1. Leading Color Line */}
      <div className={`w-1.5 h-16 rounded-full mr-4 ${lineColor} self-center shrink-0`}></div>

      {/* 2. Event Image */}
      <img
        src={imageUrl}
        alt={`Image for ${title}`}
        className="w-14 h-14 object-cover rounded-md mr-4 shrink-0"

      />

      {/* 3. Main Content Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-4">

        {/* Title, Date, and Time */}
        <div className="flex flex-col col-span-1">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <p className='flex items-center text-gray-600'>
          <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
          <span>{location}</span>
          </p>
        </div>

        {/* Location */}
        <div className="flex justify-center items-center flex-col text-sm col-span-1">
          <p className="text-sm text-gray-500 font-medium">{displayDate}</p>
          {/* Displaying the Time */}
          <p className="text-sm text-grey-600 font-semibold">{time}</p>
        </div>

        {/* Placeholder column */}
        <div className="hidden lg:block col-span-1">
          {/* Empty */}
        </div>
      </div>

      {/* 4. Action Button */}
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
    </div>
  );
};
export default function EventOverview() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Filter, Sort, and Limit the events
  const sortedAndLimitedEvents = eventData
    .filter(event => {
      // Filter out past events. Parse YYYY-MM-DD string into Date object.
      const eventDate = new Date(event.date);
      return eventDate >= today;
    })
    .sort((a, b) => {
      // Sort by date from nearest (earlier) to furthest (later)
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    })
    .slice(0, 3);
  return (
    <div className='min-h-screen py-6 w-[85%] mx-auto flex flex-col gap-6'>
      <h1 className='capitalize font-bold text-4xl  text-foreground'>Dashboard Overiew</h1>
      <div className='flex flex-col gap-2'>
        <h2 className='capitalize font-bold text-2xl mb-2 text-foreground'> Quick Actions</h2>
        <div className='grid grid-cols-3 gap-5 '>
          <Link href='/add' className='col-span-1 '>
            <Button className='w-full py-6 text-xl text-primary-foreground rounded-2xl'>
              <MdAddCircleOutline className='size-6' />
              <span className='capitalize'>
                Create new Event
              </span>
            </Button>
          </Link>
          <Link href='/viewDetails' className='col-span-1 '>
            <Button className='w-full py-6 text-xl text-primary-foreground rounded-2xl'>
              <FaRegRectangleList className='size-6' />
              <span className='capitalize'>
                View all events
              </span>
            </Button>
          </Link>
          <Link href='/browse' className='col-span-1 '>
            <Button className='w-full py-6 text-xl text-primary-foreground rounded-2xl'>
              <TbListSearch className='size-6' />
              <span className='capitalize'>
                Browse Events
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between'>
          <h2 className='capitalize font-bold text-2xl mb-2 text-foreground'>Key Matrics</h2>
          <h4 className='text-gray-400 text-md'>Real-time data</h4>
        </div>
        <div className='grid grid-cols-4 gap-5 '>
          {dashboardData.map((data) => (
            <BackgroundGradient key={data.id} className='col-span-1 rounded-4xl  p-2 h-full   text-foreground bg-background' >
              <MetricCard
                id={data.id}
                title={data.title}
                value={data.value}
                change={data.change}
                timeframe={data.timeframe}
                color={data.color}
              />
            </BackgroundGradient>
          ))}

        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {/* <div className='grid grid-cols-3 gap-5 '> */}
          {/* <div className='col-span-2 gap-3'> */}
            <div className=' flex justify-between'>
              <h2 className='capitalize font-bold text-2xl mb-2 text-foreground'>upcoming events</h2>
              <h4 className='text-gray-400 text-md'>view all</h4>
            </div>
            <div className='flex flex-col gap-2'>

              {sortedAndLimitedEvents.length > 0 ? (
                sortedAndLimitedEvents.map((event) => (
                  <EventListItem
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    // Pass displayDate and time for the UI
                    displayDate={event.displayDate}
                    time={event.time}
                    location={event.location}
                    imageUrl={event.imageUrl}
                    date={event.date} // Keeping date for interface satisfaction, though not directly rendered
                  />
                ))
              ) : (
                <div className="text-center p-8 bg-white rounded-xl shadow-md text-gray-500">
                  No upcoming events found.
                </div>
              )}

            </div>

            


          {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  )
}
