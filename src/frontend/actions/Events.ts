import { getCurrentUser} from "@/backend/utils/authHelper";
import { rootContainer } from "@/backend/config/container";
import EventController from "@/backend/features/event/event.controller";

export async function GetAllEvents() {
    const res = await rootContainer.resolve(EventController).getEvents()
    if (!res) {
        throw new Error("error in fetch api response");
    }
    return res;
};
export async function GetAllUserEvents() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("User is not authenticated");
    }
    const res = await rootContainer.resolve(EventController).getEventsByUserId(user.id!)

    if (!res) {
        throw new Error("error in fetch api response");
    }
    return res;
};
export async function GetEventById(eventId: string) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("User is not authenticated");
    }
    const res = await rootContainer.resolve(EventController).getEvent(user.id!, eventId)
    if (!res) {
        throw new Error("error in fetch api response");
    }
    return res.events[0];
};