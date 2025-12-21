import { MotionContainer } from "@/components/layout/PaymentVerification/MotionContainer";
import { MotionItem } from "@/components/layout/PaymentVerification/MotionItem";
import { MotionScaleIn } from "@/components/layout/PaymentVerification/MotionScaleIn";
import { X, RefreshCcw, AlertOctagon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PaymentFailedClient } from "@/components/layout/payment/PaymentFailedClient";
import Link from "next/link";

interface PaymentFailureProps {
  searchParams: Promise<{ orderId?: string; errorCode?: string; errorMessage?: string }>;
}

export default async function PaymentFailure({ searchParams }: PaymentFailureProps) {
  const t = await getTranslations("Checkout.verification");
  const params = await searchParams;
  const { orderId, errorCode, errorMessage } = params;

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6">
      <MotionContainer className="w-full max-w-[90%] sm:max-w-md p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border-4 border-accent-foreground/20 relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          {/* Error Icon */}
          <div className="relative">
            <MotionScaleIn
              variant="shake"
              className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-accent-foreground/30 shadow-lg"
            >
              <X
                className="w-10 h-10 sm:w-10 sm:h-10 text-accent-foreground"
                strokeWidth={5}
              />
            </MotionScaleIn>
            <div className="absolute -bottom-2 -right-2 bg-primary/10 rounded-full p-1.5 sm:p-2 shadow-md border-2 border-accent-foreground/20">
              <AlertOctagon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-foreground/80" />
            </div>
          </div>

          {/* Text */}
          <MotionItem className="space-y-2 sm:space-y-3 px-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-accent-foreground">
              {t("failedTitle")}
            </h2>
            <p className="text-accent-foreground/70 font-medium text-base sm:text-lg leading-relaxed">
              {t("failedDesc")}
            </p>
          </MotionItem>

          {/* Error Details - Client component will display error info from URL params */}
          <PaymentFailedClient orderId={orderId} errorCode={errorCode} errorMessage={errorMessage} />

          {/* Action */}
          <MotionItem className="w-full space-y-3">
            <Link href="/checkout" className="myBtnPrimary w-full flex items-center justify-center gap-2">
              {t("tryAgain")}
              <RefreshCcw className="w-4 h-4" />
            </Link>
          </MotionItem>
        </div>
      </MotionContainer>
    </div>
  );
}
