import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { PiTicketFill } from "react-icons/pi";
import { useTranslations } from 'next-intl';
export default function DisplayEvents() {
    const t = useTranslations('Dashboard.displayEvents');
    return (
        <div className='min-h-screen py-8 w-[85%] mx-auto flex flex-col  gap-6'>
            <h1 className='capitalize font-bold text-4xl  text-foreground'>{t('title')}</h1>
            <div className=" w-full bg-white rounded-xl shadow-lg border border-indigo-200/50 p-4 sm:p-6 transition-all duration-300">
                <div className="grid grid-cols-6 justify-center items-center   gap-4 sm:gap-6">


                    <div className="shrink-0 col-span-1   overflow-hidden rounded-lg">
                        <img
                            src="https://placehold.co/192x192/4f46e5/ffffff?text=Music+Festival"
                            alt="Crowd gathered at a music festival stage at sunset"
                            className="w-full h-full object-cover transition duration-500 ease-in-out hover:scale-105"

                        />
                    </div>

                    <div className=" col-span-2 space-y-3 pt-1">
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">Summer Music Festival 2025</h2>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-md text-gray-600">
                            <div className="flex items-center">
                                <FaLocationDot className="w-4 mr-2 items-baseline text-red-600" />

                                <span>Colombo City Arena</span>
                            </div>
                            <div className="flex items-center">
                                <FaCalendar className="w-4 mr-2 items-baseline text-green-600" />

                                <span>August 30, 2025</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-md text-gray-600">
                            <div className="flex items-center">
                                <MdAccessTime className="w-4 mr-2 items-baseline text-blue-600" />
                                <span>4:00 PM – 11:00 PM</span>
                            </div>
                            <div className="flex items-center">
                                <BsFillPeopleFill className="w-4 mr-2 items-baseline text-gray-600" />
                                <span>1,250 attendees</span>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 flex flex-col col-span-2 items-start sm:items-end space-y-4 pt-1">


                        <div className="flex items-center space-x-3 w-full sm:w-auto">

                            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center ticket-icon-bg shadow-md">
                                <PiTicketFill className="w-5 h-5" />
                            </div>


                            <div className="text-right grow">
                                <p className="text-lg font-semibold text-gray-900 leading-none">250</p>
                                <p className="text-xs text-gray-500 mt-0.5">{t('ticketLeft')}</p>
                            </div>
                        </div>


                        <div className="w-full sm:w-48">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">

                                <div className="bg-indigo-500 h-2.5 rounded-full w-[80%]" ></div>
                            </div>
                            <p className="text-xs font-medium text-yellow-600 mt-1">{t('sold', { percent: 80 })}</p>
                        </div>


                    </div>
                    <button
                        className="w-full h-fit col-span-1 sm:w-auto px-6 py-2.5 rounded-lg bg-indigo-200 text-indigo-800 font-bold text-lg hover:bg-indigo-300 transition-colors duration-200 shadow-md">
                        Rs. 3500/=
                    </button>

                </div>
            </div>
        </div>
    )
}
