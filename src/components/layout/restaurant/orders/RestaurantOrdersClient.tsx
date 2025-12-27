"use client";

import { useEffect, useState, useCallback } from "react";
import { getRestaurantOrders, updateOrderStatus } from "@/frontend/api/Orders";
import { IOrder } from "@/backend/features/orders/order.model";
import { OrderStatus } from "@/backend/features/orders/order.types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function RestaurantOrdersClient() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Profile.restaurant.orders");

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: "orderPrice" | "status" | "createdAt" | null;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getRestaurantOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(t("statusUpdated"));
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error(t("updateError"));
    }
  };

  const handleSort = (key: "orderPrice" | "status" | "createdAt") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const key = sortConfig.key;
    const direction = sortConfig.direction === "asc" ? 1 : -1;

    if (key === "orderPrice") {
      return (a.orderPrice - b.orderPrice) * direction;
    }
    if (key === "createdAt") {
      return (
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
        direction
      );
    }
    if (key === "status") {
      return a.status.localeCompare(b.status) * direction;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const currentOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-[80%] mx-auto py-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/20 pb-4">
        <h1 className="text-3xl font-bold text-primary">{t("title")}</h1>
        <Badge
          variant="outline"
          className="text-lg px-4 py-1 border-primary/50 text-primary"
        >
          {orders.length} {t("totalOrders")}
        </Badge>
      </div>

      <div className="hidden md:block bg-card border border-primary/10 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-primary/5">
            <TableRow className="hover:bg-primary/5 border-b-primary/10">
              <TableHead className="font-semibold text-primary/80">
                {t("orderId")}
              </TableHead>
              <TableHead className="font-semibold text-primary/80">
                Products
              </TableHead>
              <TableHead
                className="font-semibold text-primary/80 cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  {t("date")}
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-primary/80 cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("orderPrice")}
              >
                <div className="flex items-center gap-1">
                  {t("total")}
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-primary/80 cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  {t("status")}
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="text-right font-semibold text-primary/80">
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  {t("noOrders")}
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((order) => (
                <TableRow
                  key={order._id?.toString()}
                  className="border-b-primary/5 hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={(e) => {
                    // Prevent modal opening when clicking action elements
                    if (
                      (e.target as HTMLElement).closest("button") ||
                      (e.target as HTMLElement).closest('[role="combobox"]') ||
                      (e.target as HTMLElement).closest(".badge-action")
                    ) {
                      return;
                    }
                    setSelectedOrder(order);
                    setIsModalOpen(true);
                  }}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {order._id?.toString().slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">
                      {order.items.length > 0
                        ? `${order.items.length} items`
                        : "No items"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    ${order.orderPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(
                        order.status
                      )} border-0 badge-action`}
                    >
                      {t(`statuses.${order.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) =>
                        handleStatusChange(
                          order._id!.toString(),
                          value as OrderStatus
                        )
                      }
                    >
                      <SelectTrigger
                        className="w-[140px] ml-auto border-primary/20 focus:ring-primary/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectValue placeholder={t("changeStatus")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          {t("statuses.pending")}
                        </SelectItem>
                        <SelectItem value="paid">
                          {t("statuses.paid")}
                        </SelectItem>
                        <SelectItem value="preparing">
                          {t("statuses.preparing")}
                        </SelectItem>
                        <SelectItem value="delivering">
                          {t("statuses.delivering")}
                        </SelectItem>
                        <SelectItem value="completed">
                          {t("statuses.completed")}
                        </SelectItem>
                        <SelectItem value="canceled">
                          {t("statuses.canceled")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card border border-primary/10 rounded-xl">
            {t("noOrders")}
          </div>
        ) : (
          currentOrders.map((order) => (
            <div
              key={order._id?.toString()}
              className="bg-card border border-primary/10 rounded-xl p-4 shadow-sm space-y-4 cursor-pointer hover:bg-primary/5 transition-colors"
              onClick={(e) => {
                // Prevent modal opening when clicking action elements
                if (
                  (e.target as HTMLElement).closest("button") ||
                  (e.target as HTMLElement).closest('[role="combobox"]') ||
                  (e.target as HTMLElement).closest(".badge-action")
                ) {
                  return;
                }
                setSelectedOrder(order);
                setIsModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-mono text-xs text-muted-foreground">
                    #{order._id?.toString().slice(-8).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-medium">
                      {typeof order.userId === "string"
                        ? order.userId.slice(-6)
                        : "User"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="font-bold text-lg text-primary">
                    ${order.orderPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 pt-2 border-t border-primary/5">
                <Badge className={`${getStatusColor(order.status)} border-0`}>
                  {t(`statuses.${order.status}`)}
                </Badge>

                <Select
                  defaultValue={order.status}
                  onValueChange={(value) =>
                    handleStatusChange(
                      order._id!.toString(),
                      value as OrderStatus
                    )
                  }
                >
                  <SelectTrigger className="w-[130px] h-8 text-xs border-primary/20 focus:ring-primary/20">
                    <SelectValue placeholder={t("changeStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      {t("statuses.pending")}
                    </SelectItem>
                    <SelectItem value="paid">{t("statuses.paid")}</SelectItem>
                    <SelectItem value="preparing">
                      {t("statuses.preparing")}
                    </SelectItem>
                    <SelectItem value="delivering">
                      {t("statuses.delivering")}
                    </SelectItem>
                    <SelectItem value="completed">
                      {t("statuses.completed")}
                    </SelectItem>
                    <SelectItem value="canceled">
                      {t("statuses.canceled")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-1xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {t("title")}
              <Badge variant="outline" className="ml-2">
                #{selectedOrder?._id?.toString().slice(-8).toUpperCase()}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedOrder &&
                new Date(selectedOrder.createdAt).toLocaleDateString(
                  undefined,
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Customer Info */}
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <h3 className="font-semibold text-lg text-primary mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">
                      Customer Name
                    </span>
                    <span className="font-medium text-base break-words">
                      {(selectedOrder.userId as any)?.firstName
                        ? `${(selectedOrder.userId as any).firstName} ${
                            (selectedOrder.userId as any).lastName
                          }`
                        : "Name Not Available"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">
                      Customer Phone
                    </span>
                    <span className="font-medium text-base">
                      {(selectedOrder.userId as any)?.phoneNumber || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">
                      Customer ID
                    </span>
                    <span className="font-mono text-sm">
                      {typeof selectedOrder.userId === "string"
                        ? selectedOrder.userId.slice(-8).toUpperCase()
                        : (selectedOrder.userId as any)?._id
                            ?.toString()
                            .slice(-8)
                            .toUpperCase() || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="p-4 bg-card border rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                {/* Mobile: Label + Badge Row. Tablet: Label only */}
                <div className="flex items-center justify-between w-full md:w-auto md:justify-start gap-3">
                  <span className="font-medium text-base">Order Status</span>
                  {/* Badge visible here on Mobile only */}
                  <Badge
                    className={`${getStatusColor(
                      selectedOrder.status
                    )} md:hidden border-0 text-base py-1 px-3 w-fit`}
                  >
                    {t(`statuses.${selectedOrder.status}`)}
                  </Badge>
                </div>

                {/* Mobile: Select Row. Tablet: Badge + Select Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                  {/* Badge visible here on Tablet only */}
                  <Badge
                    className={`${getStatusColor(
                      selectedOrder.status
                    )} hidden md:inline-flex border-0 text-base py-1 px-3 w-fit`}
                  >
                    {t(`statuses.${selectedOrder.status}`)}
                  </Badge>
                  <Select
                    defaultValue={selectedOrder.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        selectedOrder._id!.toString(),
                        value as OrderStatus
                      )
                    }
                  >
                    <SelectTrigger className="w-full md:w-[140px] border-primary/20 focus:ring-primary/20">
                      <SelectValue placeholder={t("changeStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        {t("statuses.pending")}
                      </SelectItem>
                      <SelectItem value="paid">{t("statuses.paid")}</SelectItem>
                      <SelectItem value="preparing">
                        {t("statuses.preparing")}
                      </SelectItem>
                      <SelectItem value="delivering">
                        {t("statuses.delivering")}
                      </SelectItem>
                      <SelectItem value="completed">
                        {t("statuses.completed")}
                      </SelectItem>
                      <SelectItem value="canceled">
                        {t("statuses.canceled")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products List */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-primary/5 px-4 py-3 border-b border-primary/10 font-semibold text-primary text-base">
                  Order Items
                </div>
                <div className="divide-y">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                          {item.quantity}x
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base break-words">
                            {(item.productId as any)?.name || "Product Item"}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            ${item.unitPrice.toFixed(2)} / unit
                          </div>
                        </div>
                      </div>
                      <div className="font-semibold text-base pl-12 md:pl-0">
                        Total: ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-2">
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${selectedOrder.orderPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Payment Method</span>
                    <span className="capitalize">
                      {selectedOrder.paymentMethod
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-primary">
                      ${selectedOrder.orderPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "paid":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "preparing":
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    case "delivering":
      return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20";
    case "completed":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "canceled":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "";
  }
}
