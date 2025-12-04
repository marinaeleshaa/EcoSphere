import { toggleAuthView } from "@/frontend/redux/Slice/AuthSlice";
import Link from "next/link";
import Image from "next/image";
import { FaApple, FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { ChangeEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/frontend/redux/hooks";
import { useTranslations } from "next-intl";

const initiateData: SignInResponse = {
	status: 200,
	ok: false,
	error: "",
	url: null,
	code: "",
};

const initLoginData = {
	email: "",
	password: "",
};

const LogIn = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [loginForm, setLoginForm] = useState(initLoginData);
	const [showPassword, setShowPassword] = useState(false);
	const [loginState, setLoginState] = useState(initiateData);
	// console.log(loginForm, "loginForm"); // leave here to show the rerender 1000 times
	const t = useTranslations("Auth.login");

	const handleToggle = () => {
		dispatch(toggleAuthView());
	};

	const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
		setLoginForm({
			...loginForm,
			[e.target.name]: e.target.value,
		});
		setLoginState(initiateData);
	};

	const handleLogin = async () => {
		if (!loginForm.email || !loginForm.password) return;
		const response = await signIn("credentials", {
			email: loginForm.email,
			password: loginForm.password,
			redirect: false,
		});
		if (!response.error) router.replace("/");
		setLoginState(response);
	};

	return (
		<div className="flex sm:flex gap-5 flex-col">
			<p className="capitalize text-center font-extrabold mb-5 text-secondary-foreground text-4xl">
				{t("title")}
			</p>
			<input
				type="email"
				name="email"
				placeholder={t("email")}
				value={loginForm.email}
				onChange={handleFormData}
				className="myInput"
			/>
			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					name="password"
					placeholder={t("password")}
					value={loginForm.password}
					onChange={handleFormData}
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
			</div>
			{/* forget password */}
			<div className="flex justify-end items-center gap-6">
				{loginState.error && (
					<span className="text-red-500 text-center">
						Invalid email or password
					</span>
				)}
				<Link href="#">
					<div className="flex justify-end px-5">
						<div className="flex gap-1 justify-center items-center text-sm group cursor-pointer">
							<p className="text-secondary-foreground transition-all duration-300 ">
								{t("forgetPassword")}
							</p>
							<IoIosArrowRoundForward className=" transform transition-all duration-300 ease-out group-hover:translate-x-1 " />
						</div>
					</div>
				</Link>
			</div>

			<button
				onClick={handleLogin}
				disabled={!!(!loginForm.email || !loginForm.password)}
				className="myBtnPrimary disabled:opacity-50"
			>
				{t("title")}
				(
				<Image
					src={"/leaf.png"}
					width={25}
					height={25}
					alt="leaf"
					className="scale-x-[-1]"
				/>
				)
			</button>

			{/* divider */}
			<div className="flex items-center gap-2">
				<div className="h-px bg-secondary-foreground/50 w-full"></div>
				<p className="text-stone-500">{t("or")}</p>
				<div className="h-px bg-secondary-foreground/50 w-full"></div>
			</div>

			{/* social login */}
			<div className="flex justify-evenly items-center my-4 text-4xl text-secondary-foreground ">
				<button
					onClick={async () => await signIn("google")}
					className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
				>
					<FaGoogle />
				</button>
				<Link
					href={"#"}
					className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
				>
					<FaFacebookF />
				</Link>
				<Link
					href={"#"}
					className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
				>
					<FaApple />
				</Link>
				<Link
					href={"#"}
					className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
				>
					<FaTwitter />
				</Link>
			</div>
			<p className="text-center text-stone-600 space-x-1 sm:hidden ">
				<span>{t("newToEcosphere")}</span>
				<button onClick={handleToggle} className="text-primary cursor-pointer">
					{t("signUp")}
				</button>
			</p>
		</div>
	);
};

export default LogIn;
