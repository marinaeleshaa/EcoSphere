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
  DollarSign,
  Send,
  Loader2,
  Image as ImageIcon,
  Tag,
  Plus,
  X,
  ListOrdered,
} from "lucide-react";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ManageEvent({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ?? {
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
  useEffect(() => {
    if (!initialData) return;

    const derivedTicketType =
      initialData.ticketPrice === 0 ? "Free" : "Priced";

    form.reset({
      ...initialData,
      ticketType: derivedTicketType,
    });
  }, [initialData, form]);

  // --- 5. Submission Handler ---
  async function onSubmit(data: z.infer<typeof eventSchema>) {
    const {
      avatar,
      sections,
      ...rest
    } = data;
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
      formData.append("avatarKey", avatar.key);
    }
    try {
      if (data._id) {
        formData.append("_id", data._id);
        await UpdateEvent(formData);
        toast.success("Event updated successfully");
      } else {
        await PostEvent(formData);
        toast.success("Event created successfully");
      }
      router.push("/organizer/details");
    } catch (err) {
      toast.error("Error saving event");
    }
  }

  return (
    <div className="min-h-screen py-8 w-[85%] mx-auto flex flex-col  gap-6">
      <h1 className="capitalize text-center  font-bold text-4xl  text-foreground">
        {initialData ? "Edit Event" : "Create Event"}
      </h1>
      <div className=" p-6 sm:p-10 rounded-2xl shadow-2xl border-2 border-primary">
        <Form {...form}>
          <form id="event-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* --- SECTION 1: Event Details --- */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold  border-b pb-2 flex items-center">
                <Ticket className="w-5 h-5 mr-2 text-primary" />
                Primary Event Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-4">
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Event Name"
                            className="pl-9"
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
                      <FormLabel>Event Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl >
                          <div className="relative">
                            <SelectTrigger className="pl-9 w-full cursor-pointer">
                              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {EVENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
                    <FormLabel>Event Image</FormLabel>
                    <FormControl>
                      <Input
                      className="cursor-pointer"
                        type="file"
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
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Describe your event..."
                          className="min-h-[100px]"
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
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Venue and Schedule
              </h2>
              <FormField
                control={form.control}
                name="locate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location / Venue</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="City, Address, or Venue"
                          className="pl-9 cursor-pointer"
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
                      <FormLabel>Event Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-9 cursor-pointer" {...field} />
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
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="time" className="pl-9 cursor-pointer" {...field} />
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
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="time" className="pl-9 cursor-pointer" {...field} />
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
                <Users className="w-5 h-5 mr-2 text-primary" />
                Capacity and Sales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Capacity */}
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tickets Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={0}
                            className="pl-9 cursor-pointer"
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
                      <FormLabel>Ticket Status</FormLabel>

                      <Select
                        value={field.value}           // ✅ controlled
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="cursor-pointer w-full">
                            <SelectValue placeholder="Select ticket status" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="Priced">Priced</SelectItem>
                          <SelectItem value="Free">Free</SelectItem>
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
                      <FormLabel>Ticket Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min={0}
                            className="pl-9 cursor-pointer"
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
                <ListOrdered className="w-5 h-5 mr-2 text-primary" />
                Detailed Event Schedule (Agenda Items)
              </h2>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm space-y-4 relative"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-accent-foreground">
                      Section #{index + 1}
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
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Agenda section title"
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Details..."
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
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="cursor-pointer"/>
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
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="cursor-pointer" />
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
                <Plus className="h-4 w-4 mr-2" /> Add Agenda Section
              </Button>
            </div>
            {/* Horizontal Separator */}
            <hr className="my-8" />
            {/* Submit Button */}
            <Button
              type="submit"
              form="event-form"
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Event...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {initialData ? "Update Event" : "Create Event"}
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}