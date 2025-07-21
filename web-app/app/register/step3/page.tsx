"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const periods = ["Daily", "Weekly", "Monthly", "Quarterly"] as const;
const weekStarts = ["Monday", "Sunday"] as const;
const structures = ["Morning", "Day", "Evening", "Night"] as const;

export default function Step3() {
  const router = useRouter();

  const [period, setPeriod] = useState<typeof periods[number]>('Weekly');
  const [weekStart, setWeekStart] = useState<typeof weekStarts[number]>('Monday');
  const [structure, setStructure] = useState<typeof structures[number]>('Morning');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: persist preferences...
    router.push("/register/step4");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        {/* 50% progress bar */}
        <div className="h-1 w-1/2 bg-purple-600 mb-4 rounded" />

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-2">
              <h2 className="text-3xl font-bold">Scheduling Preferences</h2>
              <p className="text-gray-600">How do you prefer to create schedules?</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Default Scheduling Period
                </label>
                <div className="flex gap-2 flex-wrap">
                  {periods.map(p => (
                    <Button
                      key={p}
                      size="sm"
                      variant={period === p ? "default" : "outline"}
                      onClick={() => setPeriod(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Of The Workweek
                </label>
                <div className="flex gap-2">
                  {weekStarts.map(w => (
                    <Button
                      key={w}
                      size="sm"
                      variant={weekStart === w ? "default" : "outline"}
                      onClick={() => setWeekStart(w)}
                    >
                      {w}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Typical Shift Structure
                </label>
                <div className="flex gap-2 flex-wrap">
                  {structures.map(s => (
                    <Button
                      key={s}
                      size="sm"
                      variant={structure === s ? "default" : "outline"}
                      onClick={() => setStructure(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
