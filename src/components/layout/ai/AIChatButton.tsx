"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AIChatButtonProps {
	onClick: () => void;
	isOpen: boolean;
}

export const AIChatButton: React.FC<AIChatButtonProps> = ({
	onClick,
	isOpen,
}) => {
	const t = useTranslations("AI.button");
	return (
		<button
			onClick={onClick}
			className={cn(
				"fixed bottom-6 right-6 z-50 group",
				"flex items-center justify-center p-4 rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-700",
				"bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
				isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
			)}
			aria-label={t("label")}
		>
			{/* Glow Effect */}
			<span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

			<div className="relative flex items-center">
				<Sparkles size={24} className="animate-pulse" />
				<div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-1000 ease-in-out opacity-0 group-hover:opacity-100">
					<span className="font-semibold whitespace-nowrap pl-2 pr-1 block">
						{t("label")}
					</span>
				</div>
			</div>
		</button>
	);
};
