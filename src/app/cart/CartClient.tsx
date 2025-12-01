"use client"; // interactive container
import { CartItems } from "@/types/cart";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/frontend/redux/hooks";
import { hydrateCart } from "@/frontend/redux/Slice/CartSlice";
import OrderSummary from "@/components/layout/cart/OrderSummary";
import ProductsSection from "@/components/layout/cart/ProductsSection";
import { selectCartItemsArray } from "@/frontend/redux/selector/cartSelector";

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
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
			{/* Left Section - Shopping Cart Items */}
			<h2 className="text-3xl font-semibold m-5 ml-10">Shopping Cart</h2>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 text-primary">
				<ProductsSection items={items} />

				{/* Right Section - Order Summary */}
				<aside className="lg:col-span-1 text-primary">
					<OrderSummary />
				</aside>
			</div>
		</div>
	);
}
