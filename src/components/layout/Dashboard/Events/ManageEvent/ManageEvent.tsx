/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Send,
  Loader2,
  Tag,
  Plus,
  X,
  ListOrdered,
} from "lucide-react";
import { LuEuro } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_TYPES } from "@/types/EventTypes";
import { eventSchema } from "@/frontend/schema/event.schema";
import { PostEvent, UpdateEvent } from "@/frontend/api/Events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import z from "zod";
import { useTranslations } from "next-intl";

export default function ManageEvent({
  initialData,
}: Readonly<{ initialData?: any }>) {
  const t = useTranslations("Events.Manage");
  const tEventTypes = useTranslations("Events.Manage.fields.EventTypes");
  const router = useRouter();
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          ticketType: initialData.ticketPrice === 0 ? "Free" : "Priced",
        }
      : {
          name: "",
          type: "",
          avatar: undefined,
          description: "",
          locate: "",
          eventDate: "",
          startTime: "",
          endTime: "",
          capacity: 0,
          ticketPrice: 0,
          ticketType: "Free",
          sections: [],
        },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });
  const ticketType = useWatch({
    control: form.control,
    name: "ticketType",
  });
  const avatar = useWatch({
    control: form.control,
    name: "avatar",
  });
  const ticketPrice = useWatch({
    control: form.control,
    name: "ticketPrice",
  });
  useEffect(() => {
    if (ticketType === "Free") {
      form.setValue("ticketPrice", 0);
      form.clearErrors("ticketPrice");
    }
  }, [ticketType, form]);
  useEffect(() => {
    if (ticketPrice === 0) {
      form.setValue("ticketType", "Free");
    } else if (ticketPrice > 0) {
      form.setValue("ticketType", "Priced");
    }
  }, [ticketPrice, form]);

  // --- 5. Submission Handler ---
  async function onSubmit(data: z.infer<typeof eventSchema>) {
    const { avatar, sections, ...rest } = data;
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (sections) {
      formData.append("sections", JSON.stringify(sections));
    }
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    } else if (avatar && typeof avatar === "object" && "key" in avatar) {
      formData.append("avatar.key", avatar.key);
    }
    try {
      if (data._id) {
        formData.append("_id", data._id);
        await UpdateEvent(formData);
        toast.success(t("successUpdate"));
      } else {
        await PostEvent(formData);
        toast.success(t("successCreate"));
      }
      router.push("/organizer/upcomingEvents");
    } catch (err) {
      console.error(err);
      toast.error(t("error"));
    }
  }

  return (
    <div className="min-h-screen py-8 w-[85%] mx-auto flex flex-col gap-6">
      <h1 className="capitalize text-center  font-bold text-4xl  text-foreground">
        {initialData ? t("titleEdit") : t("titleCreate")}
      </h1>
      <div className=" p-6 sm:p-10 ltr:rounded-tr-3xl ltr:rounded-bl-3xl rtl:rounded-tl-3xl rtl:rounded-br-3xl  md:ltr:rounded-tr-[10%] md:ltr:rounded-bl-[10%] md:rtl:rounded-tl-[10%] md:rtl:rounded-br-[10%] shadow-2xl border-2 border-primary">
        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* --- SECTION 1: Event Details --- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold  border-b pb-2 flex items-center">
                <Ticket className="w-5 h-5 m-2 text-primary" />
                {t("sections.primary")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-4">
                      <FormLabel>{t("fields.title")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Ticket className="absolute left-3 rtl:right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={t("fields.titlePlaceholder")}
                            className="pl-9 rtl:pr-9 cursor-pointer"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>{t("fields.type")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <SelectTrigger className="pl-9 rtl:pr-9 rtl:flex-row-reverse w-full cursor-pointer">
                              <Tag className="absolute left-3 rtl:right-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                              <SelectValue
                                placeholder={t("fields.typePlaceholder")}
                              />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {EVENT_TYPES.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="rtl:text-right rtl:flex-row-reverse"
                            >
                              {tEventTypes(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Avatar */}
              {avatar &&
                typeof avatar === "object" &&
                "url" in avatar &&
                !(avatar instanceof File) && (
                  <div className="relative w-64 h-40 rounded-lg overflow-hidden border">
                    <Image
                      src={avatar.url}
                      alt="Event image"
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  </div>
                )}
              <FormField
                control={form.control}
                name="avatar"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormLabel>{t("fields.image")}</FormLabel>
                    <FormControl>
                      <Input
                        className="cursor-pointer"
                        type="file"
                        dir="ltr"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.description")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder={t("fields.descriptionPlaceholder")}
                          className="min-h-25"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* --- SECTION 2: Location & Time --- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold  border-b pb-2 flex items-center">
                <MapPin className="w-5 h-5 m-2 text-primary" />
                {t("sections.venue")}
              </h2>
              <FormField
                control={form.control}
                name="locate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fields.location")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 rtl:right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={t("fields.locationPlaceholder")}
                          className="pl-9 rtl:pr-9 cursor-pointer"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date */}
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.date")}</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          <Calendar className="absolute left-3  top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-9  cursor-pointer"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Start */}
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.startTime")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            className="pl-9 cursor-pointer"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* End */}
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.endTime")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            className="pl-9 cursor-pointer"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* --- SECTION 3: Capacity & Sales --- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold  border-b pb-2 flex items-center">
                <Users className="w-5 h-5 m-2 text-primary" />
                {t("sections.capacity")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Capacity */}
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.ticketsAmount")}</FormLabel>
                      <FormControl>
                        <div className="relative rtl:flex-col-reverse">
                          <Ticket className="absolute left-3 rtl:right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={0}
                            className="ltr:pl-9 rtl:pr-9 cursor-pointer"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/*  Ticket Status */}
                <FormField
                  control={form.control}
                  name="ticketType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.ticketStatus")}</FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer rtl:flex-row-reverse w-full">
                            <SelectValue
                              placeholder={t("fields.ticketStatusPlaceholder")}
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem
                            value="Priced"
                            className="rtl:flex-row-reverse"
                          >
                            {t("ticketTypes.priced")}
                          </SelectItem>
                          <SelectItem
                            value="Free"
                            className="rtl:flex-row-reverse"
                          >
                            {t("ticketTypes.free")}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Price */}
                <FormField
                  control={form.control}
                  name="ticketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.ticketPrice")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LuEuro className="absolute left-3 rtl:right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={0}
                            className="ltr:pl-9 rtl:pr-9 cursor-pointer"
                            disabled={ticketType === "Free"}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* --- SECTION 4: Detailed Agenda/Schedule --- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold  border-b pb-2 flex items-center">
                <ListOrdered className="w-5 h-5 m-2 text-primary" />
                {t("sections.schedule")}
              </h2>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm space-y-4 relative"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-accent-foreground capitalize">
                      {t("sections.section")} #{index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name={`sections.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.agendaTitle")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("fields.agendaTitlePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Description */}
                  <FormField
                    control={form.control}
                    name={`sections.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.agendaDescription")}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              "fields.agendaDescriptionPlaceholder",
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Start & End */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`sections.${index}.startTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.startTime")}</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="cursor-pointer rtl:flex-row-reverse"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sections.${index}.endTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.endTime")}</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="cursor-pointer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    title: "",
                    description: "",
                    startTime: "",
                    endTime: "",
                  })
                }
                className="w-full cursor-pointer justify-center text-accent-foreground border-primary hover:text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" /> {t("actions.addAgenda")}
              </Button>
            </div>
            {/* Horizontal Separator */}
            <hr className="my-8" />
            {/* Submit Button */}
            <Button
              type="submit"
              form="event-form"
              className="w-full rounded-2xl h-12 text-lg bg-primary hover:bg-primary/90 cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {initialData ? t("submitUpdate") : t("submitCreate")}
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
