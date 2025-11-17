"use client";
import Image from "next/image";
import { motion } from "framer-motion";
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
      className="rounded-tr-[80px] rounded-bl-[80px] shadow-2xl h-[420px] flex flex-col overflow-hidden"
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
            <p className="text-xs text-stone-700 line-clamp-1">
              {shopSubtitle}
            </p>
          </div>
        </div>
        <div className="rounded-full w-3 h-3 bg-[#527b50] shrink-0 mr-5"></div>
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
        <p className="text-sm text-stone-700 line-clamp-1 mb-2">
          {productSubtitle}
        </p>
        <p className="text-sm text-stone-600 line-clamp-3 mb-3 flex-1 overflow-hidden ">
          {productDescription}
        </p>
        <p className="text-lg font-semibold mt-auto ml-10">
          ${productPrice.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
