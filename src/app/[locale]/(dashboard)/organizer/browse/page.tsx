import { GetAllEvents } from '@/frontend/api/Events';
import React from 'react'

export default async function Browse() {
  const { data } = await GetAllEvents();
    console.log(data);
  return (
    <div>page</div>
  )
}
