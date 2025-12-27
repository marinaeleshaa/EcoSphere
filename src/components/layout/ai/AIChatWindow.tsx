"use client";

import React, { useRef, useEffect } from "react";
import { X, Eraser, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";

interface Message {
	role: "user" | "assistant";
	content: string;
}

interface AIChatWindowProps {
	isOpen: boolean;
	onClose: () => void;
	messages: Message[];
	onSendMessage: (message: string) => void;
	isLoading: boolean;
	onClearChat: () => void;
}

export const AIChatWindow: React.FC<AIChatWindowProps> = ({
	isOpen,
	onClose,
	messages,
	onSendMessage,
	isLoading,
	onClearChat,
}) => {
	const t = useTranslations("AI.window");
	const locale = useLocale();
	const isRTL = locale === "ar";
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data: session } = useSession();

	// Determine user role for suggested prompts
	const getUserRole = ():
		| "guest"
		| "customer"
		| "restaurant"
		| "organizer"
		| "recycleAgent"
		| "admin" => {
		if (!session?.user) return "guest";
		const role = session.user.role;
		if (
			["customer", "restaurant", "organizer", "recycleAgent", "admin"].includes(
				role
			)
		) {
			return role as any;
		}
		return "guest";
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading, isOpen]);

	const handlePromptClick = (promptText: string) => {
		onSendMessage(promptText);
	};

	if (!isOpen) return null;

	const userRole = getUserRole();

	return (
		<div
			className={cn(
				"fixed bottom-24 w-[90vw] md:w-100 h-162.5 max-h-[85vh] bg-card text-card-foreground",
				isRTL ? "left-6" : "right-6",
				"rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden z-60",
				"animate-in slide-in-from-bottom-10 fade-in duration-300"
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground shrink-0">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
						<Sparkles size={18} className="text-primary-foreground" />
					</div>
					<div>
						<h3 className="font-bold text-lg leading-tight">{t("title")}</h3>
						<p className="text-xs opacity-90 font-medium">{t("subtitle")}</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					<button
						onClick={onClearChat}
						className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-90 hover:opacity-100"
						title={t("clearChat")}
					>
						<Eraser size={18} />
					</button>
					<button
						onClick={onClose}
						className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-90 hover:opacity-100"
					>
						<X size={20} />
					</button>
				</div>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-5 space-y-6 bg-muted/20 scrollbar-thin scrollbar-thumb-muted-foreground/20">
				{messages.length === 0 && (
					<div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
						<div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary animate-pulse">
							<Sparkles size={40} />
						</div>
						<p className="font-bold text-xl text-foreground mb-2">
							{t("emptyState.title")}
						</p>
						<p className="text-sm opacity-75 max-w-62.5">
							{t("emptyState.subtitle")}
						</p>
					</div>
				)}

				{messages.map((msg, idx) => {
					const prevUserMsg =
						idx > 0 && messages[idx - 1].role === "user"
							? messages[idx - 1].content
							: "";

					return (
						<ChatMessage
							key={idx}
							role={msg.role}
							content={msg.content}
							userMessage={prevUserMsg}
							index={idx}
						/>
					);
				})}

				{isLoading && <ThinkingIndicator />}
				<div ref={messagesEndRef} />
			</div>

			{/* Persistent Action Area (Categorized) */}
			<div className="p-4 bg-card border-t border-border shrink-0 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between px-1">
						<p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
							{isLoading ? "EcoSphere is thinking..." : "Quick Actions"}
						</p>
						{isLoading && (
							<div className="flex gap-1">
								<div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
								<div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
								<div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
							</div>
						)}
					</div>

					<div className="max-h-55 overflow-y-auto pr-2 custom-scrollbar transition-all duration-300">
						<SuggestedPrompts
							userRole={userRole}
							onPromptClick={handlePromptClick}
							disabled={isLoading}
							showHeader={false}
						/>
					</div>
				</div>

				<p className="text-[10px] text-center text-muted-foreground mt-4 opacity-60">
					{t("disclaimer")}
				</p>
			</div>
		</div>
	);
};
