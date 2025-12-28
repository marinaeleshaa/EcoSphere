"use client";
import { useState, useEffect } from "react";
import { Store, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import RecycleAgentForm from "./recycleAgentForm";
import {
  mapUserToAgent,
  type RecycleAgent,
  type NewRecycleAgentFormData,
} from "@/types/recycleAgent";
import {
  fetchRecycleAgents,
  createRecycleAgent,
  updateRecycleAgentStatus,
} from "@/frontend/api/RecycleAgent";
import { PagingMeta } from "@/backend/features/user/user.types";
import { UserType } from "@/backend/utils/mailTemplates";

const RecycleAgentTable = () => {
  const t = useTranslations("Admin.RecycleAgents");
  const [pagingData, setPagingData] = useState<PagingMeta | null>(null);
  const [agents, setAgents] = useState<RecycleAgent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch agents
  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchRecycleAgents();
        setAgents(mapUserToAgent(list.data));
        setPagingData(list.meta);
      } catch (err) {
        console.error("Failed to load recycle agents:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const toggleStatus = async (
    id: string,
    currentStatus: boolean
  ): Promise<void> => {
    // Optimistic update
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === id ? { ...agent, isActive: !agent.isActive } : agent
      )
    );

    try {
      await updateRecycleAgentStatus(id, !currentStatus);
    } catch (err) {
      // Revert optimistic update on failure
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === id ? { ...agent, isActive: currentStatus } : agent
        )
      );
      console.error("Error updating agent status:", err);
      toast.error(
        t("table.toasts.updateError") || "Failed to update agent status"
      );
    }
  };

  const handleFormSubmit = async (formData: NewRecycleAgentFormData) => {
    setIsSubmitting(true);

    try {
      await createRecycleAgent({
        ...formData,
        role: "recycleAgent" as UserType,
      });

      // Refetch the entire list to get fresh data from server
      const list = await fetchRecycleAgents();
      setAgents(mapUserToAgent(list.data));
      setPagingData(list.meta);

      setShowForm(false);
      toast.success(t("form.toasts.success"));
    } catch (err) {
      console.error("Error creating recycle agent:", err);
      toast.error(t("form.toasts.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div>
      {/* Form Modal */}
      <RecycleAgentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Table Section */}
      <div className="max-w-7xl mx-auto px-6 my-10  bg-secondary rounded-xl p-4 sm:p-6 lg:p-8">
        {/* Add Button - Right Side */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="myBtnPrimary text-base p-2 px-4"
          >
            <Plus className="w-5 h-5" />
            {t("table.actions.addAgent")}
          </button>
        </div>

        <div className="bg-secondary rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-primary border-b border-background text-primary-foreground">
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                    {t("table.headers.name")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                    {t("table.headers.email")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                    {t("table.headers.phone")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                    {t("table.headers.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary">
                {agents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-foreground/60"
                    >
                      No recycle agents found.
                    </td>
                  </tr>
                ) : (
                  agents.map((agent) => (
                    <tr
                      key={agent.id}
                      className="hover:bg-primary/10 transition-colors text-center"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <Store className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <span className="font-medium text-foreground">
                            {agent.firstName} {agent.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                        {agent.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-foreground/60">
                        {agent.phoneNumber ? agent.phoneNumber.toString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(agent.id, agent.isActive)}
                          className="myBtnPrimary text-sm p-2 px-3"
                        >
                          {agent.isActive
                            ? t("table.actions.disable")
                            : t("table.actions.enable")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecycleAgentTable;
