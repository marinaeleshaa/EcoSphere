"use client";
import { useState, useEffect } from "react";
import { useAppDispatch } from "@/frontend/redux/hooks";
import { updateQuantity } from "@/frontend/redux/Slice/CartSlice";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function QuantitySelector({
	id,
	quantity,
}: Readonly<{
	id: string;
	quantity: number;
}>) {
	const t = useTranslations('Cart.quantitySelector');
	const dispatch = useAppDispatch();
	const [local, setLocal] = useState(quantity);

	useEffect(() => {
		setLocal(quantity);
	}, [quantity]);

	const inc = () => {
		const nv = local + 1;
		setLocal(nv);
		dispatch(updateQuantity({ id, quantity: nv }));
	};

	const dec = () => {
		const nv = Math.max(1, local - 1);
		setLocal(nv);
		dispatch(updateQuantity({ id, quantity: nv }));
	};

	return (
		<div className="flex items-center border border-primary text-primary rounded-full">
			<button
				onClick={dec}
				aria-label={t('decrease')}
				className="p-2 text-foreground cursor-pointer transition duration-400"
				disabled={local <= 1}
			>
				<Minus className="w-5 h-5" strokeWidth={3} />
			</button>
			<motion.div
				key={local}
				animate={{ scale: [1, 1.1, 1] }}
				transition={{ duration: 0.2 }}
				className="px-4 py-2 min-w-11 text-center font-medium border-x"
			>
				{local}
			</motion.div>
			<button
				onClick={inc}
				aria-label={t('increase')}
				className="p-2 hover:text-foreground cursor-pointer transition duration-400"
			>
				<Plus className="w-5 h-5" strokeWidth={3} />
			</button>
		</div>
	);
}
