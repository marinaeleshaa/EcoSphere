import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";

const TextHeroSection = () => {
  return (
    <BasicAnimatedWrapper>
      <div className=" w-[70%] mx-auto flex flex-col gap-10 md:flex-row justify-between">
        <div className="text-lg md:text-2xl font-bold md:w-1/2">
          More than $50 million is raised every week on GoFundMe.*
        </div>
        <div className="md:w-1/2 text-primary/70 text-base md:text-lg">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et amet quas
          impedit! Delectus, pariatur quibusdam. Sapiente deleniti distinctio
          iste officiis!
        </div>
      </div>
    </BasicAnimatedWrapper>
  );
};

export default TextHeroSection;
