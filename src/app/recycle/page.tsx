import React from 'react'
import RecycleForm from '@/components/layout/Recycle/recycleForm';
import { Hero } from '@/components/layout/Recycle/Hero';
import { Metrics } from '@/components/layout/Recycle/Metrics';

export default function Recycle() {
  return (
    <div>
      <Hero />
      <Metrics />
      <RecycleForm />
    </div>
  )
}
