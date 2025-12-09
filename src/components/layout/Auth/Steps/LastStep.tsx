"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Z from "zod";
import { useDispatch } from "react-redux";
import { saveStep4Data, setStepValid } from "@/frontend/redux/Slice/AuthSlice";
import { LastStepSchema } from "@/frontend/schema/register.schema";
import { AppDispatch } from "@/frontend/redux/store";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

type LastStepForm = Z.infer<typeof LastStepSchema>;

const LastStep = () => {
	const t = useTranslations("Auth.steps.lastStep");
	const dispatch = useDispatch<AppDispatch>();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<LastStepForm>({
		resolver: zodResolver(LastStepSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = form;

	const onSubmit = (data: LastStepForm) => {
		dispatch(saveStep4Data(data));
		dispatch(setStepValid({ step: 4, valid: true }));
	};

	useEffect(() => {
		const subscription = form.watch((value) => {
			dispatch(saveStep4Data(value));
		});
		return () => subscription.unsubscribe();
	}, [form, dispatch]);

	useEffect(() => {
		dispatch(setStepValid({ step: 4, valid: isValid }));
	}, [isValid, dispatch]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-5">
			<p className="text-2xl md:text-3xl font-bold text-center text-secondary-foreground">
				{t("title")}
			</p>

			{/* Email */}
			<div>
				<input
					type="email"
					placeholder={t("email")}
					{...register("email")}
					className="myInput"
				/>
				{errors.email && (
					<p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
				)}
			</div>

			{/* Password */}
			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					placeholder={t("password")}
					{...register("password")}
					className="myInput"
				/>
				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-4 top-1/2 cursor-pointer -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
				>
					{showPassword ? (
						<EyeOff size={20} className="text-black" />
					) : (
						<Eye size={20} className="text-black" />
					)}
				</button>
				{errors.password && (
					<p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>
				)}
			</div>

			{/* Confirm Password */}
			<div className="relative">
				<input
					type={showConfirmPassword ? "text" : "password"}
					placeholder={t("confirmPassword")}
					{...register("confirmPassword")}
					className="myInput"
				/>
				<button
					type="button"
					onClick={() => setShowConfirmPassword(!showConfirmPassword)}
					className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
				>
					{showConfirmPassword ? (
						<EyeOff size={20} className="text-black" />
					) : (
						<Eye size={20} className="text-black" />
					)}
				</button>
				{errors.confirmPassword && (
					<p className="text-red-500 mt-1 text-sm">
						{errors.confirmPassword.message}
					</p>
				)}
			</div>
		</form>
	);
};

export default LastStep;
