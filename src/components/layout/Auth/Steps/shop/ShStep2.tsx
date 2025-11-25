"use client";

import React from "react";

const ShStep2 = () => {
  return (
    <div className="flex flex-col gap-5 p-5 text-foreground rounded-lg">
      <p className="text-2xl md:text-3xl font-bold text-center text-secondary-foreground">
        Shop Details
      </p>
      <input type="text" placeholder="Name" className=" myInput" />
      <textarea placeholder="Description" className="myInput resize-none" />
      <input type="tel" placeholder="Phone Number" className="myInput" />
      <input type="tel" placeholder="Hotline" className="myInput" />
    </div>
  );
};

export default ShStep2;
