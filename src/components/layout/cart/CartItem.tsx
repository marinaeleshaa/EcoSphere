import Image from "next/image";
import QuantitySelector from "./QuantitySelector";
import RemoveButton from "./RemoveButton";
import { IProductCart } from "@/types/ProductType";
import { useTranslations } from "next-intl";

export default function CartItem({ item }: Readonly<{ item: IProductCart }>) {
  const t = useTranslations("Cart.orderSummary");
  const totalPrice = item.productPrice * item.quantity;
  const productCode = item.id.slice(0, 6).toUpperCase();

  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-primary gap-4">
      {/* Product Image and Info */}
      <div className="col-span-12 md:col-span-4 flex items-center gap-4">
        <div className="w-20 h-20 shrink-0 relative rounded-lg overflow-hidden bg-muted">
          {!!item?.productImg && (
            <Image
              fill
              className="object-cover"
              src={item?.productImg}
              alt={item.productName}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-foreground">
            {item.productName}
          </h3>
          {item.productSubtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-3">
              {item.productSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Product Code */}
      <div className="hidden md:block col-span-2 text-sm text-muted-foreground text-center max-w-.5 line-clamp-1">
        #{productCode}
      </div>

      {/* Quantity */}
      <div className="col-span-5 md:col-span-2 flex justify-center">
        <QuantitySelector id={item.id} quantity={item.quantity} />
      </div>

      {/* Total */}
      {!!totalPrice && (
        <div className="col-span-5 md:col-span-2 text-base font-semibold text-center md:ml-5">
          {totalPrice.toFixed(2)} {t("currency")}
        </div>
      )}

      {/* Action */}
      <div className="col-span-2 md:col-span-2 flex justify-center">
        <RemoveButton id={item.id} />
      </div>
    </div>
  );
}
