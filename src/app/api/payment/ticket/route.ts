import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/backend/services/payment.service";
import { rootContainer } from "@/backend/config/container";

export const POST = async (req: NextRequest) => {
  const { userId, email, event, eventId } = await req.json();

  // Determine origin / domain for redirect urls
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  const domain = origin.replace(/\/$/, "");

  let eventDetails = event;
  let userEmail = email;

  // If event details or email are missing, fetch them
  if (!eventDetails || !userEmail) {
    if (!userId || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields: userId and eventId" },
        { status: 400 }
      );
    }

    try {
      // Resolve services using the interface tokens
      const eventService = rootContainer.resolve<any>("IEventService");
      const userService = rootContainer.resolve<any>("IUserService");

      console.log(eventId);

      const [fetchedEvent, fetchedUser] = await Promise.all([
        eventService.getPublicEventById(eventId),
        userService.getById(userId),
      ]);

      if (!fetchedEvent) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }

      if (!fetchedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      eventDetails = {
        _id: fetchedEvent._id.toString(),
        name: fetchedEvent.name,
        avatar: fetchedEvent.avatar,
        image: fetchedEvent.avatar?.url,
        quantity: 1, // Default to 1 if fetching from DB
      };
      userEmail = fetchedUser.email;
    } catch (error) {
      console.error("Error fetching event/user details:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  const paymentService = rootContainer.resolve(PaymentService);
  const session = await paymentService.createEventSession({
    successUrl: `${domain}/payment/success`,
    cancelUrl: `${domain}/payment/failed`,
    userId,
    userEmail: userEmail,
    eventItem: {
      id: eventDetails._id || eventDetails.id,
      name: eventDetails.name,
      image: eventDetails.avatar?.url || eventDetails.image,
      quantity: eventDetails.quantity || 1,
    },
  });

  return NextResponse.json({ url: session.url });
};
