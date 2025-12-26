export async function getUserRecyclingEntries(userId: string) {
  try {
    console.log(userId)
    const response = await fetch(`/api/recycle/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch recycling entries");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user recycling entries:", error);
    throw error;
  }
}
