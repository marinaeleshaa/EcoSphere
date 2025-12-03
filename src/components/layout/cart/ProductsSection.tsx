"use client";
import { CartItems } from "@/types/cart";
import CartItem from "./CartItem";
import Image from "next/image";
import { clearCart as clearAllItems } from "@/frontend/redux/Slice/CartSlice";
import { useAppDispatch } from "@/frontend/redux/hooks";
import { Trash2 } from "lucide-react";

export default function ProductsSection({
  items,
}: Readonly<{ items: CartItems[] }>) {
  const dispatch = useAppDispatch();

  const clearCart = () => {
    // navigate to payment history
    dispatch(clearAllItems());
  };

  return (
    <section className="lg:col-span-2">
      <div className="bg-background rounded-2xl shadow-md border border-primary p-6">
        {items.length > 0 ? (
          <>
            {/* Table Header - Hidden on mobile, shown on desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b mb-2 text-sm text-muted-foreground font-medium">
              <div className="col-span-4 text-center">Product</div>
              <div className="col-span-2 text-center">Product Code</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            <div className="space-y-0">
              {items.map((it) => (
                <CartItem key={it.id} item={it} />
              ))}
            </div>

            <div className="mt-3 pt-3 flex justify-center">
              <button onClick={clearCart} className="myBtnPrimary w-full lg:w-auto">
                Clear all
                <Trash2 className="w-5 h-5  " />
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center py-12">
            <Image
              width={430}
              height={270}
              alt="Empty cart"
              src={"/Empty_cart.png"}
            />
          </div>
        )}
      </div>
    </section>
  );
}
