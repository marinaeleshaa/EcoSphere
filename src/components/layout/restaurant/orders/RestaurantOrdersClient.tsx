"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";

export default function RestaurantOrdersClient() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Profile.restaurant.orders");

  const fetchOrders = async () => {
    try {
      const data = await getRestaurantOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error(t("fetchError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
          {orders.length} {t("totalOrders")}
        </Badge>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("orderId")}</TableHead>
              <TableHead>{t("customer")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("total")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  {t("noOrders")}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id?.toString()}>
                  <TableCell className="font-mono text-xs">
                    {order._id?.toString().slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {/* Note: Order model might need population for user name, but we have userId */}
                    {typeof order.userId === "string"
                      ? order.userId.slice(-6)
                      : "User"}
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${order.orderPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
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
                      <SelectTrigger className="w-[140px] ml-auto">
                        <SelectValue placeholder={t("changeStatus")} />
                      </SelectTrigger>
                      <SelectContent>
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
