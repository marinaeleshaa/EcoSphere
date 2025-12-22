import Image from "next/image";
import BasicAnimatedWrapper from "./BasicAnimatedWrapper";

interface IProps {
  imgUrl: string;
  title: string;
  subTitle: string;
}

const HeroSection = ({ imgUrl, subTitle, title }: IProps) => {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          fill
          src={imgUrl}
          alt="Hero background"
          className="w-full h-full object-cover blur-md"
        />
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-primary  via-primary/60 to-primary"></div>
        <div className="absolute inset-0 bg-primary/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl w-full text-center">
          {/* Decorative accent */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-background"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-background"></div>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-background"></div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 tracking-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/90  max-w-2xl mx-auto">
            {subTitle}
          </p>

    
        </div>
      </div>

      {/* Subtle decorative blur */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-primary/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default HeroSection;
