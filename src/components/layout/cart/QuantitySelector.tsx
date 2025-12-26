"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/frontend/redux/hooks";
import { updateQuantity, removeItem } from "@/frontend/redux/Slice/CartSlice";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function QuantitySelector({
  id,
  quantity,
}: Readonly<{
  id: string;
  quantity: number;
}>) {
  const t = useTranslations("Cart.quantitySelector");
  const dispatch = useAppDispatch();
  const [local, setLocal] = useState(quantity);

  // Get the item from cart to access maxQuantity
  const cartItem = useAppSelector((state) => state.cart.items[id]);
  const maxQuantity = cartItem?.maxQuantity || 999;

  useEffect(() => {
    setLocal(quantity);
  }, [quantity]);

  const inc = () => {
    if (local >= maxQuantity) {
      toast.error(`Only ${maxQuantity} available in stock`);
      return;
    }
    const nv = local + 1;
    setLocal(nv);
    dispatch(updateQuantity({ id, quantity: nv }));
  };

  const dec = () => {
    if (local <= 1) {
      // Remove item from cart when decrementing at quantity 1
      dispatch(removeItem(id));
      toast.success("Item removed from cart");
    } else {
      const nv = local - 1;
      setLocal(nv);
      dispatch(updateQuantity({ id, quantity: nv }));
    }
  };

  return (
    <div className="flex items-center border border-primary text-primary rounded-full">
      <button
        onClick={dec}
        aria-label={t("decrease")}
        className="p-2 text-foreground cursor-pointer transition duration-400"
      >
        <Minus className="w-5 h-5" strokeWidth={3} />
      </button>
      <motion.div
        key={local}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.2 }}
        className="px-4 py-2 min-w-11 text-center font-medium border-x"
      >
        {local}
      </motion.div>
      <button
        onClick={inc}
        aria-label={t("increase")}
        className="p-2 hover:text-foreground cursor-pointer transition duration-400"
      >
        <Plus className="w-5 h-5" strokeWidth={3} />
      </button>
    </div>
  );
}
