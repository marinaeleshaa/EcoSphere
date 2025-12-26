export interface PromptSuggestion {
  icon: string;
  text: string;
}

export const ROLE_PROMPTS: Record<string, PromptSuggestion[]> = {
  guest: [
    { icon: "🛍️", text: "Show me eco-friendly products" },
    { icon: "🍽️", text: "Find restaurants near me" },
    { icon: "♻️", text: "How does recycling work?" },
    { icon: "📊", text: "Explain sustainability scores" },
  ],
  customer: [
    { icon: "📦", text: "Show my orders" },
    { icon: "⭐", text: "View my favorites" },
    { icon: "🎯", text: "How many points do I have?" },
    { icon: "🛒", text: "What's in my cart?" },
  ],
  restaurant: [
    { icon: "📊", text: "Show my sales statistics" },
    { icon: "🍴", text: "List my products" },
    { icon: "💰", text: "What's my revenue?" },
    { icon: "🥇", text: "Top-selling products" },
  ],
  organizer: [
    { icon: "🎉", text: "Show my events" },
    { icon: "👥", text: "How many attendees?" },
    { icon: "📅", text: "Upcoming events" },
    { icon: "➕", text: "How to create a new event?" },
  ],
  recycleMan: [
    { icon: "📋", text: "Pending recycling requests" },
    { icon: "🚚", text: "Show today's pickups" },
    { icon: "♻️", text: "Carbon saved this month" },
    { icon: "📍", text: "Recycling locations" },
  ],
  admin: [
    { icon: "📊", text: "Platform statistics" },
    { icon: "💰", text: "Total revenue" },
    { icon: "👥", text: "User growth metrics" },
    { icon: "♻️", text: "Total carbon impact" },
  ],
};
