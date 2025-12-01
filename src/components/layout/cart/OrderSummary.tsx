"use client";
import { useAppSelector } from "@/frontend/redux/hooks";
import { useState } from "react";
import { Check } from "lucide-react";
import { selectCartTotal } from "@/frontend/redux/selector/cartSelector";

export default function OrderSummary() {
	const subtotalCents = useAppSelector(selectCartTotal);
	const discountCents = Math.round(subtotalCents * 0.1); // UI-only example
	const deliveryCents = 500; // $5 -> 500 cents

	const total = subtotalCents - discountCents + deliveryCents;
	const [couponCode, setCouponCode] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState(false);

	const handleApplyCoupon = () => {
		if (couponCode.trim()) {
			setAppliedCoupon(true);
			// Here you would typically validate and apply the coupon
			console.log("Applying coupon:", couponCode);
		}
	};

	return (
		<div className="rounded-2xl p-6 shadow-md bg-background border">
			<h2 className="text-xl font-semibold mb-6">Order Summary</h2>

			{/* Coupon/Promo Code Section */}
			<div className="mb-6">
				<div className="flex flex-col :flex-row gap-3">
					<input
						type="text"
						placeholder="Keyword encoder"
						value={couponCode}
						onChange={(e) => setCouponCode(e.target.value)}
						className="flex-1 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-black bg-input text-input-foreground rounded-full"
						disabled={appliedCoupon}
					/>
					<button
						onClick={handleApplyCoupon}
						disabled={appliedCoupon || !couponCode.trim()}
						className="px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium bg-primary text-primary-foreground rounded-full transition duration-400 hover:scale-102 hover:outline-2 hover:outline-primary hover:outline-offset-4 flex justify-center items-center"
					>
						Apply
					</button>
				</div>
				{appliedCoupon && (
					<p className="text-sm text-green-600 mt-2">Coupon applied!</p>
				)}
			</div>

			{/* Cost Breakdown */}
			<div className="space-y-3 mb-6">
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Sub total</span>
					<span className="font-medium">
						{(subtotalCents / 100).toFixed(2)} EGP
					</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Discount (10%)</span>
					<span className="font-medium text-green-600">
						-${(discountCents / 100).toFixed(2)} EGP
					</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-muted-foreground">Delivery fee</span>
					<span className="font-medium">
						${(deliveryCents / 100).toFixed(2)} EGP
					</span>
				</div>
			</div>

			{/* Total */}
			<div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t">
				<span>Total</span>
				<span>${(total / 100).toFixed(2)} EGP</span>
			</div>

			{/* Warranty Information */}
			<div className="flex items-start gap-2 mb-6 p-3 bg-muted/50 rounded-full">
				<Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
				<div className="text-sm">
					<span>
						90 Day Limited Warranty up to manufacturer&apos;s elements{" "}
					</span>
					<button className="text-primary hover:underline font-medium">
						Details
					</button>
				</div>
			</div>

			{/* Checkout Button */}
			<button className="w-full py-3 hover:opacity-90 font-semibold bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4">
				Checkout Now
			</button>
		</div>
	);
}
