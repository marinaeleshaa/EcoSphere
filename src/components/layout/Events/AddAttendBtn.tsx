import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AddAttendBtn({
  eventId,
  ticketPrice,
  userId,
  attenders,
}: {
  eventId: string;
  ticketPrice: number;
  attenders?: string[];
  userId: string | "";
}) {
  const t = useTranslations("Events.displayEvents.AddAttendBtn");
  const router = useRouter();
  const isFree = ticketPrice === 0;
  const isAttending = attenders?.includes(userId);

  const handleAddEvent = async () => {
    try {
      if (!isFree) {
        const response = await fetch("/api/payment/ticket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventId, userId }),
        });

        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error("Failed to create payment session");
      }

      const url = `/api/events/${eventId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(t("success"));
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    }
  };

  return (
    <button
      onClick={handleAddEvent}
      disabled={isAttending}
      className={`flex-1 py-3 capitalize rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition ${
        isAttending ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {isAttending ? t("joined") : t("join")}
    </button>
  );
}
