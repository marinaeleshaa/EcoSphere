import { Check, Home, Leaf, Download } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { MotionContainer } from "@/components/layout/PaymentVerification/MotionContainer";
import { MotionItem } from "@/components/layout/PaymentVerification/MotionItem";
import { MotionLeaf } from "@/components/layout/PaymentVerification/MotionLeaf";
import { MotionScaleIn } from "@/components/layout/PaymentVerification/MotionScaleIn";

export default async function PaymentSuccess() {
  const t = await getTranslations("Checkout.verification");

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

          {/* Receipt */}
          <MotionItem className="w-full bg-primary/10 rounded-2xl p-5 border-4 border-accent-foreground/10 space-y-4 backdrop-blur-sm">
            <div className="flex justify-between items-center border-b-4 border-accent-foreground/30 pb-3">
              <span className="text-sm font-medium text-accent-foreground/80">
                {t("transactionId")}
              </span>
              <span className="font-mono text-sm font-bold text-accent-foreground">
                #ECO-8829
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-accent-foreground/80">
                {t("totalAmount")}
              </span>
              <span className="text-2xl font-bold text-accent-foreground">
                $25.00
              </span>
            </div>
          </MotionItem>

          {/* Actions */}
          <MotionItem className="w-full space-y-3">
            <button className="myBtnPrimary w-full group flex items-center justify-center gap-2">
              {t("returnHome")}
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button className="myBtnPrimary w-full group flex items-center justify-center gap-2">
              {t("downloadReceipt")}
              <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </MotionItem>
        </div>
      </MotionContainer>
    </div>
  );
}
