import React from 'react';
import HeroSection from "@/components/layout/common/HeroSection";
import { Metrics } from '@/components/layout/Recycle/Metrics';
import RecycleForm from '@/components/layout/Recycle/recycleForm';


export default function Recycle() {
  return (
    <div className="scroll-smooth">
      <HeroSection 
        imgUrl="/recycle2.png"
        title="A Greener Tomorrow Starts Today"
        subTitle="Join us in our mission to revolutionize waste management and build a sustainable future for our planet. Every piece counts."
      />
      <Metrics />
      <RecycleForm />
    </div>
  );
}
