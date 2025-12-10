import DisplayEvents from '@/components/layout/Dashboard/Events/DisplayEvents/DisplayEvents'
import {GetAllUserEvents } from '@/frontend/actions/Events'
import React from 'react'

export default async function Details() {
  const  data  = await GetAllUserEvents();
  return (
    <DisplayEvents events={data} />
  )
}