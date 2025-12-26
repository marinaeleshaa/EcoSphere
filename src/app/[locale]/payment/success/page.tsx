import { Check, Home, Leaf, Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MotionContainer } from "@/components/layout/PaymentVerification/MotionContainer";
import { MotionItem } from "@/components/layout/PaymentVerification/MotionItem";
import { MotionLeaf } from "@/components/layout/PaymentVerification/MotionLeaf";
import { MotionScaleIn } from "@/components/layout/PaymentVerification/MotionScaleIn";
import { PaymentSuccessClient } from "@/components/layout/payment/PaymentSuccessClient";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PaymentSuccessProps {
  searchParams: Promise<{ orderId?: string; paymentIntentId?: string }>;
}

export default async function PaymentSuccess({
  searchParams,
}: PaymentSuccessProps) {
  const t = await getTranslations("Checkout.verification");
  const params = await searchParams;
  const { orderId, paymentIntentId } = params;

  if (!orderId) {
    // If no orderId, redirect to home or show error
    redirect("/");
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <MotionContainer className="w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Success Icon Group */}
          <div className="relative">
            <MotionScaleIn
              className="w-24 h-24 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner border border-accent-foreground/30"
              variant={""}
            >
              <Check
                className="w-12 h-12 text-accent-foreground drop-shadow-sm"
                strokeWidth={3}
              />
            </MotionScaleIn>

            <MotionLeaf className="absolute -top-2 -right-2 text-accent-foreground/80">
              <Leaf className="w-8 h-8 fill-current" />
            </MotionLeaf>

            <MotionLeaf className="absolute -bottom-1 -left-4 text-accent-foreground/40 rotate-45">
              <Leaf className="w-6 h-6 fill-current" />
            </MotionLeaf>
          </div>

          {/* Text */}
          <MotionItem className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-accent-foreground">
              {t("successTitle")}
            </h2>
            <p className="text-accent-foreground/80 font-medium text-lg">
              {t("successDesc")}
            </p>
          </MotionItem>

          {/* Receipt - Client component will fetch and display order data */}
          <PaymentSuccessClient
            orderId={orderId}
            paymentIntentId={paymentIntentId}
          />

          {/* Actions */}
          <MotionItem className="w-full space-y-3">
            <Link
              href="/"
              className="myBtnPrimary w-full group flex items-center justify-center gap-2"
            >
              {t("returnHome")}
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <button
              className="myBtnPrimary w-full group flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
              disabled
            >
              {t("downloadReceipt")}
              <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </MotionItem>
        </div>
      </MotionContainer>
    </div>
  );
}
