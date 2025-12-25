"use client";

import React, { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  recycleFormSchema,
  type RecycleFormValues,
} from "@/frontend/schema/recycle.schema";
import PersonalInfoSection from "./personalInfoSection";
import AddressSection from "./addressSection";
import MaterialSection from "./MaterialSection";
import { Loader2, Sparkles } from "lucide-react";
import { useRecycleAnalysis } from "@/hooks/useRecycleAnalysis";
import VisionUploadArea from "./VisionUploadArea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type MaterialItem = {
  id: number;
  type: string;
  amount: number;
};

const RecycleForm = () => {
  const t = useTranslations("RecycleForm");
  const { data: session, status } = useSession();

  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: 1, type: "", amount: 1 },
  ]);
  const [entryMethod, setEntryMethod] = useState<"manual" | "vision">("manual");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isPending] = useTransition();

  const { analyzeImages, isAnalyzing, error, clearResult } =
    useRecycleAnalysis();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isHFSubmitting },
    reset,
  } = useForm<RecycleFormValues>({
    resolver: zodResolver(recycleFormSchema),
  });

  // Helper to add material row
  const addMaterial = () =>
    setMaterials([...materials, { id: Date.now(), type: "", amount: 1 }]);

  const removeMaterial = (id: number) =>
    materials.length > 1 && setMaterials(materials.filter((m) => m.id !== id));

  const updateAmount = (index: number, delta: number) => {
    const updated = [...materials];
    updated[index].amount = Math.max(1, updated[index].amount + delta);
    setMaterials(updated);
  };

  const updateType = (index: number, newType: string) => {
    const updated = [...materials];
    updated[index].type = newType;
    setMaterials(updated);
  };

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "");
  };

  const onSubmit: SubmitHandler<RecycleFormValues> = async (formData) => {
    // 1. Determine Analysis/Calculation Data
    let finalItems = [];
    let carbonSaved = 0;

    try {
      if (entryMethod === "manual") {
        // Manual Mode: Calculate Carbon using existing materials
        if (materials.length === 0 || !materials[0].type) {
          toast.error(t("errors.addItem"));
          return;
        }

        const response = await fetch("/api/recycle/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: materials }),
        });
        const data = await response.json();
        finalItems = data.items;
        carbonSaved = data.estimatedCarbonSaved;
      } else {
        // Vision Mode: Analyze Images
        if (imageFiles.length === 0) {
          toast.error(t("errors.uploadImage"));
          return;
        }
        const data = await analyzeImages(imageFiles); // Now returns data
        if (!data) return; // Error handled in hook
        finalItems = data.items;
        carbonSaved = data.estimatedCarbonSaved;
      }

      // 2. Submit Final Entry
      const payload = {
        ...formData,
        items: finalItems,
        totalCarbonSaved: carbonSaved,
        userId: session?.user.id,
        isVerified: status === "authenticated",
      };

      const createResponse = await fetch("/api/recycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (createResponse.ok) {
        // 3. Gamification: Calculate Points & Update User
        const pointsEarned = Math.round(carbonSaved * 100);

        toast.success(t("success.title"), {
          description: t("success.descriptionWithPoints", {
            carbonSaved: carbonSaved.toFixed(2),
            points: pointsEarned,
          }),
          duration: 5000,
        });

        reset();
        setMaterials([{ id: 1, type: "", amount: 1 }]);
        setImageFiles([]);
        clearResult();
        setEntryMethod("manual"); // Reset to manual view
      } else {
        console.error("Submission failed");
        toast.error(t("errors.submissionFailed"));
      }
    } catch (err) {
      console.error("Process failed", err);
      toast.error(t("errors.unexpected"));
    }
  };

  const isSubmitting = isPending || isHFSubmitting;
  const isBusinessProcessing = isSubmitting || isAnalyzing;

  return (
    <div className="w-full min-h-screen text-foreground flex flex-col items-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[80%] max-w-7xl mx-auto"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-12 p-8 md:p-16 rounded-[3rem] border-2 border-primary/80 shadow-2xl"
        >
          <div className="text-center space-y-4 animate-bounce">
            <h2 className="text-5xl font-extrabold text-primary">
              {t("title")}
            </h2>
            <p className="text-primary/80">{t("description")}</p>
          </div>

          <PersonalInfoSection
            register={register}
            errors={errors}
            handleNumberInput={handleNumberInput}
          />

          <AddressSection register={register} errors={errors} />

          {/* Entry Method Selection */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-primary-foreground/30">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-extrabold uppercase">
                {t("entryMethod.title")}
              </span>
            </div>

            <div className="flex gap-4 p-1 bg-primary-foreground/10 rounded-full w-fit">
              <button
                type="button"
                onClick={() => setEntryMethod("manual")}
                className={`px-6 py-2 font-bold transition-all cursor-pointer ${
                  entryMethod === "manual"
                    ? "bg-primary-foreground text-primary border-b-2 border-primary"
                    : "hover:bg-primary-foreground/10 text-foreground border-0"
                }`}
              >
                {t("entryMethod.manual")}
              </button>
              <button
                type="button"
                onClick={() => setEntryMethod("vision")}
                className={`px-6 py-2 font-bold transition-all cursor-pointer ${
                  entryMethod === "vision"
                    ? "bg-primary-foreground text-primary border-b-2 border-primary"
                    : "hover:bg-primary-foreground/10 text-foreground border-0"
                }`}
              >
                {t("entryMethod.aiScan")}
              </button>
            </div>
          </div>

          {/* Conditional Method Rendering */}
          <AnimatePresence mode="wait">
            {entryMethod === "vision" ? (
              <motion.div
                key="vision"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="bg-primary-foreground/5 p-8 rounded-4xl border-2 border-dashed border-primary-foreground/20">
                  <VisionUploadArea
                    onFilesChange={setImageFiles}
                    error={error}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="manual"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <MaterialSection
                  materials={materials}
                  removeMaterial={removeMaterial}
                  updateAmount={updateAmount}
                  updateType={updateType}
                  register={register}
                  addMaterial={addMaterial}
                  errors={errors}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Summary (Optional: Show if result available) */}
          {/* Note: In one-shot flow, result might only show AFTER submit if we don't redirect.
              If we want checking before submit, we need the old buttons.
              Assuming user wants one-shot "Submit", we might show success state instead. */}

          <button
            type="submit"
            disabled={isBusinessProcessing}
            className="w-full myBtnPrimary"
          >
            {isBusinessProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {t("submit.processing")}
              </>
            ) : (
              t("submit.default")
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RecycleForm;
