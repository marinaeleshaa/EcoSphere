import BrowseEvents from '@/components/layout/Dashboard/Events/BrowseEvents/BrowseEvents';
import { GetAllEvents } from '@/frontend/actions/Events';
import React from 'react'

export default async function Browse() {
  const data  = await GetAllEvents();
  return (
   <BrowseEvents events={data} />
  )
}
