import React from "react";

const LastStep = () => {
  return (
    <div className="flex sm:flex gap-5 flex-col p-5">
      <p className="text-2xl md:text-3xl font-bold text-center text-secondary-foreground">
       Final Step
      </p>
      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
      />

      {/* Confirm Password */}
      <input
        type="password"
        placeholder="Confirm Password"
        className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
      />
    </div>
  );
};

export default LastStep;
