import ManageEvent from '@/components/layout/Dashboard/Events/ManageEvent/ManageEvent';
import { GetEventById } from '@/frontend/actions/Events';
import { formatDateForInput, serializeEvent } from '@/frontend/utils/Event';
import React from 'react'

export default async function page({ params }: { params: { id: string } }) {
    const {id}=await params;    
    const rawEvent = await GetEventById(id);
    const event = serializeEvent(rawEvent);
    const initialData = {
        ...event,
        eventDate: formatDateForInput(event.eventDate),
    };
  return (
      <ManageEvent initialData={initialData}/>
  )
}
