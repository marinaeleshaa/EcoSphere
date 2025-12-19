import z from "zod";

const createDateTime = (date?: string, time?: string) => {
  if (!date || !time) return null;
  const d = new Date(`${date}T${time}:00`);
  return isNaN(d.getTime()) ? null : d;
};

export const agendaSectionSchema = z.object({
  title: z.string().min(1, "Agenda title is required"),
  description: z.string().min(1, "Agenda description is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export const eventSchema = z
  .object({
    _id: z.string().optional(),

    name: z.string().min(2, "Event name is required"),

    type: z.string().min(1, "Event type is required"),

    avatar: z
      .union([
        z.string().url().optional(), // existing image (edit mode)
        z.object({
          url: z.string().url(),
          key: z.string(),
        }),
        z.instanceof(File).optional(), // new upload
      ])
      .optional(),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),

    locate: z.string().min(2, "Location is required"),

    eventDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),

    startTime: z.string().min(1, "Start time is required"),

    endTime: z.string().min(1, "End time is required"),

    capacity: z.coerce.number<number>().min(1, "Capacity must be at least 1"),

    ticketType: z.enum(["Free", "Priced"]),

    ticketPrice: z.coerce.number<number>().min(30, "Minimum ticket price is 30.00 EGP due to payment processor limits"),

    sections: z.array(agendaSectionSchema).optional(),
  })
  .superRefine((data, ctx) => {
    // Validation rule: if ticket is "Priced" but price is empty or 0 → error
    if (data.ticketType === "Priced") {
      if (!data.ticketPrice || data.ticketPrice <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ticketPrice"],
          message: "Ticket price is required for priced events",
        });
      } else if (data.ticketPrice < 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ticketPrice"],
          message:
            "Minimum ticket price is 30.00 EGP due to payment processor limits",
        });
      }
    }
    // Skip if no sections
    if (!data.sections || data.sections.length === 0) return;

    const mainStart = createDateTime(data.eventDate, data.startTime);
    const mainEnd = createDateTime(data.eventDate, data.endTime);

    if (!mainStart || !mainEnd) return;

    data.sections.forEach((section, index) => {
      const secStart = createDateTime(data.eventDate, section.startTime);
      const secEnd = createDateTime(data.eventDate, section.endTime);

      if (!secStart || !secEnd) return;

      // ❌ Section starts before event
      if (secStart < mainStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sections", index, "startTime"],
          message: "Section starts before the main event",
        });
      }

      // ❌ Section ends after event
      if (secEnd > mainEnd) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sections", index, "endTime"],
          message: "Section ends after the main event",
        });
      }

      // ❌ Section end before start
      if (secEnd <= secStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sections", index, "endTime"],
          message: "End time must be after start time",
        });
      }
    });
  });
