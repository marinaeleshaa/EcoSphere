import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { PiTicketFill } from "react-icons/pi";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { EventProps, ISubEvent } from "@/types/EventTypes";

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
export default function DisplayEvents({ events }: EventProps) {
  console.log(events);

  const t = useTranslations("Dashboard.displayEvents");
  return (
    <div className="min-h-screen py-8 w-[85%] mx-auto flex flex-col gap-6">
      <h1 className="capitalize font-bold text-4xl  text-foreground">
        {t("title")}
      </h1>
      {events.map((event) => (
        <div
          key={event._id}
          className=" my-4 border-2 border-primary shadow-xl rounded-xl overflow-hidden transform hover:scale-[1.01] transition duration-300"
        >
          <div className="p-6 sm:p-8">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div>
                <h2 className="text-3xl font-extrabold ">
                  {event.name}
                </h2>
                <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                  {event.type}
                </p>
              </div>
              {/* Avatar/Image placeholder */}
              
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500 overflow-hidden">
                    <Image
                        src={event.avatar || '/events/defaultImgEvent.png'}
                      alt={`${event.name} avatar`}
                      className="w-full h-full object-cover"
                      width={150}
                      height={100}
                    />
                  
                </div>
             
            </div>

            {/* Date, Time, and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="font-semibold">{formatDate(event.eventDate)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p>
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <p>{event.locate}</p>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Details
                </h3>
                <p className="text-gray-700">{event.description}</p>
              </div>
            )}

            {/* Pricing and Capacity */}
            <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-gray-500">Ticket Type</p>
                <p
                  className={`text-lg font-bold ${
                    event.ticketPrice === 0
                      ? "text-gray-800"
                      : "text-foreground"
                  }`}
                >
                  {event.ticketPrice === 0 ? "Free" : "Priced"}
                </p>
              </div>
              {event.ticketPrice !== 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="text-lg font-bold">
                    ${event.ticketPrice.toFixed(2)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Capacity</p>
                <p className="text-lg font-bold ">
                  {event.capacity} people
                </p>
              </div>
            </div>

            {/* Sub-Events/Sections */}
            {event.sections && event.sections.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 border-t pt-4">
                  Schedule
                </h3>
                <div className="space-y-4">
                  {event?.sections?.map((section: ISubEvent, index: number) => (
                    <div
                      key={index}
                      className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50/50"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-gray-800">
                          {section.title}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">
                          {formatTime(section.startTime)} -{" "}
                          {formatTime(section.endTime)}
                        </p>
                      </div>
                      {section.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {section.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t">
              <button
                // onClick={() => onEdit(event)}
                className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150"
              >
                ✏️ Edit Event
              </button>
              <button
                // onClick={() => onDelete(_id)}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150"
              >
                🗑️ Delete Event
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
