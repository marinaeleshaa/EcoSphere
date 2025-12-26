export async function PostEvent(formData: FormData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/events/user`,
    {
      method: "POST",
      body: formData,
    }
  );
  console.log(res);
  

  if (!res.ok) {
    throw new Error("error in fetch api response");
  }

  return res;
}

export async function UpdateEvent(formData: FormData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/events/user`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("error in fetch api response");
  }

  return res.json();
}

export async function DeleteEvent({ eventId }: { eventId: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/events/user/`,
    {
      method: "DELETE",
      body: JSON.stringify({ eventId }),
    }
  );
  if (!res.ok) {
    throw new Error("error in fetch api response");
  }
  return res.json();
}
