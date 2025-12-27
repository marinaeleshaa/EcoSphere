"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItemCategory } from "@/backend/features/restaurant/restaurant.model";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";

interface CategorySelectProps {
  value: MenuItemCategory | undefined;
  onChange: (value: MenuItemCategory) => void;
  error?: string;
}

const CATEGORIES: MenuItemCategory[] = [
  "Fruits",
  "Vegetables",
  "Meat",
  "Dairy",
  "Bakery",
  "Beverages",
  "Snacks",
  "Other",
];

export default function CategorySelect({
  value,
  onChange,
  error,
}: Readonly<CategorySelectProps>) {
  const t = useTranslations("Restaurant.Products.Categories");

  return (
    <div className="space-y-2">
      <Label htmlFor="category">{t("label")}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`${error ? "border-red-500" : ""} w-full`}>
          <SelectValue placeholder={t("placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {t(category.toLowerCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
