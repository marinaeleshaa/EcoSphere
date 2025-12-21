"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

interface DeleteProductDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	isDeleting: boolean;
	productTitle?: string;
}

export default function DeleteProductDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  productTitle,
}: Readonly<DeleteProductDialogProps>) {
  const t = useTranslations("Restaurant.Products.deleteDialog");
  if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
			<div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-lg scale-100 animate-in zoom-in-95 duration-200">
				<div className="flex flex-col items-center text-center space-y-4">
					<div className="p-3 bg-red-100 rounded-full dark:bg-red-900/20">
						<AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
					</div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-card-foreground">
              {t("title")}
            </h2>
            <p className="text-muted-foreground">
              {productTitle
                ? t("description", { title: productTitle })
                : t("descriptionNoTitle")}
            </p>
          </div>

          <div className="flex w-full gap-3 pt-4">
            <Button
              className="flex-1 myBtnPrimary bg-transparent text-foreground hover:bg-secondary/80 border border-input shadow-sm"
              onClick={onClose}
              disabled={isDeleting}
            >
              {t("cancel")}
            </Button>
            <Button
              className="flex-1 myBtnPrimary bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("deleting")}
                </>
              ) : (
                t("confirm")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
