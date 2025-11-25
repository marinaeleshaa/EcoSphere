const UStep2 = () => {
  return (
    <div className="flex  sm:flex gap-5 flex-col p-5">
      <input
        type="text"
        placeholder="First Name"
        className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
      />

      <input
        type="text"
        placeholder="Last Name"
        className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
      />

      <input
        type="date"
        placeholder="Birthdate"
        className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
      />

      {/* Gender Radio Buttons */}
      <div className="flex gap-5 items-center ">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="female"
            className="w-4 h-4 accent-primary"
          />
          <span className="text-secondary-foreground">Female</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="gender"
            value="male"
            className="w-4 h-4 accent-primary"
          />
          <span className="text-secondary-foreground">Male</span>
        </label>
      </div>
    </div>
  );
};

export default UStep2;
