"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const RightFloatingImg = () => {
  return (
     <div className=" relative h-screen ">
       <motion.div
         className="absolute right-[7%] bottom-[50%] lg:bottom-auto lg:top-[20%] lg:right-[40%] w-[35%] rounded-full aspect-square z-20"
         initial={{ scale: 0, opacity: 0 }}
         whileInView={{ scale: [0,1.5,1], opacity: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, ease: "easeOut" }}
         style={{ transformOrigin: "center" }}
       >
         {/* SVG BORDER ANIMATION */}
         <svg
           className="absolute inset-0 w-full h-full z-30 scale-125"
           viewBox="0 0 100 100"
         >
           <defs>
             <linearGradient
               id="borderGradient1"
               x1="0%"
               y1="0%"
               x2="100%"
               y2="0%"
             >
               <stop offset="0%" stopColor="oklch(75.63% 0.0818 135.25)" />
               <stop offset="100%" stopColor="oklch(51.57% 0.0683 135.25)" />
             </linearGradient>
           </defs>
           <circle
             cx="50"
             cy="50"
             r="45"
             stroke="url(#borderGradient1)"
             strokeWidth="5"
             fill="none"
             strokeDasharray="360"
             strokeDashoffset="360"
           >
             <animate
               attributeName="stroke-dashoffset"
               from="360"
               to="0"
               dur="1s"
               fill="freeze"
               calcMode="spline"
               keySplines="0 0 0.58 1"
               begin="0.5s"
             />
           </circle>
         </svg>
         <Image
           width={500}
           height={500}
           alt="left floating img"
           src="/homeHero/event.png"
           className=" w-full h-full rounded-full aspect-square border-2 border-primary overflow-hidden hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer"
         />
       </motion.div>
       <motion.div
         className="absolute right-[20%] bottom-[20%] lg:bottom-auto lg:top-[45%] lg:right-[5%] w-[35%] rounded-full aspect-square z-20"
         initial={{ scale: 0, opacity: 0 }}
         whileInView={{ scale: [0,1.5,1], opacity: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
         style={{ transformOrigin: "center" }}
       >
         {/* SVG BORDER ANIMATION */}
         <svg
           className="absolute inset-0 w-full h-full z-30 scale-125"
           viewBox="0 0 100 100"
         >
           <defs>
             <linearGradient
               id="borderGradient2"
               x1="0%"
               y1="0%"
               x2="100%"
               y2="0%"
             >
               <stop offset="0%" stopColor="oklch(75.63% 0.0818 135.25)" />
               <stop offset="100%" stopColor="oklch(51.57% 0.0683 135.25)" />
             </linearGradient>
           </defs>
           <circle
             cx="50"
             cy="50"
             r="45"
             stroke="url(#borderGradient2)"
             strokeWidth="5"
             fill="none"
             strokeDasharray="360"
             strokeDashoffset="360"
           >
             <animate
               attributeName="stroke-dashoffset"
               from="360"
               to="0"
               dur="1s"
               fill="freeze"
               calcMode="spline"
               keySplines="0 0 0.58 1"
               begin="0.7s"
             />
           </circle>
         </svg>
         <Image
           width={500}
           height={500}
           alt="left floating img"
           src="/homeHero/game.png"
           className=" w-full h-full rounded-full aspect-square border-2 border-primary overflow-hidden hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer"
         />
       </motion.div>
       <motion.div
         className="absolute right-[60%] bottom-[0%] lg:bottom-auto lg:top-[60%] lg:right-[55%] w-[35%] rounded-full aspect-square z-20"
         initial={{ scale: 0, opacity: 0 }}
         whileInView={{ scale: [0,1.5,1], opacity: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
         style={{ transformOrigin: "center" }}
       >
         {/* SVG BORDER ANIMATION */}
         <svg
           className="absolute inset-0 w-full h-full z-30 scale-125"
           viewBox="0 0 100 100"
         >
           <defs>
             <linearGradient
               id="borderGradient3"
               x1="0%"
               y1="0%"
               x2="100%"
               y2="0%"
             >
               <stop offset="0%" stopColor="oklch(75.63% 0.0818 135.25)" />
               <stop offset="100%" stopColor="oklch(51.57% 0.0683 135.25)" />
             </linearGradient>
           </defs>
           <circle
             cx="50"
             cy="50"
             r="45"
             stroke="url(#borderGradient3)"
             strokeWidth="5"
             fill="none"
             strokeDasharray="360"
             strokeDashoffset="360"
           >
             <animate
               attributeName="stroke-dashoffset"
               from="360"
               to="0"
               dur="1s"
               fill="freeze"
               calcMode="spline"
               keySplines="0 0 0.58 1"
               begin="0.9s"
             />
           </circle>
         </svg>
         <Image
           width={500}
           height={500}
           alt="left floating img"
           src="/homeHero/recycle.png"
           className="w-full h-full rounded-full aspect-square border-2 border-primary overflow-hidden hover:scale-105 transition-all duration-500 ease-in-out cursor-pointer"
         />
       </motion.div>
     </div>
   );
}

export default RightFloatingImg