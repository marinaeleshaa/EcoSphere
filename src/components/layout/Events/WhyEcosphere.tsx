"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, Users } from "lucide-react";

export default function WhyEcosphere() {
  return (
    <section className="w-full py-16">
      <div className=" text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why Attend Events on Ecosphere?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          Ecosphere helps you discover, explore, and attend events effortlessly
          with everything you need in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Calendar className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">
                Centralized Event Discovery
              </h3>
              <p className="text-muted-foreground text-sm">
                Find all upcoming events in one unified platform without
                searching multiple sources.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <CheckCircle className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">
                Detailed Event Information
              </h3>
              <p className="text-muted-foreground text-sm">
                View schedules, locations, organizers, and all event details
                before attending.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <Users className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">
                Easy Attendance & Tracking
              </h3>
              <p className="text-muted-foreground text-sm">
                Join events easily and keep track of the events you plan to
                attend.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
