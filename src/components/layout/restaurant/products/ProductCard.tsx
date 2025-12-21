"use client";
import React from "react";
import { ProductResponse } from "@/backend/features/product/dto/product.dto";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProductCardProps {
	product: ProductResponse;
	onEdit: (product: ProductResponse) => void;
	onDelete: (productId: string) => void;
}

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProductCard({
	product,
	// onEdit,
	// onDelete,
}: Readonly<ProductCardProps>) {
	const t = useTranslations("Restaurant.Products");

	// const handleEdit = (e: React.MouseEvent) => {
	// 	e.stopPropagation();
	// 	onEdit(product);
	// };

	// const handleDelete = (e: React.MouseEvent) => {
	// 	e.stopPropagation();
	// 	onDelete(String(product._id));
	// };

	const getScoreColor = (score: number) => {
		if (score >= 8) return "bg-green-500 text-white";
		if (score >= 5) return "bg-yellow-500 text-black";
		return "bg-red-500 text-white";
	};

	return (
		<div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group">
			<div className="relative h-48 w-full bg-muted">
				{product.avatar?.url ? (
					<Image
						src={product.avatar.url}
						alt={product.title}
						fill
						className="object-cover"
					/>
				) : (
					<div className="flex items-center justify-center h-full text-muted-foreground">
						{t("noImage")}
					</div>
				)}

				{/* Sustainability Badge with Shadcn Tooltip */}
				{product.sustainabilityScore && (
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<div
									className={`absolute top-2 left-2 z-10 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md cursor-help ${getScoreColor(
										product.sustainabilityScore
									)}`}
								>
									<span>🌿</span>
									<span>{product.sustainabilityScore}/10</span>
								</div>
							</TooltipTrigger>
							<TooltipContent
								side="right"
								className="max-w-50 text-xs bg-black/90 text-white border-none"
							>
								<p>{product.sustainabilityReason}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}

				{!product.availableOnline && (
					<div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
						{t("unavailable")}
					</div>
				)}
			</div>
		</div>
	);
}

// return (
// 	<div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
// 		<div className="relative h-48 w-full bg-muted">
// 			{product.avatar?.url ? (
// 				<Image
// 					src={product.avatar.url}
// 					alt={product.title}
// 					fill
// 					className="object-cover"
// 				/>
// 			) : (
// 				<div className="flex items-center justify-center h-full text-muted-foreground">
// 					{t("noImage")}
// 				</div>
// 			)}
// 			{!product.availableOnline && (
// 				<div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
// 					{t("unavailable")}
// 				</div>
// 			)}
// 		</div>

// 		<div className="p-4 flex-1 flex flex-col">
// 			<div className="flex justify-between items-start mb-2">
// 				<h3
// 					className="font-semibold text-lg line-clamp-1"
// 					title={product.title}
// 				>
// 					{product.title}
// 				</h3>
// 				<span className="font-bold text-primary">
// 					{t("currency")} {product.price.toFixed(2)}
// 				</span>
// 			</div>

// 			<p className="text-sm text-muted-foreground line-clamp-2 flex-1">
// 				{product.subtitle}
// 			</p>

// 			<div className="flex gap-3 mt-4 pt-4 border-t border-border">
// 				<Button
// 					className="flex-1 myBtnPrimary text-sm h-10 w-full hover:scale-100"
// 					onClick={handleEdit}
// 				>
// 					<Edit className="h-4 w-4" />
// 					{t("actions.edit")}
// 				</Button>
// 				<Button
// 					variant="destructive"
// 					className="flex-1 rounded-full h-10 hover:scale-105 transition-transform"
// 					onClick={handleDelete}
// 				>
// 					<Trash2 className="h-4 w-4" />
// 				</Button>
// 			</div>
// 		</div>
// 	</div>
// 	);
// }
