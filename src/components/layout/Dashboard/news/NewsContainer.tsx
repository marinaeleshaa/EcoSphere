import React from 'react'
import NewsPostCard from './NewsPostCard'

const NewsContainer = () => {
  return (
    <div className='p-4 md:p-8 lg:p-12'>
      <div className='flex flex-col gap-6 max-w-7xl mx-auto'>
        <NewsPostCard />
        <NewsPostCard />
        <NewsPostCard />
      </div>
    </div>
  )
}

export default NewsContainer