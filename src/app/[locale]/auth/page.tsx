"use client";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SignUp from "@/components/layout/Auth/SignUp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/frontend/redux/store";
import { toggleAuthView } from "@/frontend/redux/Slice/AuthSlice";
import LogIn from "@/components/layout/Auth/LogIn";
import { getCoords, ICoords } from "@/components/layout/Auth/GetCoords";
import { useTranslations, useLocale } from "next-intl";

const AuthPage = () => {
  const t = useTranslations("Auth.page");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const rtlMultiplier = isRTL ? -1 : 1;

  const { active } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const controls = useAnimation();

  const [coords, setCoords] = useState<ICoords>({
    loginX: -1000,
    registerX: 800,
    loginImgX: -1000,
    loginImgY: 200,
    signupImgX: 1000,
    signupImgY: 200,
    toSignUpX: 0,
    toSignInX: 0,
  });

  useEffect(() => {
    const updateCoords = () => {
      const width = window.innerWidth;

      setCoords(getCoords(width));
    };

    updateCoords();
    window.addEventListener("resize", updateCoords);

    return () => window.removeEventListener("resize", updateCoords);
  }, []);

  const divVariants = {
    login: {
      opacity: 1,
      x: coords.loginX * rtlMultiplier,
      y: -1500,
      rotate: 360,
    },
    register: {
      opacity: 1,
      x: coords.registerX * rtlMultiplier,
      y: -1500,
      rotate: 360,
    },
  };

  const formVariants = {
    login: { opacity: 1, x: 0 },
    register: { opacity: 1, x: 0 },
  };

  const imgLoginVariants = {
    login: {
      opacity: 1,
      x: coords.loginImgX * rtlMultiplier,
      y: coords.loginImgY,
    },
    register: { opacity: 0, x: -1850 * rtlMultiplier },
  };

  const imgSignupVariants = {
    login: { opacity: 0, x: 1850 * rtlMultiplier },
    register: { opacity: 1, x: coords.signupImgX * rtlMultiplier },
  };
  const toSignUpVariants = {
    login: { opacity: 1, x: coords.toSignUpX * rtlMultiplier },
    register: { opacity: 0, x: -1850 * rtlMultiplier },
  };
  const toSignInVariants = {
    login: { opacity: 0, x: 1850 * rtlMultiplier },
    register: { opacity: 1, x: coords.toSignInX * rtlMultiplier },
  };

  // Animation for mobile div
  useEffect(() => {
    const sequence = async () => {
      if (active === "login") {
        await controls.start({
          width: "0px",
          left: isRTL ? "auto" : 0,
          right: isRTL ? 0 : "auto",
          transition: { duration: 0 },
        });
        await controls.start({
          width: "100%",
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        await controls.start({
          width: "0px",
          left: isRTL ? "auto" : 0,
          right: isRTL ? 0 : "auto",
          transition: { duration: 1, ease: "easeInOut" },
        });
      } else {
        await controls.start({
          width: "0px",
          left: isRTL ? 0 : "auto",
          right: isRTL ? "auto" : 0,
          transition: { duration: 0 },
        });
        await controls.start({
          width: "100%",
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        await controls.start({
          width: "0px",
          left: isRTL ? 0 : "auto",
          right: isRTL ? "auto" : 0,
          transition: { duration: 1, ease: "easeInOut" },
        });
      }
    };
    sequence();
  }, [active, controls, isRTL]);
  const handleToggle = () => {
    dispatch(toggleAuthView());
  };
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="w-[80%] m-auto">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center min-h-screen  ">
          {/* register form */}
          <motion.div
            className={`flex sm:flex  flex-col lg:w-[40%] md:w-[50%] h-full  w-full ${
              active === "login" ? "hidden" : ""
            }`}
            variants={formVariants}
            initial={false}
            animate={
              active === "register"
                ? "register"
                : { opacity: 0, x: 100 * rtlMultiplier }
            }
            transition={{ duration: 2, delay: 0.5 }}
          >
            <SignUp />
          </motion.div>

          {/* login form */}
          <motion.div
            className={`flex sm:flex gap-5 flex-col p-5 lg:w-[45%] md:w-[50%] w-full rounded-2xl ${
              active === "register" ? "hidden" : ""
            } `}
            variants={formVariants}
            animate={
              active === "login"
                ? "login"
                : { opacity: 0, x: -200 * rtlMultiplier }
            }
            initial={false}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <LogIn />
          </motion.div>
        </div>
      </div>

      {/* animated background div */}
      <motion.div
        className="  w-[1700px] h-[1700px] rounded-full bg-primary hidden sm:block absolute "
        variants={divVariants}
        animate={active}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      ></motion.div>
      {/* animated background for mobile */}
      <motion.div
        className={`absolute  h-screen bg-primary sm:hidden top-0 ${
          isRTL ? "right-0" : "left-0"
        }`}
        initial={false}
        animate={controls}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <Image
          src="/logo.png"
          width={250}
          height={250}
          alt="login"
          className="absolute  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] "
        />
      </motion.div>
      <motion.img
        src="/login.png"
        width={300}
        height={350}
        alt="login"
        className={`sm:absolute sm:block hidden absolute bottom-50 ${
          isRTL
            ? "left-0 sm:-left-2 md:-left-10 lg:left-10 xl:-left-10"
            : "right-0 sm:-right-2 md:-right-10 lg:right-10 xl:-right-10"
        } xl:w-[350px] `}
        variants={imgLoginVariants}
        initial={false}
        animate={active}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.img
        src="/signup.png"
        width={350}
        height={400}
        alt="signup"
        className={`sm:absolute sm:block hidden absolute bottom-0 ${
          isRTL ? "left-0" : "right-0"
        } md:w-[320px] md:h-[300px] lg:w-[450px] lg:h-[350px] `}
        variants={imgSignupVariants}
        initial={false}
        animate={active}
        transition={{ duration: 2, delay: 0.5 }}
      />
      {/* to sign up */}
      <motion.div
        className={`hidden sm:absolute top-30 ${
          isRTL
            ? "right-0 md:right-30 lg:right-20"
            : "left-0 md:left-30 lg:left-20"
        }  min-w-60  sm:flex flex-col gap-5 p-5 justify-center text-center text-primary-foreground  `}
        variants={toSignUpVariants}
        animate={active}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <h2 className="text-2xl lg:text-2xl xl:text-3xl font-extrabold">
          {t("newToEcosphere")}
        </h2>
        <p className="text-base lg:text-lg xl:text-xl">{t("signUpText")}</p>
        <motion.button
          onClick={handleToggle}
          className="cursor-pointer  text-primary-foreground border-2 border-background  p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary-foreground hover:bg-background hover:text-primary hover:outline-offset-4 "
        >
          {t("signUp")}
        </motion.button>
      </motion.div>
      {/* to sign in */}
      <motion.div
        className={` hidden sm:absolute top-50 ${
          isRTL
            ? "left-10 md:left-30 lg:left-10 xl:left-30"
            : "right-10 md:right-30 lg:right-10 xl:right-30"
        } lg:top-40 xl:top-30 min-w-60  sm:flex flex-col gap-5 p-5 justify-center text-center text-primary-foreground  `}
        variants={toSignInVariants}
        animate={active}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <h2 className="text-2xl lg:text-xl xl:text-5xl font-extrabold">
          {t("oneOfUs")}
        </h2>
        <p className="text-sm lg:text-xl xl:text-2xl">{t("signInText")}</p>
        <motion.button
          onClick={handleToggle}
          className="cursor-pointer  text-primary-foreground border-2 border-background  p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary-foreground  hover:bg-background hover:text-primary hover:outline-offset-4 "
        >
          {t("signIn")}
        </motion.button>
      </motion.div>
    </section>
  );
};

export default AuthPage;
