'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { RiDeleteBin6Fill } from "react-icons/ri";
export default function DeleteEventBtn({ id }: { id: string }) {
      async function onDelete(id: string) {
        console.log(id);
      }
  return (
      <Button
          onClick={() => onDelete(id)}
          className="p-3 text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150"
          title="Delete Event"
      >
          <RiDeleteBin6Fill className=" size-4 items-baseline " />
      </Button>
  )
}
