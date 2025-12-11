"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateProductDTO } from "@/backend/features/product/dto/product.dto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";
import ImageUpload from "@/components/layout/common/ImageUpload";

interface ProductPopupProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CreateProductDTO) => Promise<void>;
	initialData?: CreateProductDTO;
	title: string;
	description?: string;
}

import { useTranslations } from "next-intl";

export default function ProductPopup({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	title,
	description,
}: Readonly<ProductPopupProps>) {
	const t = useTranslations("Restaurant.Products");
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CreateProductDTO>({
		defaultValues: initialData || {
			title: "",
			subtitle: "",
			price: 0,
			availableOnline: true,
		},
	});

	const [imageKey, setImageKey] = React.useState<string | undefined>(
		initialData?.avatar?.key
	);

	React.useEffect(() => {
		if (isOpen) {
			if (initialData) {
				reset(initialData);
				setImageKey(initialData.avatar?.key);
			} else {
				reset({
					title: "",
					subtitle: "",
					price: 0,
					availableOnline: true,
				});
				setImageKey(undefined);
			}
		}
	}, [isOpen, initialData, reset]);

	const handleFormSubmit = async (data: CreateProductDTO) => {
		if (imageKey) {
			data.avatar = { key: imageKey };
		}
		await onSubmit(data);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-lg max-h-[90vh] overflow-y-auto">
				<h2 className="text-xl font-bold mb-4 text-card-foreground">{title}</h2>
				{description && (
					<p className="text-sm text-muted-foreground mb-4">{description}</p>
				)}
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">{t("popup.titleLabel")}</Label>
						<Input
							id="title"
							placeholder={t("popup.titlePlaceholder")}
							{...register("title", {
								required: t("popup.errors.titleRequired"),
							})}
						/>
						{errors.title && (
							<span className="text-sm text-red-500">
								{errors.title.message}
							</span>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="subtitle">{t("popup.subtitleLabel")}</Label>
						<Textarea
							id="subtitle"
							placeholder={t("popup.subtitlePlaceholder")}
							{...register("subtitle", {
								required: t("popup.errors.subtitleRequired"),
							})}
						/>
						{errors.subtitle && (
							<span className="text-sm text-red-500">
								{errors.subtitle.message}
							</span>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="price">{t("popup.priceLabel")}</Label>
						<Input
							id="price"
							type="number"
							step="0.01"
							{...register("price", {
								required: t("popup.errors.priceRequired"),
								min: 0,
								valueAsNumber: true,
							})}
						/>
					</div>

					<div className="space-y-2">
						<Label>{t("popup.imageLabel")}</Label>
						<div className="h-40 w-full border rounded-md">
							<ImageUpload
								currentImageUrl={initialData?.avatar?.url}
								variant="square"
								onImageUpdate={(url: string) => {
									// We primarily use onUploadComplete for the key
								}}
								onUploadComplete={(data) => {
									setImageKey(data.key);
								}}
								endpoint="/api/upload/image"
							/>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="availableOnline"
							className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
							{...register("availableOnline")}
						/>
						<Label htmlFor="availableOnline">{t("popup.availableLabel")}</Label>
					</div>

					<div className="mt-6 flex justify-end space-x-3">
						<Button type="button" variant="outline" onClick={onClose}>
							{t("actions.cancel")}
						</Button>

						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("actions.saving")}
								</>
							) : (
								t("actions.save")
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
