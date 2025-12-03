import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "motion/react";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={cn("relative p-2.5 group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-1 opacity-20 group-hover:opacity-30 blur-lg  transition duration-500 will-change-transform",
          " bg-[radial-gradient(circle_farthest-side_at_0%_100%,#99bc88,transparent),radial-gradient(circle_farthest-side_at_100%_0%,#739563,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#39592c,transparent),radial-gradient(circle_farthest-side_at_0%_0%,#91b480,transparent)]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-3xl z-1 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0%_100%,#99bc88,transparent),radial-gradient(circle_farthest-side_at_100%_0%,#739563,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#39592c,transparent),radial-gradient(circle_farthest-side_at_0%_0%,#91b480,transparent)]"
        )}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
