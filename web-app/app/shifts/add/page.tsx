// web‑app/app/shifts/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AddShiftPage() {
  const router = useRouter();

  // form state
  const [title, setTitle] = useState("");
  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("16:00");
  const [role, setRole] = useState("");
  const roleOptions = ["Kokk", "Vahetusevanem", "Ettekandja"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: call API to save shift
    // e.g. await api.createShift({...})
    router.push("/shifts");
  };

  return (
    <div className="flex h-full items-start justify-center bg-gray-50 p-8">
      <Card className="w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <h2 className="text-2xl font-bold">Create a New Shift</h2>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium">Shift Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning regular"
                required
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium">From</label>
                <Input
                  type="time"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-medium">To</label>
                <Input
                  type="time"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              Discard
            </Button>
            <Button type="submit">Save &amp; Shift</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}