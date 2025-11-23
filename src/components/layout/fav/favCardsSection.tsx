"use client"

import { RootState } from "@/Redux/Store"
import { useSelector } from "react-redux"

const FavCardsSection = () => {
    const {view} =  useSelector((state: RootState) => state.fav)
  return (
    <section>
        <div className={view === "grid" ? "grid grid-cols-4 gap-5 mb-10" : "flex flex-col gap-5 mb-10"}>

        </div>
    </section>
  )
}

export default FavCardsSection