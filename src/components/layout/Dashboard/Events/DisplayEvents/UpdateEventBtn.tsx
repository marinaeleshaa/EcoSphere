'use client'
import React from 'react'
import { Button } from '@/components/ui/button';
import { FiEdit } from "react-icons/fi";
import { EventResponse } from '@/backend/features/event/events.types';
export default function UpdateEventBtn({ event }: { event:EventResponse}) {
    async function onEdit(e: EventResponse) {
        console.log(e);
    }
  return (
      <Button
          onClick={() => onEdit(event)}
          className="p-3 text-primary-foreground bg-primary rounded-full hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150"
          title="Edit Event"
      >
          <FiEdit className=" size-4 items-baseline " />
      </Button>
  )
}
