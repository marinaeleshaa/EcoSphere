"use client";
import { Recycle, CheckCircle, Clock, Truck, Eye } from "lucide-react";
import { useState } from "react";

type orderStatus = "reviewing" | "pending" | "completed" | "out for delivery";

interface recycleOrder {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  location: string;
  status: orderStatus;
}

const RecycleDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [openDropdown, setOpenDropdown] = useState<null | string>(null);
  const [requests, setRequests] = useState<recycleOrder[]>([
    {
      id: "1",
      customerName: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      location: "123 Main St, New York, NY",
      status: "reviewing",
    },
    {
      id: "2",
      customerName: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
      location: "456 Oak Ave, Los Angeles, CA",
      status: "pending",
    },
    {
      id: "3",
      customerName: "Mike Brown",
      email: "mike.brown@email.com",
      phone: "+1 (555) 345-6789",
      location: "789 Pine Rd, Chicago, IL",
      status: "completed",
    },
    {
      id: "4",
      customerName: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+1 (555) 456-7890",
      location: "321 Elm St, Houston, TX",
      status: "out for delivery",
    },
    {
      id: "5",
      customerName: "David Wilson",
      email: "david.w@email.com",
      phone: "+1 (555) 567-8901",
      location: "654 Maple Dr, Phoenix, AZ",
      status: "completed",
    },
  ]);

  const pendingRequests = requests.filter((r) => r.status !== "completed");
  const completedRequests = requests.filter((r) => r.status === "completed");

  const handleStatusChange = (id: string, newStatus: orderStatus) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req,
      ),
    );
    setOpenDropdown(null);

    if (newStatus === "completed") {
      setTimeout(() => setActiveTab("completed"), 300);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const statusOptions = [
    {
      value: "reviewing",
      label: "Reviewing",
      icon: <Eye className="w-4 h-4" />,
    },
    { value: "pending", label: "Pending", icon: <Clock className="w-4 h-4" /> },
    {
      value: "out for delivery",
      label: "Out for Delivery",
      icon: <Truck className="w-4 h-4" />,
    },
    {
      value: "completed",
      label: "Completed",
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  const getStatusColor = (status: orderStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "out for delivery":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: <Recycle className="w-5 h-5" />,
    },
    {
      label: "Reviewing",
      value: requests.filter((r) => r.status === "reviewing").length,
      icon: <Eye className="w-5 h-5" />,
    },
    {
      label: "Pending",
      value: requests.filter((r) => r.status === "pending").length,
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Out for Delivery",
      value: requests.filter((r) => r.status === "out for delivery").length,
      icon: <Truck className="w-5 h-5" />,
    },
    {
      label: "Completed",
      value: requests.filter((r) => r.status === "completed").length,
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Recycle className="w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">
              Recycle Dashboard
            </h1>
          </div>

          <p className="text-primary-foreground/80 text-sm sm:text-base max-w-2xl mb-6">
            Manage and track all recycling requests. Review, process, and
            complete pickups efficiently.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
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
        </div>
      </div>

      {/* Tabs and Tables */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-primary pb-2">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 font-medium transition-colors relative cursor-pointer ${
              activeTab === "pending"
                ? "text-primary"
                : "text-muted-foreground/80 hover:text-muted-foreground"
            }`}
          >
            Active Requests
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
              {pendingRequests.length}
            </span>
            {activeTab === "pending" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === "completed"
                ? "text-primary"
                : "text-muted-foreground/80 hover:text-muted-foreground"
            }`}
          >
            Completed
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
              {completedRequests.length}
            </span>
            {activeTab === "completed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Table */}
        <div className="bg-secondary/10 rounded-xl shadow-lg overflow-visible">
          <div className="overflow-x-auto overflow-visible">
            <table className="w-full rounded-2xl">
              <thead>
                <tr className="bg-primary border-b border-primary text-primary-foreground overflow-visible">
                  <th className="px-6 py-4  text-center text-xs  font-semibold  uppercase">
                    Customer Name
                  </th>
                  <th className="px-6 py-4 text-center  text-xs font-semibold  uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center  text-xs font-semibold  uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-center  text-xs font-semibold  uppercase">
                    Location
                  </th>
                  <th className="px-6 py-4 text-center  text-xs font-semibold  uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary overflow-visible">
                {(activeTab === "pending"
                  ? pendingRequests
                  : completedRequests
                ).map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-foreground">
                        {request.customerName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                      {request.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                      {request.phone}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {request.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap relative overflow-visible">
                      {activeTab === "completed" ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}
                        >
                          Completed
                        </span>
                      ) : (
                        <div className="relative ">
                          <button
                            onClick={() => toggleDropdown(request.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 ${getStatusColor(request.status)}`}
                          >
                            {
                              statusOptions.find(
                                (opt) => opt.value === request.status,
                              )?.icon
                            }
                            <span className="capitalize">{request.status}</span>
                            <svg
                              className={`w-4 h-4 transition-transform ${openDropdown === request.id ? "rotate-180" : ""}`}
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
                              ></div>
                              <div className="absolute z-20 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                {statusOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() =>
                                      handleStatusChange(
                                        request.id,
                                        option.value as orderStatus,
                                      )
                                    }
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                      request.status === option.value
                                        ? "bg-gray-50 font-medium"
                                        : ""
                                    }`}
                                  >
                                    <span
                                      className={getStatusColor(
                                        option.value as orderStatus,
                                      )
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
              <p className="text-gray-500">No requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecycleDashboard;
