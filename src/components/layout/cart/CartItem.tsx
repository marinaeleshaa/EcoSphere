import Image from "next/image";
import QuantitySelector from "./QuantitySelector";
import RemoveButton from "./RemoveButton";
import { CartItems as CI } from "@/types/cart";

export default function CartItem({ item }: Readonly<{ item: CI }>) {
	const totalPrice = (item.price * item.quantity) / 100;
	const productCode = item.id.slice(0, 8).toUpperCase();

	return (
		<div className="grid grid-cols-12 items-center py-4 border-b gap-4">
			{/* Product Image and Info */}
			<div className="col-span-12 md:col-span-4 flex items-center gap-4">
				<div className="w-20 h-20 shrink-0 relative rounded-lg overflow-hidden bg-muted">
					<Image
						fill
						className="object-cover"
						src={item?.image}
						alt={item.title}
					/>
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-base font-medium text-foreground">
						{item.title}
					</h3>
					{item.description && (
						<p className="text-xs text-muted-foreground mt-0.5">
							{item.description}
						</p>
					)}
				</div>
			</div>

			{/* Product Code */}
			<div className="hidden md:block col-span-2 text-sm text-muted-foreground text-center">
				#{productCode}
			</div>

			{/* Quantity */}
			<div className="col-span-5 md:col-span-2 flex justify-center">
				<QuantitySelector id={item.id} quantity={item.quantity} />
			</div>

			{/* Total */}
			<div className="col-span-5 md:col-span-2 text-base font-semibold text-center">
				${totalPrice.toFixed(2)}
			</div>

			{/* Action */}
			<div className="col-span-2 md:col-span-1 flex justify-center">
				<RemoveButton id={item.id} />
			</div>
		</div>
	);
}
