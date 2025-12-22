export async function getUserRecyclingEntries(email: string) {
  try {
    const response = await fetch(
      `/api/recycle/user/${encodeURIComponent(email)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch recycling entries");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user recycling entries:", error);
    throw error;
  }
}
