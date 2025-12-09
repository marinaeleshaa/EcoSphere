import { IEventDetails } from "@/types/EventTypes";

export async function PostEvent(formData: FormData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: formData
    });
    console.log(res);

    if (!res.ok) {
        throw new Error("error in fetch api response");
    }
    return res;
};

export async function UpdateEvent({ data }: { data: Partial<IEventDetails> }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events/user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data })
    });
    if (!res.ok) {
        throw new Error("error in fetch api response");
    }
    return res.json();
};

export async function DeleteEvent({ eventId }: { eventId: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events/user/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId })
    });
    if (!res.ok) {
        throw new Error("error in fetch api response");
    }
    return res.json();
};