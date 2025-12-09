"use client"

import React, { useEffect } from 'react';
import {  useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  ListOrdered 
} from 'lucide-react';

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
import { EVENT_TYPES, IEventDetails } from '@/types/EventTypes';
import { eventSchema} from '@/frontend/schema/event.schema';
import { PostEvent } from '@/frontend/api/Events';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { log } from 'console';
function createFormData(data: Partial<IEventDetails>): FormData {
  const formData = new FormData();
  const file = data.avatar instanceof FileList ? data.avatar[0] : null;

  // 1. Append the file if it exists
  if (file) {
    formData.append("avatar", file, file.name);
  }

  // 2. Append all other fields, converting complex types like sections to a JSON string
  for (const key in data) {
    if (key === 'avatar' || key === '_id' || !data[key as keyof typeof data]) continue;

    const value = data[key as keyof typeof data];

    if (key === 'sections') {
      // Convert the array of sections into a JSON string
      formData.append(key, JSON.stringify(value));
    } else if (key === 'capacity' || key === 'ticketPrice') {
      // Ensure numbers are sent as strings in FormData
      formData.append(key, String(Number(value)));
    } else {
      // Append all other simple string/number fields
      formData.append(key, String(value));
    }
  }

  return formData;
}
export default function ManageEvent() {
  const form = useForm<IEventDetails>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      type: '',
      avatar: '',
      description: '',
      locate: '',
      eventDate: '',
      startTime: '',
      endTime: '',
      capacity:0,
      ticketType: 'Priced',
      ticketPrice: 0,
      sections: [],
    },
  });

  // --- Initialize useFieldArray for dynamic schedule items ---
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sections",
  });
  const ticketType = useWatch({
    control: form.control,
    name: "ticketType"
  });

  // --- 3. Watchers & Calculations ---
  // Watch specific fields to trigger side effects or UI updates
  // const ticketType = form.watch("ticketType");
const router = useRouter();
  // --- 4. Side Effects ---
  // If ticket type changes to 'Free', reset price to 0 automatically
  useEffect(() => {
    if (ticketType === 'Free') {
      form.setValue('ticketPrice', 0);
      form.clearErrors('ticketPrice');
    }
  }, [ticketType, form]);

  // --- 5. Submission Handler ---
   async function handleEvent(data:Partial<IEventDetails>) {
    console.log(data);
    
    // const file = data.avatar instanceof FileList ? data.avatar[0] : null;
    // const {  ...restOfData } = data;
    // const eventData = {
    //   ...restOfData,
    //   capacity: Number(restOfData.capacity),
    //   ticketPrice: Number(restOfData.ticketPrice),
    //   avatar: file || restOfData.avatar,
    // };
     const formData = createFormData(data);
    console.log("--- Event Details (excluding file/upload details) ---", formData);
    try {
      await PostEvent(formData);
      toast.success("Event added successfully", {
        position: "bottom-right",
        duration: 3000,
      });
      router.push("/organizer/details");
    } catch (error) {
      toast.error(`${error}`, {
        position: "bottom-right",
        duration: 3000,
      });
    }
  }

  return (
    <div className="min-h-screen py-8 w-[85%] mx-auto flex flex-col  gap-6" >
      <h1 className='capitalize font-bold text-4xl  text-foreground'>
          Create/Edit Event
        </h1>

        <div className=" p-6 sm:p-10 rounded-2xl shadow-2xl border-2 border-primary">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEvent)} className="space-y-8">

              {/* --- SECTION 1: Event Details --- */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <Ticket className="w-5 h-5 mr-2 text-primary" />
                  Primary Event Information
                </h2>
                <div className='grid grid-cols-6 gap-2' >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className='col-span-4'>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Event Name" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className='col-span-2 w-full'>
                      <FormLabel>Event Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} >
                        <FormControl >
                          <div className="relative w-full">
                            <SelectTrigger className="pl-9">
                              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          {EVENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>


                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { value:_, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Event Image (Upload File)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...fieldProps}
                            type="file" // --- Key Change ---
                            accept="image/*"
                            className="pl-9 cursor-pointer"
                            // Handle file change: only pass the FileList from e.target.files
                            onChange={(event) => {
                              onChange(event.target.files);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex items-center">
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
                          <Input placeholder="City Arena" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="date" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="time" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="time" className="pl-9" {...field} />
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
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Capacity and Sales
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tickets Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="number" min={0} className="pl-9" {...field} onChange={e => field.onChange(+e.target.value)} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Radio Group for Ticket Status */}
                  {/* <FormField
                    control={form.control}
                    name="ticketType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Ticket Status</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row space-x-4 pt-1"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Priced" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Priced
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Free" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Free
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name="ticketType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <div className="relative">
                              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                              <SelectTrigger className="pl-9">
                                <SelectValue placeholder="Select ticket status" />
                              </SelectTrigger>
                            </div>
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
                              type="number" min={0}
                              className="pl-9"
                              disabled={ticketType === 'Free'} // Disable if free
                              {...field}
                              onChange={e => field.onChange(+e.target.value)}
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
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex items-center">
                  <ListOrdered className="w-5 h-5 mr-2 text-primary" />
                  Detailed Event Schedule (Agenda Items)
                </h2>

                {form.formState.errors.sections && (
                  <p className="text-sm font-medium text-red-500 mt-2">
                    {form.formState.errors.sections.message}
                  </p>
                )}

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg shadow-sm space-y-4 relative">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-indigo-600">Section #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name={`sections.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Keynote Speech / Band Set / Workshop Topic" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`sections.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Details about this section..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`sections.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
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
                              <Input type="time" {...field} />
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
                  onClick={() => append({ title: '', description: '', startTime: '', endTime: '' })}
                  className="w-full justify-center text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Agenda Section
                </Button>
              </div>

              {/* Horizontal Separator */}
              <hr className="my-8" />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700"
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
                    Save Event Details
                    </>
                    )}
                    
              </Button>
            </form>
          </Form>
        </div>
      </div>

  );
}


