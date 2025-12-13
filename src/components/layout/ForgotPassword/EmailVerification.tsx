"use client";

import { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface EmailVerificationProps {
  email: string;
  setEmail: (email: string) => void;
  onVerified: () => void;
}

export default function EmailVerification({
  email,
  setEmail,
  onVerified,
}: EmailVerificationProps) {
  const [emailValid, setEmailValid] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [userCode, setUserCode] = useState(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");

  const handleSendCode = () => {
    if (!emailValid) return;
    
    // Simulate sending code (backend would handle this)
    console.log("Code sent to:", email);
    setCodeSent(true);
  };

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...userCode];
    updated[index] = value;
    setUserCode(updated);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !userCode[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const verifyCode = () => {
    const code = userCode.join("");
    
    if (code.length !== 6) {
      setCodeError("Please enter all 6 digits.");
      return;
    }
    
    // Accept any 6 digits for now
    setCodeError("");
    onVerified();
  };

  const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <AnimatePresence mode="wait">
      {!codeSent ? (
        // Step 1: Email Input
        <motion.div
          key="email"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-extrabold text-3xl text-foreground">Verify Email</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Enter your email address and we&apos;ll send you a 6-digit verification code.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
              }}
              className={`bg-input text-input-foreground p-3 rounded-full w-full border-2 transition focus:outline-none focus:border-primary ${
                email && !emailValid ? "border-red-500" : "border-border"
              }`}
            />

            <button
              disabled={!emailValid}
              onClick={handleSendCode}
              className="bg-primary text-primary-foreground font-bold p-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
            >
              Send Code <IoIosArrowRoundForward className="text-2xl" />
            </button>

            <Link href="/auth">
              <button className="w-full bg-secondary text-secondary-foreground font-semibold p-3 rounded-full hover:scale-105 transition-all">
                Back to Login
              </button>
            </Link>
          </div>
        </motion.div>
      ) : (
        // Step 2: Code Verification
        <motion.div
          key="verify"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-extrabold text-3xl text-foreground">Enter Code</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              We&apos;ve sent a 6-digit code to{" "}
              <span className="font-bold text-primary">{email}</span>
            </p>
          </div>

          <div className="flex gap-2 justify-center my-4">
            {userCode.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-14 text-center text-2xl font-bold bg-input text-input-foreground rounded-xl border-2 border-border focus:border-primary outline-none transition"
              />
            ))}
          </div>

          {codeError && (
            <p className="text-destructive text-center text-sm font-semibold bg-destructive/10 p-2 rounded-lg">
              {codeError}
            </p>
          )}

          <button
            disabled={userCode.join("").length !== 6}
            onClick={verifyCode}
            className="bg-primary text-primary-foreground font-bold p-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
          >
            Verify Code <IoIosArrowRoundForward className="text-2xl" />
          </button>

          <button
            onClick={() => {
              setCodeSent(false);
              setUserCode(["", "", "", "", "", ""]);
              setCodeError("");
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition underline"
          >
            Change Email
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}