import DisplayEvents from '@/components/layout/Dashboard/Events/DisplayEvents/DisplayEvents'
import {GetAllUserEvents } from '@/frontend/api/Events'
import React from 'react'

export default async function Details() {
  // const  {data}  = await GetAllUserEvents();
  // console.log(data);
  return (
    <div>
      <DisplayEvents />
    </div>
  )
}