"use client";
import { useAppDispatch } from "@/frontend/redux/hooks";
import { removeItem } from "@/frontend/redux/Slice/CartSlice";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function RemoveButton({ id }: Readonly<{ id: string }>) {
	const dispatch = useAppDispatch();
	const [confirming, setConfirming] = useState(false);

	const onRemove = () => {
		if (!confirming) {
			setConfirming(true);
			setTimeout(() => setConfirming(false), 5000);
			return;
		}
		dispatch(removeItem(id));
	};

	return (
		<button
			onClick={onRemove}
			className="p-2 hover:bg-muted rounded-md transition-colors"
			aria-label="Remove item"
			title={confirming ? "Click again to confirm" : "Remove item"}
		>
			{confirming ? (
				<span className="text-sm text-destructive">Confirm?</span>
			) : (
				<Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
			)}
		</button>
	);
}
