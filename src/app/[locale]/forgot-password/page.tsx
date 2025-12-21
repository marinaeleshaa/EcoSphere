"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import EmailVerification from "@/components/layout/ForgotPassword/EmailVerification";
import ResetPassword from "@/components/layout/ForgotPassword/ResetPassword";
import { getCoords, ICoords } from "@/components/layout/Auth/GetCoords";
import { useTranslations, useLocale } from "next-intl";
import { resetPassword } from "@/frontend/api/Users";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const t = useTranslations("ForgotPassword");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const rtlMultiplier = isRTL ? -1 : 1;
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

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");

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
    email: {
      opacity: 1,
      x: coords.loginX * rtlMultiplier,
      y: -1500,
      rotate: 360,
    },
    reset: {
      opacity: 1,
      x: coords.registerX * rtlMultiplier,
      y: -1500,
      rotate: 360,
    },
  };

  const formVariants = {
    email: { opacity: 1, x: 0 },
    reset: { opacity: 1, x: 0 },
  };

  const imgLoginVariants = {
    email: {
      opacity: 1,
      x: coords.loginImgX * rtlMultiplier,
      y: coords.loginImgY,
    },
    reset: { opacity: 0, x: -1850 * rtlMultiplier },
  };

  const imgSignupVariants = {
    email: { opacity: 0, x: 1850 * rtlMultiplier },
    reset: { opacity: 1, x: coords.signupImgX * rtlMultiplier },
  };

  const toEmailVariants = {
    email: { opacity: 1, x: coords.toSignUpX * rtlMultiplier },
    reset: { opacity: 0, x: -1850 * rtlMultiplier },
  };

  const toResetVariants = {
    email: { opacity: 0, x: 1850 * rtlMultiplier },
    reset: { opacity: 1, x: coords.toSignInX * rtlMultiplier },
  };

  useEffect(() => {
    const sequence = async () => {
      if (step === "email") {
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
  }, [step, controls]);

  const handleEmailVerified = () => {
    setStep("reset");
  };

  const handlePasswordResetComplete = async (newPassword: string) => {
    try {
      await resetPassword(email, newPassword);
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error(t("resetStep.errors.resetFailed"));
    }
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="w-[80%] m-auto relative z-10">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center min-h-screen">
          {/* Reset Password Form - Shows on LEFT */}
          <motion.div
            className={`flex sm:flex gap-5 flex-col p-5 lg:w-[45%] md:w-[50%] w-full rounded-2xl ${
              step === "email" ? "hidden" : ""
            }`}
            variants={formVariants}
            animate={
              step === "reset"
                ? "reset"
                : { opacity: 0, x: -200 * rtlMultiplier }
            }
            initial={false}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <ResetPassword onPasswordReset={handlePasswordResetComplete} />
          </motion.div>

          {/* Email Verification Form - Shows on RIGHT */}
          <motion.div
            className={`flex sm:flex flex-col lg:w-[40%] md:w-[50%] h-full w-full ${
              step === "reset" ? "hidden" : ""
            }`}
            variants={formVariants}
            initial={false}
            animate={
              step === "email"
                ? "email"
                : { opacity: 0, x: 100 * rtlMultiplier }
            }
            transition={{ duration: 2, delay: 0.5 }}
          >
            <EmailVerification
              email={email}
              setEmail={setEmail}
              onVerified={handleEmailVerified}
            />
          </motion.div>
        </div>
      </div>

      {/* Animated background div */}
      <motion.div
        className="w-[1700px] h-[1700px] rounded-full bg-primary hidden sm:block absolute"
        variants={divVariants}
        animate={step}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Animated background for mobile */}
      <motion.div
        className={`absolute h-screen bg-primary sm:hidden top-0 ${
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
          alt={t("logoAlt")}
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        />
      </motion.div>

      {/* Forgot Password Image */}
      <motion.img
        src="/forgot-password.png"
        width={300}
        height={350}
        alt={t("forgotPasswordImageAlt")}
        className={`sm:absolute sm:block hidden absolute bottom-50 ${
          isRTL
            ? "left-0 sm:-left-2 md:-left-10 lg:left-10 xl:-left-10"
            : "right-0 sm:-right-2 md:-right-10 lg:right-10 xl:-right-10"
        } xl:w-[350px]`}
        variants={imgLoginVariants}
        initial={false}
        animate={step}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Verify Email Image */}
      <motion.img
        src="/verify-email.png"
        width={350}
        height={400}
        alt={t("verifyEmailImageAlt")}
        className={`sm:absolute sm:block hidden absolute bottom-0 ${
          isRTL ? "left-0" : "right-0"
        } md:w-[320px] md:h-[300px] lg:w-[450px] lg:h-[350px]`}
        variants={imgSignupVariants}
        initial={false}
        animate={step}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Text overlay - Email step */}
      <motion.div
        className={`hidden sm:absolute top-30 ${
          isRTL
            ? "right-0 md:right-30 lg:right-20"
            : "left-0 md:left-30 lg:left-20"
        } min-w-60 sm:flex flex-col gap-5 p-5 justify-center text-center text-primary-foreground`}
        variants={toEmailVariants}
        animate={step}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <h2 className="text-2xl lg:text-2xl xl:text-3xl font-extrabold">
          {t("emailStep.title")}
        </h2>
        <p className="text-base lg:text-lg xl:text-xl">
          {t("emailStep.description")}
        </p>
      </motion.div>

      {/* Text overlay - Reset step */}
      <motion.div
        className={`hidden sm:absolute top-50 ${
          isRTL
            ? "left-10 md:left-30 lg:left-10 xl:left-30"
            : "right-10 md:right-30 lg:right-10 xl:right-30"
        } lg:top-40 xl:top-30 min-w-60 sm:flex flex-col gap-5 p-5 justify-center text-center text-primary-foreground`}
        variants={toResetVariants}
        animate={step}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <h2 className="text-2xl lg:text-xl xl:text-5xl font-extrabold">
          {t("resetStep.title")}
        </h2>
        <p className="text-sm lg:text-xl xl:text-2xl">
          {t("resetStep.description")}
        </p>
      </motion.div>
    </section>
  );
};

export default ForgotPasswordPage;
