"use client";

import { saveStep3Data, setStepValid } from "@/frontend/redux/Slice/AuthSlice";
import { Step3ShopSchema } from "@/frontend/schema/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Z from "zod";
import { useTranslations } from 'next-intl';


const ShStep3 = () => {
  const t = useTranslations('Auth.steps.shopStep3');
  const dispatch = useDispatch();

  const form = useForm<Z.infer<typeof Step3ShopSchema>>({
    resolver: zodResolver(Step3ShopSchema),
    mode: "onChange",
    defaultValues: {
      location: "",
      workingHours: "",
    },
  });

  const onSubmit = (data: Z.infer<typeof Step3ShopSchema>) => {
    dispatch(saveStep3Data(data));
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(saveStep3Data(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, dispatch]);

  useEffect(() => {
    dispatch(setStepValid({ step: 3, valid: form.formState.isValid }));
  }, [form.formState.isValid, dispatch]);

  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div className="flex flex-col gap-5 p-5 text-foreground rounded-lg">
      <form
        action=""
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="text-2xl md:text-3xl font-bold text-center text-secondary-foreground">
          {t('title')}
        </p>

        {/* Logo upload */}
        <div>
          {/* <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="myInput"
                name={field.name}
                ref={field.ref}
                onChange={(event) =>
                  field.onChange(event.target.files ?? undefined)
                }
              />
            )}
          /> */}
              {/* <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Shop Logo"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <UploadCloud size={24} />
                      <span className="text-xs mt-1">Upload Logo</span>
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 2 * 1024 * 1024) {
                        toast.error("File size must be less than 2MB");
                        return;
                      }

                      setIsUploading(true);

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        setPreviewUrl(base64String);
                        field.onChange(base64String); // Store Base64 string
                        setIsUploading(false);
                      };
                      reader.onerror = () => {
                        toast.error("Failed to read file");
                        setIsUploading(false);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
            )}
          /> */}
          {errors.avatar && (
            <p className="text-red-500">{errors.avatar.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <input
            type="text"
            placeholder={t('location')}
            className="myInput"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Working hours */}

        <div>
          <input
            type="text"
            placeholder={t('workingHours')}
            className="myInput"
            {...register("workingHours")}
          />
          {errors.workingHours && (
            <p className="text-red-500">{errors.workingHours.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ShStep3;
