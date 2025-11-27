'use client'
import { BackgroundGradient } from '@/components/ui/background-gradient'
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import React from 'react'
import { MdAddCircleOutline } from "react-icons/md";
import { FaRegRectangleList } from "react-icons/fa6";
import { TbListSearch } from "react-icons/tb";
export default function Overview() {
  return (
    <div className='min-h-screen py-8 w-[95%] mx-auto flex flex-col gap-6'>
      <h1 className='capitalize font-bold text-4xl  text-foreground'>Dashboard Overiew</h1>
      <div className='flex flex-col gap-2'>
        <h2 className='capitalize font-bold text-2xl mb-2 text-foreground'> Quick Actions</h2>
        <div className='grid grid-cols-3 gap-5 '>
          <Link href='' className='col-span-1 '>
            <Button className='w-full py-6 text-xl text-primary-foreground rounded-2xl'>
              <MdAddCircleOutline className='size-6' />
              <span className='capitalize'>
                Create new Event
              </span>
            </Button>
          </Link>
          <Link href='' className='col-span-1 '>
            <Button className='w-full py-6 text-xl text-primary-foreground rounded-2xl'>
              <FaRegRectangleList className='size-6' />
              <span className='capitalize'>
                View all events
              </span>
            </Button>
          </Link>
          <Link href='' className='col-span-1 '>
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
        <h2 className='capitalize font-bold text-2xl mb-2 text-foreground'>Key Matrics</h2>
        <div className='grid grid-cols-4 gap-5 '>
          <BackgroundGradient className='col-span-1 rounded-4xl  p-4 sm:p-10  bg-background' >

            <p className="text-sm ">
              The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
              February 17, 2024. Your best opportunity to get these right now is by
              entering raffles and waiting for the official releases.
            </p>

          </BackgroundGradient>
          <BackgroundGradient className='col-span-1 rounded-4xl  p-4 sm:p-10 bg-background' >

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
              February 17, 2024. Your best opportunity to get these right now is by
              entering raffles and waiting for the official releases.
            </p>

          </BackgroundGradient>
          <BackgroundGradient className='col-span-1 rounded-4xl  p-4 sm:p-10 bg-background' >

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
              February 17, 2024. Your best opportunity to get these right now is by
              entering raffles and waiting for the official releases.
            </p>

          </BackgroundGradient>
          <BackgroundGradient className='col-span-1 rounded-4xl  p-4 sm:p-10 bg-background' >

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
              February 17, 2024. Your best opportunity to get these right now is by
              entering raffles and waiting for the official releases.
            </p>

          </BackgroundGradient>



        </div>

      </div>
    </div>
  )
}
