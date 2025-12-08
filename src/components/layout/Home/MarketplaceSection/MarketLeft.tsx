import Image from "next/image";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { TbCertificate } from "react-icons/tb";
import BasicAnimatedWrapper from "../../common/BasicAnimatedWrapper";

const MarketLeft = () => {
  return (
    <BasicAnimatedWrapper className="w-full md:w-1/2">
      <div className=" flex flex-col justify-center items-center gap-4 ">
        <Image
          src="/home/market.png"
          alt="marketplace"
          width={500}
          height={500}
          className="w-full h-[300px] object-cover  "
        />
        <div className="flex justify-evenly gap-6 items-center">
          <div className="flex flex-col gap-2 justify-center items-center text-lg text-center">
            <p className="text-5xl text-primary">
              <RiShoppingBasket2Fill />
            </p>
            <p>300+ sustainable products</p>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center text-lg text-center">
            <p className="text-5xl text-primary">
              <TbCertificate />
            </p>
            <p>50+ green brands</p>
          </div>
        </div>
      </div>
    </BasicAnimatedWrapper>
  );
};

export default MarketLeft;
