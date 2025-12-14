import { useState } from "react";

export interface AnalyzedItem {
  originalLabel: string;
  type: string;
  count: number;
  estimatedWeight: number;
}

export interface AnalysisResult {
  items: AnalyzedItem[];
  totalEstimatedWeight: number;
  estimatedCarbonSaved: number;
}

export const useRecycleAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeImages = async (
    files: File[]
  ): Promise<AnalysisResult | undefined> => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file); // Key 'files' matches backend controller
      });

      const response = await fetch("/api/recycle/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze images");
      }

      const data = await response.json();
      setResult(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error(err);
      return undefined;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return {
    analyzeImages,
    result,
    isAnalyzing,
    error,
    clearResult,
  };
};
