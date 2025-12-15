'use client'
import { EventProps } from '@/types/EventTypes'
import React, { useState } from 'react'
import { SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import TicketCard from '../../../common/events/TicketCard'
export default function BrowseEvents({ events }: EventProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  const filteredEvents = events.filter((event) => {
    const query = searchQuery.toLowerCase()
    return (
      event.name.toLowerCase().includes(query)
    )
  })
  return (
    <section className="min-h-screen py-8 w-[85%] mx-auto flex flex-col gap-6">
      <h1 className="capitalize font-bold text-4xl text-center  text-foreground">
        Browse All events
      </h1>
      <div className='w-full flex justify-end'>
        <ButtonGroup >
          <Input placeholder="Search..." value={searchQuery}
            onChange={handleSearchChange} />
          <Button variant="outline" aria-label="Search">
            <SearchIcon />
          </Button>
        </ButtonGroup>
      </div>
      <div className='grid grid-cols-3 gap-6'>
        {
          filteredEvents.map((event) => (
            <TicketCard key={event._id} event={event} />
          ))
        }
      </div>
      {filteredEvents.length === 0 && (
        <div className="text-center w-full p-8 rounded-xl shadow-md text-muted-foreground border-2 border-primary">
          No upcoming events found.
        </div>
      )}
    </section>
  )
}
