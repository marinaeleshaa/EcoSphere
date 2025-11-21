"use client";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaGoogle, FaFacebookF, FaApple, FaTwitter } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";

const AuthPage = () => {
  const [active, setActive] = useState<"login" | "register">("login");

  const controls = useAnimation();

  const getCoords = (width: number, height: number) => {
    const percentWidth = width / 5;

    // xs screen < 640px
    if (width < 640) {
      return {
        // circle (unchanged)
        loginX: -percentWidth * 2,
        registerX: 100,

        // images
        loginImgX: -450,
        loginImgY: 120,

        signupImgX: 1200,
        signupImgY: 150,

        // text panels
        toSignUpX: 0,
        toSignInX: 1500,
      };
    }

    // sm screen < 768
    if (width < 768) {
      return {
        loginX: -1350,
        registerX: 360,

        loginImgX: -350,
        loginImgY: 200,

        signupImgX: 0,
        signupImgY: 0,

        toSignUpX: 0,
        toSignInX: 0,
      };
    }

    // md screen < 1024
    if (width < 1024) {
      return {
        loginX: -1350,
        registerX: 400,

        loginImgX: -510,
        loginImgY: 200,

        signupImgX: 0,
        signupImgY: 0,

        toSignUpX: -100,
        toSignInX: 70,
      };
    }

    // lg screen < 1280
    if (width < 1280) {
      return {
        loginX: -1200,
        registerX: 600,

        loginImgX: -600,
        loginImgY: 200,

        signupImgX: -70,
        signupImgY: 200,

        toSignUpX: 0,
        toSignInX: 0,
      };
    }

    // xl screen
    if (width < 1535) {
      return {
        loginX: -1100,
        registerX: 600,

        loginImgX: -750,
        loginImgY: 200,

        signupImgX: -190,
        signupImgY: 200,

        toSignUpX: 0,
        toSignInX: 0,
      };
    }

    // 2xl+
    return {
      loginX: -1000,
      registerX: 800,

      loginImgX: -1000,
      loginImgY: 200,

      signupImgX: -190,
      signupImgY: 200,

      toSignUpX: 0,
      toSignInX: 0,
    };
  };

  const [coords, setCoords] = useState<{
    loginX: number;
    registerX: number;
    loginImgX: number;
    loginImgY: number;
    signupImgX: number;
    signupImgY: number;
    toSignUpX: number;
    toSignInX: number;
  }>({
    loginX: -1000,
    registerX: 800,
    loginImgX: -1000,
    loginImgY: 200,
    signupImgX: 1000,
    signupImgY: 200,
    toSignUpX: 0,
    toSignInX: 0,
  });
  
  getCoords(window.innerWidth, window.innerHeight);
  useEffect(() => {
    const updateCoords = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setCoords(getCoords(width, height));
    };

    updateCoords();
    window.addEventListener("resize", updateCoords);

    return () => window.removeEventListener("resize", updateCoords);
  }, []);

  const divVariants = {
    login: { opacity: 1, x: coords.loginX, y: -1500, rotate: 360 },
    register: {
      opacity: 1,
      x: coords.registerX,
      y: -1500,
      rotate: 360,
    },
  };

  const formVariants = {
    login: { opacity: 1, x: 0 },
    register: { opacity: 1, x: 0 },
  };

  const imgLoginVariants = {
    login: { opacity: 1, x: coords.loginImgX, y: coords.loginImgY },
    register: { opacity: 0, x: -1850 },
  };

  const imgSignupVariants = {
    login: { opacity: 0, x: 1850 },
    register: { opacity: 1, x: coords.signupImgX },
  };
  const toSignUpVariants = {
    login: { opacity: 1, x: coords.toSignUpX },
    register: { opacity: 0, x: -1850 },
  };
  const toSignInVariants = {
    login: { opacity: 0, x: 1850 },
    register: { opacity: 1, x: coords.toSignInX },
  };

  // Animation for mobile div
  useEffect(() => {
    const sequence = async () => {
      if (active === "login") {
        await controls.start({
          width: "0px",
          left: 0,
          right: "auto",
          transition: { duration: 0 },
        });
        await controls.start({
          width: "100%",
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        await controls.start({
          width: "0px",
          left: 0,
          right: "auto",
          transition: { duration: 1, ease: "easeInOut" },
        });
      } else {
        await controls.start({
          width: "0px",
          left: "auto",
          right: 0,
          transition: { duration: 0 },
        });
        await controls.start({
          width: "100%",
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        await controls.start({
          width: "0px",
          left: "auto",
          right: 0,
          transition: { duration: 1, ease: "easeInOut" },
        });
      }
    };
    sequence();
  }, [active, controls]);

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="w-[80%] m-auto">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center min-h-screen  ">
          {/* register form */}
          <motion.div
            className={`flex sm:flex gap-5 flex-col p-5 lg:w-[40%] md:w-[50%]    w-full ${
              active === "login" ? "hidden" : ""
            }`}
            variants={formVariants}
            initial={false}
            animate={
              active === "register" ? "register" : { opacity: 0, x: 100 }
            }
            transition={{ duration: 2, delay: 0.5 }}
          >
            <p className="capitalize text-center font-extrabold text-secondary-foreground text-4xl">
              sign up
            </p>
            <input
              type="text"
              placeholder="Username"
              className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
            />
            <button className="bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4">
              <Image src={"/leaf.png"} width={25} height={25} alt="leaf" />
              Sign up
            </button>
            <p className="text-center text-stone-700  space-x-1 sm:hidden ">
              <span>One of us ?</span>
              <button
                onClick={() => setActive("login")}
                className="text-primary cursor-pointer"
              >
                Login
              </button>
            </p>
          </motion.div>

          {/* login form */}
          <motion.div
            className={`flex sm:flex gap-5 flex-col p-5 lg:w-[45%] md:w-[50%] w-full rounded-2xl ${
              active === "register" ? "hidden" : ""
            } `}
            variants={formVariants}
            animate={active === "login" ? "login" : { opacity: 0, x: -200 }}
            initial={false}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <p className="capitalize text-center font-extrabold mb-5 text-secondary-foreground text-4xl">
              Login
            </p>

            <input
              type="email"
              placeholder="Email"
              className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="bg-input text-input-foreground w-full p-3 rounded-full transition duration-300 focus:outline-none pl-10"
              />
            </div>
            {/* forget password */}
            <Link href="#">
              <div className="flex justify-end px-5">
                <div className="flex gap-1 justify-center items-center text-sm group cursor-pointer">
                  <p className="text-secondary-foreground transition-all duration-300 ">
                    Forget Password
                  </p>
                  <IoIosArrowRoundForward className=" transform transition-all duration-300 ease-out group-hover:translate-x-1 " />
                </div>
              </div>
            </Link>

            <button className="bg-primary text-primary-foreground p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary hover:outline-offset-4">
              Login
              <Image
                src={"/leaf.png"}
                width={25}
                height={25}
                alt="leaf"
                className="scale-x-[-1]"
              />
            </button>

            {/* divider */}
            <div className="flex items-center gap-2">
              <div className="h-px bg-secondary-foreground/50 w-full"></div>
              <p className="text-stone-500">or</p>
              <div className="h-px bg-secondary-foreground/50 w-full"></div>
            </div>

            {/* social login */}
            <div className="flex justify-evenly items-center my-4 text-4xl text-secondary-foreground ">
              <Link
                href={"#"}
                className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
              >
                <FaGoogle />
              </Link>
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
              <span>New to EcoSphere ?</span>
              <button
                onClick={() => setActive("register")}
                className="text-primary cursor-pointer"
              >
                Sign up
              </button>
            </p>
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
        className="absolute  h-screen bg-primary sm:hidden top-0 left-0"
        initial={false}
        animate={controls}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <Image
          src="/leaf.png"
          width={250}
          height={250}
          alt="login"
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] "
        />
      </motion.div>
      <motion.img
        src="/login.png"
        width={300}
        height={350}
        alt="login"
        className="sm:absolute sm:block hidden absolute bottom-50 right-0 sm:-right-2 md:-right-10 lg:right-10 xl:-right-10 xl:w-[350px] "
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
        className="sm:absolute sm:block hidden absolute bottom-0 right-0 md:w-[320px] md:h-[300px] lg:w-[450px] lg:h-[350px] "
        variants={imgSignupVariants}
        initial={false}
        animate={active}
        transition={{ duration: 2, delay: 0.5 }}
      />
      {/* to sign up */}
      <motion.div
        className="hidden sm:absolute top-30 left-0 md:left-30 lg:left-20  min-w-60  sm:flex flex-col gap-5 p-5 justify-center text-center text-primary-foreground  "
        variants={toSignUpVariants}
        animate={active}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <h2 className="text-2xl lg:text-2xl xl:text-3xl font-extrabold">
          New to Ecosphere?
        </h2>
        <p className="text-base lg:text-lg xl:text-xl">
          sign up to get started with Ecosphere
        </p>
        <motion.button
          onClick={() => setActive(active === "login" ? "register" : "login")}
          className="cursor-pointer  text-primary-foreground border-2 border-background  p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary-foreground hover:bg-background hover:text-primary hover:outline-offset-4 "
        >
          Sign Up
        </motion.button>
      </motion.div>
      {/* to sign in */}
      <motion.div
        className=" hidden sm:absolute top-50 right-10 md:right-30 lg:top-40 lg:right-10 xl:right-30 xl:top-30 min-w-60  sm:flex flex-col gap-5 p-5 justify-center text-center text-primary-foreground  "
        variants={toSignInVariants}
        animate={active}
        initial={false}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <h2 className="text-2xl lg:text-xl xl:text-5xl font-extrabold">
          One Of Us?
        </h2>
        <p className="text-sm lg:text-xl xl:text-2xl">
          we are happy to see you back
        </p>
        <motion.button
          onClick={() => setActive(active === "login" ? "register" : "login")}
          className="cursor-pointer  text-primary-foreground border-2 border-background  p-3 rounded-full transition duration-400 hover:scale-102 flex justify-center items-center text-lg gap-2 hover:outline-2 hover:outline-primary-foreground  hover:bg-background hover:text-primary hover:outline-offset-4 "
        >
          Sign In
        </motion.button>
      </motion.div>
    </section>
  );
};

export default AuthPage;
