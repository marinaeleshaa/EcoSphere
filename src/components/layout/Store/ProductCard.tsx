"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { RiShoppingCartLine } from "react-icons/ri";
import { IoMdHeartEmpty } from "react-icons/io";

interface Props {
  shopName: string;
  shopSubtitle: string;
  productImg: string;
  productName: string;
  productPrice: number;
  productSubtitle: string;
  productDescription: string;
}

const ProductCard = (props: Props) => {
  const {
    shopName,
    shopSubtitle,
    productImg,
    productName,
    productPrice,
    productSubtitle,
    productDescription,
  } = props;

  return (
    <motion.div
      className="rounded-tr-[80px] rounded-bl-[80px] shadow-2xl h-[440px] flex flex-col overflow-hidden hover:scale-105 transition-transform duration-300 dark:bg-primary/10"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* header - fixed height */}
      <div className="flex justify-between items-center p-5 min-h-20">
        <div className="flex gap-3 items-center flex-1 min-w-0">
          <Image
            width={1000}
            height={1000}
            src="/store img/avatar.jpg"
            alt="avatar"
            className="w-10 h-10 rounded-full shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 font-medium text-sm leading-tight">
              {shopName}
            </p>
            <p className="text-xs text-secondary-foreground line-clamp-1">
              {shopSubtitle}
            </p>
          </div>
        </div>
        <div className="rounded-full w-3 h-3 bg-primary shrink-0 mr-5"></div>
      </div>

      {/* product img - fixed height */}
      <div className="w-full h-[170px] shrink-0">
        <Image
          width={1000}
          height={1000}
          src={productImg}
          alt="product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* product details - flexible but controlled */}
      <div className="p-5 flex flex-col flex-1 min-h-0">
        <p className="text-lg font-semibold line-clamp-1 mb-1">{productName}</p>
        <p className="text-sm text-secondary-foreground/80 line-clamp-1 mb-2">
          {productSubtitle}
        </p>
        <div className="grow ">

        <p className="text-sm text-secondary-foreground/90 line-clamp-3 mb-3   ">
          {productDescription}
        </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold mt-auto ml-10">
            ${productPrice.toFixed(2)}
          </p>
          <div className=" flex gap-3">
            <button>
              <RiShoppingCartLine />
            </button>
            <button>
              <IoMdHeartEmpty />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
