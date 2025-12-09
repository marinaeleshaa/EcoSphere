import { getCurrentUser, requireAuth } from "@/backend/utils/authHelper";
import { IEventDetails } from "@/types/EventTypes";
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
    const res = await rootContainer.resolve(EventController).getEventsByUserId(user?.id!)
    if (!res) {
        throw new Error("error in fetch api response");
    }
    return res;
};
