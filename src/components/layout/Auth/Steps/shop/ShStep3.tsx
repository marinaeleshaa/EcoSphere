"use client";

import React from "react";

const ShStep3 = () => {
  return (
    <div className="flex flex-col gap-5 p-5 text-foreground rounded-lg">
      <p className="text-2xl md:text-3xl font-bold text-center text-secondary-foreground">
        Shop Details
      </p>

      {/* Logo upload */}

      <input type="file" accept="image/*" className="myInput" />

      {/* Location */}

      <input
        type="text"
        placeholder="Enter shop location"
        className="myInput"
      />

      {/* Working hours */}

      <input
        type="text"
        placeholder="e.g., Mon-Fri 9:00 AM - 6:00 PM"
        className="myInput"
      />
    </div>
  );
};

export default ShStep3;
