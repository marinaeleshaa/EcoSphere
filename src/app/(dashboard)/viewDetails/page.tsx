import DisplayEvents from '@/components/layout/Dashboard/Events/DisplayEvents.tsx/DisplayEvents'
import { GetAllEvents } from '@/frontend/api/Events'
import React from 'react'

export default async function page() {
 const {data}= await GetAllEvents();
 console.log(data);
  return (
    <div>
        <DisplayEvents/>
    </div>
  )
}
