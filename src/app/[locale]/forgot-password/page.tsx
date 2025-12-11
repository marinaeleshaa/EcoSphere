"use client";

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import EmailVerification from "@/components/layout/ForgotPassword/EmailVerification";
import ResetPassword from "@/components/layout/ForgotPassword/ResetPassword";
import { getCoords, ICoords } from "@/components/layout/Auth/GetCoords";
import { useTranslations } from "next-intl";


const ForgotPasswordPage = () => {
  const t = useTranslations("Auth.forgotPassword.sidePanel");
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

  const [step, setStep] = useState<"reset" | "verification">("reset");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const updateCoords = () => {
      const width = window.innerWidth;
      setCoords(getCoords(width));
    };

    updateCoords();
    window.addEventListener("resize", updateCoords);

    // small entrance animation
    controls.start({ x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } });

    return () => window.removeEventListener("resize", updateCoords);
  }, [controls]);

  const divVariants = {
    reset: { opacity: 1, x: coords.loginX, y: -1500, rotate: 360 },
    verification: { opacity: 1, x: coords.registerX, y: -1500, rotate: 360 },
  };

  const formVariants = {
    reset: { opacity: 1, x: 0 },
    verification: { opacity: 1, x: 0 },
  };

  const imgLoginVariants = {
    reset: { opacity: 1, x: coords.loginImgX, y: coords.loginImgY },
    verification: { opacity: 0, x: -1850 },
  };

  const imgSignupVariants = {
    reset: { opacity: 0, x: 1850 },
    verification: { opacity: 1, x: coords.signupImgX },
  };

  const toResetVariants = {
    reset: { opacity: 1, x: coords.toSignUpX },
    verification: { opacity: 0, x: -1850 },
  };
  const toVerificationVariants = {
    reset: { opacity: 0, x: 1850 },
    verification: { opacity: 1, x: coords.toSignInX },
  };

  // mobile div animation sequence (reuse same feel as auth page)
  useEffect(() => {
    const sequence = async () => {
      if (step === "reset") {
        await controls.start({ width: "0px", left: 0, right: "auto", transition: { duration: 0 } });
        await controls.start({ width: "100%", transition: { duration: 0.8, ease: "easeInOut" } });
        await controls.start({ width: "0px", left: 0, right: "auto", transition: { duration: 1, ease: "easeInOut" } });
      } else {
        await controls.start({ width: "0px", left: "auto", right: 0, transition: { duration: 0 } });
        await controls.start({ width: "100%", transition: { duration: 0.8, ease: "easeInOut" } });
        await controls.start({ width: "0px", left: "auto", right: 0, transition: { duration: 1, ease: "easeInOut" } });
      }
    };
    sequence();
  }, [step, controls]);

  const handlePasswordReset = (resetEmail: string) => {
    setEmail(resetEmail);
    setStep("verification");
  };

  const handleVerificationSent = () => {
    // user confirmed verification - return to reset or navigate elsewhere
    setStep("reset");
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="w-[80%] m-auto">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center min-h-screen  ">
          {/* verification form */}
          <motion.div
            className={`flex sm:flex  flex-col lg:w-[40%] md:w-[50%] h-full  w-full ${step === "reset" ? "hidden" : ""}`}
            variants={formVariants}
            initial={false}
            animate={step === "verification" ? "verification" : { opacity: 0, x: 100 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <EmailVerification email={email} onVerificationSent={handleVerificationSent} isLoading={false} />
          </motion.div>

          {/* reset form */}
          <motion.div
            className={`flex sm:flex gap-5 flex-col p-5 lg:w-[45%] md:w-[50%] w-full rounded-2xl ${step === "verification" ? "hidden" : ""} `}
            variants={formVariants}
            animate={step === "reset" ? "reset" : { opacity: 0, x: -200 }}
            initial={false}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <ResetPassword onPasswordReset={handlePasswordReset} isLoading={false} error="" />
          </motion.div>
        </div>
      </div>

      {/* animated background div */}
      <motion.div
        className="  w-[1700px] h-[1700px] rounded-full bg-primary hidden sm:block absolute "
        variants={divVariants}
        animate={step}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      ></motion.div>

      {/* animated background for mobile */}
      <motion.div className="absolute  h-screen bg-primary sm:hidden top-0 left-0" initial={false} animate={controls} transition={{ duration: 2, delay: 0.5 }}>
        <Image src="/logo.png" width={250} height={250} alt="forgot" className="absolute  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] " />
      </motion.div>

      <motion.img
        src="/forgot-password.png"
        width={300}
        height={350}
        alt="forgot-password"
        className="sm:absolute sm:block hidden absolute bottom-50 right-0 sm:-right-2 md:-right-10 lg:right-10 xl:-right-10 xl:w-[350px] "
        variants={imgLoginVariants}
        initial={false}
        animate={step}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.img
        src="/verify-email.png"
        width={350}
        height={400}
        alt="verify-email"
        className="sm:absolute sm:block hidden absolute bottom-0 right-0 md:w-[320px] md:h-[300px] lg:w-[450px] lg:h-[350px] "
        variants={imgSignupVariants}
        initial={false}
        animate={step}
        transition={{ duration: 2, delay: 0.5 }}
      />

      <motion.div className="hidden sm:absolute top-30 left-0 md:left-30 lg:left-20  min-w-60  sm:flex flex-col gap-5 p-5 justify-center text-center text-primary-foreground  " variants={toResetVariants} animate={step} initial={false} transition={{ duration: 2, delay: 0.5 }}>
        <h2 className="text-2xl lg:text-2xl xl:text-3xl font-extrabold">{t('checkEmailTitle')}</h2>
        <p className="text-base lg:text-lg xl:text-xl">{t('checkEmailDescription')}</p>
      </motion.div>

      <motion.div className=" hidden sm:absolute top-50 right-10 md:right-30 lg:top-40 lg:right-10 xl:right-30 xl:top-30 min-w-60  sm:flex flex-col gap-5 p-5 justify-center text-center text-primary-foreground  " variants={toVerificationVariants} animate={step} initial={false} transition={{ duration: 2, delay: 0.5 }}>
        <h2 className="text-2xl lg:text-xl xl:text-5xl font-extrabold">{t('resetTitle')}</h2>
        <p className="text-sm lg:text-xl xl:text-2xl">{t('resetDescription')}</p>
      </motion.div>
    </section>
  );
};

export default ForgotPasswordPage;
