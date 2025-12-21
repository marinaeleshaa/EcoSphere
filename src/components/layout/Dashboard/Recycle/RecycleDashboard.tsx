"use client";
import {
  Recycle,
  CheckCircle,
  Clock,
  Truck,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export type requestState = "completed" | "reviewing" | "pending" | "out for delivery";

const RecycleDashboard = () => {
  const t = useTranslations("RecycleDashboard");
  const [activeTab, setActiveTab] = useState("pending");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [requests, setRequests] = useState([
    {
      id: 1,
      customerName: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      location: "123 Main St, New York, NY",
      status: "reviewing" as requestState,
    },
    {
      id: 2,
      customerName: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
      location: "456 Oak Ave, Los Angeles, CA",
      status: "pending" as requestState
    },
    {
      id: 3,
      customerName: "Mike Brown",
      email: "mike.brown@email.com",
      phone: "+1 (555) 345-6789",
      location: "789 Pine Rd, Chicago, IL",
      status: "completed" as requestState
    },
    {
      id: 4,
      customerName: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+1 (555) 456-7890",
      location: "321 Elm St, Houston, TX",
      status: "out for delivery" as requestState
    },
    {
      id: 5,
      customerName: "David Wilson",
      email: "david.w@email.com",
      phone: "+1 (555) 567-8901",
      location: "654 Maple Dr, Phoenix, AZ",
      status: "completed" as requestState
    }
  ]);

  const pendingRequests = requests.filter((r) => r.status !== "completed");
  const completedRequests = requests.filter((r) => r.status === "completed");

  const handleStatusChange = (id: number, newStatus: requestState) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
    setOpenDropdown(null);

    if (newStatus === "completed") {
      setTimeout(() => setActiveTab("completed"), 300);
    }
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  const statusOptions = [
    {
      value: "reviewing" as requestState,
      label: t("status.reviewing"),
      icon: <Eye className="w-4 h-4" />,
    },
    {
      value: "pending" as requestState,
      label: t("status.pending"),
      icon: <Clock className="w-4 h-4" />,
    },
    {
      value: "out for delivery" as requestState,
      label: t("status.outForDelivery"),
      icon: <Truck className="w-4 h-4" />,
    },
    {
      value: "completed" as requestState,
      label: t("status.completed"),
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  const getStatusColor = (status: requestState) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'out for delivery':
        return 'bg-purple-100 text-purple-800';
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    {
      label: t("stats.totalRequests"),
      value: requests.length,
      icon: <Recycle className="w-5 h-5" />,
    },
    {
      label: t("stats.reviewing"),
      value: requests.filter((r) => r.status === "reviewing").length,
      icon: <Eye className="w-5 h-5" />,
    },
    {
      label: t("stats.pending"),
      value: requests.filter((r) => r.status === "pending").length,
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: t("stats.outForDelivery"),
      value: requests.filter((r) => r.status === "out for delivery").length,
      icon: <Truck className="w-5 h-5" />,
    },
    {
      label: t("stats.completed"),
      value: requests.filter((r) => r.status === "completed").length,
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground py-12 px-6 rounded-3xl shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/10">
              <Recycle className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
                {t("title")}
                <span className="text-sm font-normal bg-white/20 px-3 py-1 rounded-full border border-white/10">
                  Dashboard
                </span>
              </h1>
              <p className="text-lg text-primary-foreground/90 font-medium max-w-xl leading-relaxed">
                {t("description")}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/80">
                {requests.length}
              </p>
              <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-widest mt-1">
                {t("stats.totalRequests")}
              </p>
            </div>
            <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/80">
                {requests.filter((r) => r.status === "pending").length}
              </p>
              <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-widest mt-1">
                {t("stats.pending")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-card hover:bg-muted/50 p-6 rounded-2xl shadow-sm border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              <span className="text-3xl font-bold text-foreground tracking-tight">
                {stat.value}
              </span>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden">
        {/* Tabs Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-border/50 gap-4 bg-muted/30">
          <div className="flex items-center gap-2 bg-muted p-1 rounded-xl w-full sm:w-auto">
            {["pending", "completed"].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize flex items-center justify-center gap-2 ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("searchPlaceholder") || "Search requests..."}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
            <button
              type="button"
              className="p-2.5 bg-background border border-border/50 rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto overflow-visible">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 overflow-visible">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  {t("table.customerName")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  {t("table.email")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  {t("table.phone")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  {t("table.location")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  {t("table.status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 overflow-visible">
              {(activeTab === "pending"
                ? pendingRequests
                : completedRequests
              ).map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">
                      {request.customerName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {request.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {request.phone}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {request.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap relative overflow-visible">
                    {activeTab === "completed" ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {t("status.completed")}
                      </span>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(request.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {
                            statusOptions.find(
                              (opt) => opt.value === request.status
                            )?.icon
                          }
                          <span className="capitalize">
                            {statusOptions.find(
                              (opt) => opt.value === request.status
                            )?.label || request.status}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              openDropdown === request.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {openDropdown === request.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                              role="button"
                              tabIndex={0}
                              aria-label="Close dropdown"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  setOpenDropdown(null);
                                }
                              }}
                            ></div>
                            <div className="absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                              {statusOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() =>
                                    handleStatusChange(request.id, option.value)
                                  }
                                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                    request.status === option.value
                                      ? "bg-gray-50 font-medium"
                                      : ""
                                  }`}
                                >
                                  <span
                                    className={getStatusColor(option.value)
                                      .replace("bg-", "text-")
                                      .replace("/100", "-600")}
                                  >
                                    {option.icon}
                                  </span>
                                  <span className="text-gray-700">
                                    {option.label}
                                  </span>
                                  {request.status === option.value && (
                                    <CheckCircle className="w-4 h-4 ml-auto text-primary" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(activeTab === "pending" ? pendingRequests : completedRequests)
          .length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t("table.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecycleDashboard;
