"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, Users } from "lucide-react";
import { useTranslations } from "next-intl";
export default function WhyEcosphere() {
  const t = useTranslations("Events.WhyEcosphere");
  return (
    <section className="w-full py-16">
      <div className=" text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t("title")}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          {t("subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Calendar className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">
                {t("card1.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("card1.description")}
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <CheckCircle className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">
                {t("card2.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("card2.description")}
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Users className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">
                {t("card3.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("card3.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
