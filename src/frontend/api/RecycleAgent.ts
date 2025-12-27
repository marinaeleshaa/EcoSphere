import type {
  RecycleAgent,
  NewRecycleAgentFormData,
} from "@/types/recycleAgent";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Fetch all recycle agents
 */
export async function fetchRecycleAgents(): Promise<any> {
  try {
    const response = await fetch("/api/users/recycle/agents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching recycle agents:", error);
    throw error;
  }
}

/**
 * Create a new recycle agent
 */
export async function createRecycleAgent(
  formData: NewRecycleAgentFormData,
): Promise<RecycleAgent> {
  try {
    const response = await fetch("/api/users/recycle/agents/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        isActive: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to create agent: ${response.statusText}`,
      );
    }

    const result: ApiResponse<RecycleAgent> = await response.json();
    if (!result.data) {
      throw new Error("No agent data returned from server");
    }

    return result.data;
  } catch (error) {
    console.error("Error creating recycle agent:", error);
    throw error;
  }
}

/**
 * Update recycle agent status
 */
export async function updateRecycleAgentStatus(
  id: string,
  isActive: boolean,
): Promise<RecycleAgent> {
  try {
    const response = await fetch(`/api/users/recycle/agents/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to update agent: ${response.statusText}`,
      );
    }
    const result: ApiResponse<RecycleAgent> = await response.json();
    if (!result.data) {
      throw new Error("No agent data returned from server");
    }
    return result.data;
  } catch (error) {
    console.error("Error updating recycle agent status:", error);
    throw error;
  }
}

/**
 * Delete a recycle agent
 */
export async function deleteRecycleAgent(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/recycle-agents/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `Failed to delete agent: ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error("Error deleting recycle agent:", error);
    throw error;
  }
}
