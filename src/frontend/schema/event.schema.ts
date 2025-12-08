import * as z from "zod";

const createDateTime = (date: string, time: string) => {
    // Note: Concatenating date and time strings works for standard ISO format parsing
    return new Date(`${date}T${time}:00`);
};

export const subEventSchema = z.object({
    title: z.string().min(2, { message: "Section title is required." }),
    description: z.string().optional(),
    startTime: z.string().min(1, { message: "Start time is required." }),
    endTime: z.string().min(1, { message: "End time is required." }),
});

export const eventSchema = z
    .object({
        _id: z.string(),
        name: z
            .string()
            .min(2, { message: "Event name must be at least 2 characters." }),
        type: z.string({ message: "Please enter a valid Name." }),
        avatar: z
            .any()
            .optional()
            .refine(
                (value) => {
                    // Check if value is a FileList and has at least one file, or if it's an empty string (optional).
                    return (
                        (value instanceof FileList && value.length > 0) ||
                        value === "" ||
                        typeof value === "string"
                    );
                },
                {
                    message: "Image URL must be a valid file or an empty string.",
                }
            ),
        description: z.string().optional(),
        locate: z.string().min(2, { message: "Location is required." }),
        eventDate: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
        startTime: z.string(),
        endTime: z.string(),
        capacity: z.coerce.number<number>().min(0),
        ticketType: z.enum(["Priced", "Free"]),
        ticketPrice: z.coerce.number<number>().min(0),
        sections: z.array(subEventSchema).optional()
    })
    .refine(
        (data) => {
            // Skip validation if the subEvents array is empty or undefined
            if (!data.sections || data.sections.length === 0) {
                return true;
            }

            // 1. Calculate Main Event Boundaries
            const mainEventStart = createDateTime(data.eventDate, data.startTime);
            const mainEventEnd = createDateTime(data.eventDate, data.endTime);

            // Check for general validity (should be caught by individual field validation, but good to check)
            if (isNaN(mainEventStart.getTime()) || isNaN(mainEventEnd.getTime())) {
                return true;
            }

            // 2. Iterate through all Sub-Events and check against boundaries
            for (const subEvent of data.sections) {
                const subEventStart = createDateTime(
                    data.eventDate,
                    subEvent.startTime
                );
                const subEventEnd = createDateTime(data.eventDate, subEvent.endTime);

                // a) Check if sub-event starts before the main event
                if (subEventStart.getTime() < mainEventStart.getTime()) {
                    return false;
                }

                // b) Check if sub-event ends after the main event
                if (subEventEnd.getTime() > mainEventEnd.getTime()) {
                    return false;
                }

                // c) (Bonus) Check if sub-event ends before it starts
                if (subEventEnd.getTime() <= subEventStart.getTime()) {
                    return false;
                }
            }

            return true; // All sub-events are within bounds
        },
        {
            // This message is applied to the whole form, but it's the only way to apply
            // a global constraint message.
            message:
                "A schedule item is outside the main event's start and end times, or its end time is before its start time.",
            path: ["sections"], // Display error message near the subEvents section
        }
    );
