"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Step2() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: persist organization…
    router.push("/register/step3");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* purple progress bar at top */}
        <div className="h-1 w-1/4 bg-purple-600 mb-4 rounded"></div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-2 text-center">
              <h2 className="text-3xl font-bold">Let’s get to know your business</h2>
              <p className="text-gray-600">Enter your organization details</p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Organization Name</label>
                <Input
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <Input
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <Input
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
