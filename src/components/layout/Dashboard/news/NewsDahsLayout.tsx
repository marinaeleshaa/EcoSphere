import React from "react";
import NewsDashHero from "./NewsHero";
import NewsContainer from "./NewsContainer";

const NewsDahsLayout = () => {
  return (
    <div>
      <NewsDashHero />
      <div className="w-[80%] mx-auto">
        <NewsContainer />
      </div>
    </div>
  );
};

export default NewsDahsLayout;
