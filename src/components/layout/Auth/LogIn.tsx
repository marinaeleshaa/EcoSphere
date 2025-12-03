import { toggleAuthView } from "@/frontend/redux/Slice/AuthSlice";
import { AppDispatch, RootState } from "@/frontend/redux/store";
import Link from "next/link";
import Image from "next/image";
import { FaApple, FaFacebookF, FaGoogle, FaTwitter } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from 'next-intl';

const LogIn = () => {
  const t = useTranslations('Auth.login');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    dispatch(toggleAuthView());
  };

  const handleLogin = async () => {
    if (!email || !password) return;

    await signIn("credentials", { email, password, redirectTo: "/" });
  };

  return (
    <div className="flex sm:flex gap-5 flex-col">
      <p className="capitalize text-center font-extrabold mb-5 text-secondary-foreground text-4xl">
        {t('title')}
      </p>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="email"
        placeholder={t('email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-input text-input-foreground w-full p-3 rounded-full transition duration-300 focus:outline-none pl-10 pr-12"
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
      <Link href="#">
        <div className="flex justify-end px-5">
          <div className="flex gap-1 justify-center items-center text-sm group cursor-pointer">
            <p className="text-secondary-foreground transition-all duration-300 ">
              {t('forgetPassword')}
            </p>
            <IoIosArrowRoundForward className=" transform transition-all duration-300 ease-out group-hover:translate-x-1 " />
          </div>
        </div>
      </Link>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4 disabled:opacity-50"
      >
        {loading ? t('title') + "..." : t('title')}
        {!loading && (
          <Image
            src={"/leaf.png"}
            width={25}
            height={25}
            alt="leaf"
            className="scale-x-[-1]"
          />
        )}
      </button>

      {/* divider */}
      <div className="flex items-center gap-2">
        <div className="h-px bg-secondary-foreground/50 w-full"></div>
        <p className="text-stone-500">{t('or')}</p>
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
        <span>{t('newToEcosphere')}</span>
        <button
          onClick={handleToggle}
          className="text-primary cursor-pointer"
        >
          {t('signUp')}
        </button>
      </p>
    </div>
  );
};

export default LogIn;
