import * as z from "zod";

// --- Zod Schema for Recycle Form Validation ---
export const recycleFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be valid"),
  city: z.string().min(2, "City is required"),
  neighborhood: z.string().optional(),
  street: z.string().optional(),
  building: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
});

export type RecycleFormValues = z.infer<typeof recycleFormSchema>;
