"use client";

import { useState } from "react";

interface ManualItem {
  type: string;
  amount: number;
}

interface CalculationResult {
  items: any[];
  totalEstimatedWeight: number;
  estimatedCarbonSaved: number;
}

export const useCalculateCarbon = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const calculateImpact = async (items: ManualItem[]) => {
    setIsCalculating(true);
    setCalcError(null);
    setCalcResult(null);

    try {
      // Filter out empty items
      const validItems = items.filter(
        (i) => i.type && i.type !== "" && i.amount > 0
      );

      if (validItems.length === 0) {
        throw new Error("Add valid items to calculate.");
      }

      const response = await fetch("/api/recycle/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: validItems }),
      });

      if (!response.ok) {
        throw new Error("Calculation failed");
      }

      const data = await response.json();
      setCalcResult(data);
    } catch (err) {
      console.error(err);
      setCalcError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setIsCalculating(false);
    }
  };

  return { calculateImpact, isCalculating, calcResult, calcError };
};
