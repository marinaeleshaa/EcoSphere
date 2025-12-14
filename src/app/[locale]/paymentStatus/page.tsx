import React from "react";
import PaymentSuccess from "@/components/layout/PaymentVerification/paymentSuccessful";
import PaymentFailure from "@/components/layout/PaymentVerification/paymentFailed";



export default function PasswordStatus() {
  return (
    <div className="scroll-smooth">
     <PaymentSuccess />
     <PaymentFailure />
    </div>
  );
}