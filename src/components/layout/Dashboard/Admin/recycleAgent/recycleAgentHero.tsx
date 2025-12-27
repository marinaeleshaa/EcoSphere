"use client";
import { useEffect, useState } from "react";
import { MdCheckCircleOutline, MdRecycling, MdGroups } from "react-icons/md";
import { RiNumbersLine } from "react-icons/ri";
import { useTranslations } from "next-intl";
import { RecycleAgent } from "@/types/recycleAgent";

const RecycleAgentHero = () => {
  const t = useTranslations("Admin.RecycleAgents");
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/recycle-agents");
        if (response.ok) {
          const json = await response.json().catch(() => null);
          const list = json?.data ?? json ?? [];
          setAgents(list);
        } else {
          const txt = await response.text().catch(() => "");
          console.error(
            "Failed to fetch recycle agents:",
            response.status,
            txt,
          );
        }
      } catch (error) {
        console.error("Failed to fetch recycle agents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const stats = [
    {
      label: t("stats.total"),
      value: agents.length,
      icon: <RiNumbersLine className="w-5 h-5" />,
    },
    {
      label: t("stats.organizational"),
      value: agents.filter(
        (agent: RecycleAgent) => agent.agentType === "organizational",
      ).length,
      icon: <MdGroups className="w-5 h-5" />,
    },
    {
      label: t("stats.independent"),
      value: agents.filter(
        (agent: RecycleAgent) => agent.agentType === "independent",
      ).length,
      icon: <MdCheckCircleOutline className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <MdRecycling className="w-8 h-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">{t("title")}</h1>
        </div>

        <p className="text-primary-foreground/80 text-sm sm:text-base max-w-2xl mb-6 text-center">
          {t("description")}
        </p>

        {/* Stats */}
        {!isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center gap-2 text-primary-foreground/70 text-xs sm:text-sm mb-2">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecycleAgentHero;
