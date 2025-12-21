"use client";

import { saveStep2Data, setStepValid } from "@/frontend/redux/Slice/AuthSlice";
import { Step2ShopSchema } from "@/frontend/schema/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Z from "zod";
import { useTranslations } from 'next-intl';

const ShStep2 = () => {
  const t = useTranslations('Auth.steps.shopStep2');
  const dispatch = useDispatch();

  const form = useForm<Z.infer<typeof Step2ShopSchema>>({
    resolver: zodResolver(Step2ShopSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      phoneNumber: "",
      hotline: "",
    },
  });

  const onSubmit = (data: Z.infer<typeof Step2ShopSchema>) => {
    dispatch(saveStep2Data(data));
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(saveStep2Data(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, dispatch]);

  useEffect(() => {
    dispatch(setStepValid({ step: 2, valid: form.formState.isValid }));
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
        <div>
          <input
            type="text"
            placeholder={t('name')}
            className=" myInput"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <textarea
            placeholder={t('description')}
            className="myInput resize-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div>
          <input
            type="tel"
            placeholder={t('phoneNumber')}
            className="myInput"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div>
          <input
            type="tel"
            placeholder={t('hotline')}
            className="myInput"
            {...register("hotline")}
          />
          {errors.hotline && (
            <p className="text-red-500">{errors.hotline.message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ShStep2;
