import Image from "next/image";

interface IShop {
  title: string;
  desc: string;
  img: string;
}

export default function ShopCard({ shop }: { shop: IShop }) {
  return (
    <div className="group relative w-full h-auto md:h-60">
      <div
        className="relative w-full h-full bg-primary rounded-tr-[80px] rounded-bl-[80px]
    shadow-lg overflow-hidden flex flex-col md:flex-row transition-all duration-500 ease-out"
      >
        {/* LEFT CONTENT */}
        <div className="relative z-20 p-6 flex flex-col justify-start items-start w-full md:w-full md:group-hover:w-1/2 transition-all duration-500">
          <h3 className="font-semibold text-primary-foreground text-lg mb-2 line-clamp-1">
            {shop.title}
          </h3>

          <p className="text-sm text-primary-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 line-clamp-3">
            {shop.desc}
          </p>

          <button className="mt-4 text-primary-foreground underline font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
            Read More →
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full h-48 md:absolute md:inset-y-0 md:right-0 md:h-full md:w-0 md:opacity-0 md:group-hover:w-1/2 md:group-hover:opacity-100 transition-all duration-500 ease-out z-10">
          <Image
            width={600}
            height={600}
            alt={shop.title}
            src={shop.img}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
