import Image from "next/image";

interface IShop {
  title: string;
  desc: string;
  img: string;
}

export default function ShopCard({ shop }: { shop: IShop }) {
  return (
    <div className="relative w-[80%] md:w-[calc(25%-12px)] md:h-60 group z-0 md:hover:z-50">
      <div
        className="relative w-full h-full bg-primary rounded-tr-[80px] rounded-bl-[80px]  shadow-lg overflow-hidden flex flex-col md:flex-row
          transition-all duration-500 ease-out md:absolute md:top-0 md:left-0"
      >
        {/* LEFT CONTENT */}
        <div className="relative z-20 p-6 flex-1 flex flex-col justify-start items-start md:group-hover:w-1/2 md:group-hover:flex-none transition-all duration-500">
          <h3 className="font-semibold text-primary-foreground text-lg mb-2 line-clamp-1">
            {shop.title}
          </h3>
          <p className="text-sm text-primary-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 line-clamp-3">
            {shop.desc}
          </p>
          <button className="mt-4 text-primary-foreground font-medium md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 underline">
            Read More →
          </button>
        </div>

        {/* IMAGE (RIGHT SIDE) */}
        <div className="relative w-full h-48 order-last md:absolute md:inset-y-0 md:right-0 md:h-full md:order-0 md:w-0 md:opacity-0 md:group-hover:w-1/2 md:group-hover:opacity-100 transition-all duration-500 ease-out z-10">
          <Image
            width={500}
            height={500}
            alt={shop.title}
            src={shop.img}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
