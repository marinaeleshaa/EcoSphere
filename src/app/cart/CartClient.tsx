"use client"; // interactive container
import { CartItems } from "@/types/cart";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/frontend/redux/hooks";
import { hydrateCart } from "@/frontend/redux/Slice/CartSlice";
import OrderSummary from "@/components/layout/cart/OrderSummary";
import ProductsSection from "@/components/layout/cart/ProductsSection";
import { selectCartItemsArray } from "@/frontend/redux/selector/cartSelector";
import CartHero from "@/components/layout/cart/CartHero";

export default function CartClient({
  initialCart,
}: Readonly<{
  initialCart: CartItems[];
}>) {
  // hydrate server cart into store inside CartPage client component (useEffect)
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItemsArray);

  useEffect(() => {
    if (initialCart?.length) dispatch(hydrateCart(initialCart));
  }, [initialCart, dispatch]);

  return (
    <div>
      {/* Left Section - Shopping Cart Items */}
      <CartHero />
      <div className="max-w-[80%] mx-auto my-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <ProductsSection items={items} />

          {/* Right Section - Order Summary */}
          <aside className="lg:col-span-1 ">
            <OrderSummary />
          </aside>
        </div>
      </div>
    </div>
  );
}
