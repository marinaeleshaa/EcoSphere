import EventOverview from '@/components/layout/Dashboard/Events/EventOverview/EventOverview'
import { GetAllUserEvents } from '@/frontend/actions/Events'
import React from 'react'

export default async function Overview() {
    const  data  = await GetAllUserEvents();
    console.log(data);
  return (
    <EventOverview events={data} />
  )
}